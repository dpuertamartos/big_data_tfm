import pandas as pd
import sqlite3
import itertools
import re
import unicodedata
import argparse
from config import categorical_to_fill_NO, categorical_to_fill_DESCONOCIDO


def to_snake_case(s):
    # Replace specific characters like 'ñ' with an alternative ('n')
    s = s.replace('ñ', 'n').replace('Ñ', 'N')
    # Normalize the string (remove accents)
    s = ''.join(c for c in unicodedata.normalize('NFD', s)
                if unicodedata.category(c) != 'Mn')
    # Replace all non-alphanumeric characters (excluding underscore) with a space
    s = re.sub(r'[^\w\s]', ' ', s)
    # Replace all whitespace and underscores with a single underscore
    s = re.sub(r'[\s_]+', '_', s)
    # Convert to lowercase
    return s.lower()


def calculate_ratios(group, ratio_definitions):
    """Calculate average ratios for specified column pairs."""
    ratios = {}
    for ratio_name, (numerator, denominator) in ratio_definitions.items():
        ratio_value = (group[numerator] / group[denominator]).mean()
        ratios[ratio_name] = ratio_value
    return pd.Series(ratios)


def return_all_combinations(array):
    combs = []
    for L in range(1, len(array) + 1):
        for subset in itertools.combinations(array, L):
            combs.append(list(subset))

    return combs


def rename_col_to_group(col):
    return f'{col}_group'


def reindex(df, groups):
    groups_new_names = [rename_col_to_group(element) for element in groups]
    if len(groups_new_names) > 1:
        for i, name in enumerate(groups_new_names):
            df.index = df.index.set_names(name, level=i)
    elif len(groups_new_names) == 1:
        df.index = df.index.set_names(groups_new_names[0], level=None)
    return df.reset_index()


def handle_categorical_columns(df, categorical_cols, group_by):
    if group_by:
        result_df = pd.DataFrame()
    else:
        result_df = pd.DataFrame(index=[0])

    for col in categorical_cols:
        cat_values = df[col].unique()
        for value in cat_values:
            column_name = f"{col}_{to_snake_case(value)}_pct" if not pd.isna(value) else f"{col}_None_pct"
            if group_by:
                result_df[column_name] = df.groupby(group_by)[col].apply(
                    lambda x: (x == value).mean())
            else:
                count_value = (df[col] == value).sum() if not pd.isna(value) else df[col].isna().sum()
                result_df.at[0, column_name] = count_value / len(df)

    return result_df


def mean_excluding_outliers(series):
    q1 = series.quantile(0.25)
    q3 = series.quantile(0.75)
    iqr = q3 - q1
    lower_bound = q1 - 5 * iqr
    upper_bound = q3 + 5 * iqr
    filtered_series = series[(series >= lower_bound) & (series <= upper_bound)]
    return filtered_series.mean()


def std_excluding_outliers(series):
    q1 = series.quantile(0.25)
    q3 = series.quantile(0.75)
    iqr = q3 - q1
    lower_bound = q1 - 5 * iqr
    upper_bound = q3 + 5 * iqr
    filtered_series = series[(series >= lower_bound) & (series <= upper_bound)]
    return filtered_series.std()


