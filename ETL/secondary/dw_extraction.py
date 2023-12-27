import pandas as pd
import sqlite3
import itertools


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
    print(groups_new_names)
    if len(groups_new_names) > 1:
        for i, name in enumerate(groups_new_names):
            df.index = df.index.set_names(name, level=i)
    elif len(groups_new_names) == 1:
        df.index = df.index.set_names(groups_new_names[0], level=None)
    return df.reset_index()


def aggregate_data(df, numeric_cols, categorical_cols, groups_to_organize_by, all_groups_possibilities, ratio_definitions):
    agg_funcs = {col: 'mean' for col in numeric_cols}
    agg_funcs.update({col: 'count' for col in categorical_cols})

    if groups_to_organize_by:
        grouped_df = df.groupby(groups_to_organize_by).agg(agg_funcs)
        # Apply custom function for all ratios
        ratio_df = df.groupby(groups_to_organize_by).apply(lambda x: calculate_ratios(x, ratio_definitions))
        grouped_df = grouped_df.join(ratio_df)
        grouped_df = reindex(grouped_df, groups_to_organize_by)
    else:
        # Aggregate without groupby when there are no groups
        grouped_df = df.agg(agg_funcs)
        ratios = calculate_ratios(df, ratio_definitions)
        for ratio in ratios.index:
            grouped_df[ratio] = ratios[ratio]
        grouped_df = pd.DataFrame([grouped_df])

    # Set the value to 'all' for non-grouping columns
    for element in all_groups_possibilities:
        if element not in groups_to_organize_by:
            grouped_df[rename_col_to_group(element)] = 'all'

    return grouped_df

# ------------------------START EXTRACTION---------------------------------------
# Database connection (modify the path to your SQLite database file)
conn = sqlite3.connect('../../data_analysis/pisos_backup.db')

# Read data from 'pisos' table
query = 'SELECT * FROM pisos'
df = pd.read_sql(query, conn)

# Convert 'createdat' from Unix time to datetime
df['updated_month'] = pd.to_datetime(df['createdat'], unit='s').dt.to_period('M')

# Define the columns to be aggregated
numeric_columns = ['price_euro', 'superficie_construida_m2', 'superficie_util_m2', 'superficie_solar_m2',
                   'habitaciones', 'banos', 'gastos_de_comunidad_cleaned']
categorical_columns = ['city', 'type']  # Add more columns if needed

# Aggregate data for all records

# ------------------------START TRANSFORMATION---------------------------------------
group_variables = ['updated_month', 'city', 'type', 'active']
# Ratio definitions
ratio_definitions = {
    'price_per_m2': ('price_euro', 'superficie_util_m2'),
    'price_per_hab': ('price_euro', 'habitaciones'),
    'price_per_wc': ('price_euro', 'banos')
}

all_combinations = return_all_combinations(group_variables)
all_combinations.append([]) #to get the stats without grouping by
all_aggregated_data = [aggregate_data(df, numeric_columns, categorical_columns, groups, group_variables, ratio_definitions) for groups in all_combinations]

# Concatenate the results
final_df = pd.concat(all_aggregated_data)

final_df['updated_month_group'] = final_df['updated_month_group'].astype(str)

print(final_df)

# ------------------------START LOADING---------------------------------------

# Insert aggregated data into 'pisos_dw'
final_df.to_sql('pisos_dw', conn, if_exists='replace', index=False)

# Close the database connection
conn.close()
print("Data aggregation and insertion completed successfully.")