def aggregate_data(df, numeric_cols, categorical_cols, groups_to_organize_by, all_groups_possibilities,
                   ratio_definitions):

    agg_funcs = {col: [mean_excluding_outliers, std_excluding_outliers] for col in numeric_cols}
    agg_funcs['count'] = 'count'  # Add count for each group
    df['count'] = 1

    if groups_to_organize_by:
        grouped_df = df.groupby(groups_to_organize_by).agg(agg_funcs)
        grouped_df.columns = [f'{col}_{func}' if col != 'count' else 'count'
                              for col, func in grouped_df.columns]
        # Apply custom function for all ratios
        ratio_df = df.groupby(groups_to_organize_by).apply(lambda x: calculate_ratios(x, ratio_definitions))
        grouped_df = grouped_df.join(ratio_df)

        # Handling categorical columns
        cat_df = handle_categorical_columns(df, categorical_cols, groups_to_organize_by)
        grouped_df = pd.concat([grouped_df, cat_df], axis=1)

        grouped_df = reindex(grouped_df, groups_to_organize_by)
    else:
        # Initialize a dictionary to hold general statistics
        general_stats = {}
        for col in numeric_cols:
            general_stats[f'{col}_mean_excluding_outliers'] = mean_excluding_outliers(df[col])
            general_stats[f'{col}_std_excluding_outliers'] = std_excluding_outliers(df[col])
        general_stats['count'] = len(df)

        # Calculate ratios
        ratios = calculate_ratios(df, ratio_definitions)
        for ratio_name, ratio_value in ratios.items():
            general_stats[ratio_name] = ratio_value

        # Handling categorical columns using handle_categorical_columns function
        cat_df = handle_categorical_columns(df, categorical_cols, None)

        general_stats_df = pd.Series(general_stats).to_frame().T
        grouped_df = pd.concat([general_stats_df, cat_df], axis=1)

    # Set the value to 'all' for non-grouping columns
    for element in all_groups_possibilities:
        if element not in groups_to_organize_by:
            grouped_df[rename_col_to_group(element)] = 'all'

    return grouped_df


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='ETL script for aggregating data.')
    parser.add_argument('--sql_uri', default='./pisos.db', help='SQL database URI.')

    args = parser.parse_args()
    sql_uri = args.sql_uri

    # ------------------------START EXTRACTION---------------------------------------
    # Database connection (modify the path to your SQLite database file)

    print("starting extraction")
    conn = sqlite3.connect(sql_uri)

    # Read data from 'pisos' table
    query = 'SELECT * FROM pisos'
    df = pd.read_sql(query, conn)

    # ------------------------START TRANSFORMATION---------------------------------------

    print("starting transformation")

    # Convert 'createdat' from Unix time to datetime
    df['updated_month'] = pd.to_datetime(df['createdat'], unit='s').dt.to_period('M')

    # Define the columns to be aggregated
    numeric_columns = ['price_euro', 'superficie_construida_m2', 'superficie_util_m2', 'superficie_solar_m2',
                       'habitaciones', 'banos', 'gastos_de_comunidad_cleaned']
    categorical_columns = categorical_to_fill_NO + \
                          ['conservacion', 'antiguedad', 'carpinteria_exterior_cleaned', 'tipo_suelo_summary',
                           'cocina_summary', 'orientacion_summary']  # Add more columns if needed

    for col in categorical_to_fill_NO:
        df[col].fillna('NO', inplace=True)
    for col in categorical_to_fill_DESCONOCIDO:
        df[col].fillna('DESCONOCIDO', inplace=True)

    # Aggregate data for all records

    group_variables = ['updated_month', 'province', 'type', 'active']
    # Ratio definitions
    ratio_definitions = {
        'price_per_m2': ('price_euro', 'superficie_util_m2'),
        'price_per_hab': ('price_euro', 'habitaciones'),
        'price_per_wc': ('price_euro', 'banos')
    }

    all_combinations = return_all_combinations(group_variables)
    all_combinations.append([])  # to get the stats without grouping by
    all_aggregated_data = [
        aggregate_data(df, numeric_columns, categorical_columns, groups, group_variables, ratio_definitions) for groups
        in all_combinations]

    # Concatenate the results
    final_df = pd.concat(all_aggregated_data)

    final_df['updated_month_group'] = final_df['updated_month_group'].astype(str)


    # ------------------------START LOADING---------------------------------------
    print("starting loading")

    # Insert aggregated data into 'pisos_dw'
    final_df.to_sql('pisos_dw', conn, if_exists='replace', index=False)

    # Close the database connection
    conn.close()
    print("Data aggregation and insertion completed successfully.")
