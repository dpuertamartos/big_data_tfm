import pandas as pd
import sqlite3
import itertools


def return_all_combinations(array):
    all_combinations = []

    for L in range(1, len(array) + 1):
        for subset in itertools.combinations(array, L):
            all_combinations.append(list(subset))

    return all_combinations


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


# Aggregation function
def aggregate_data(df, numeric_cols, categorical_cols, groups_to_organize_by, all_groups_possibilities):
    agg_funcs = {col: 'mean' for col in numeric_cols}
    agg_funcs.update({col: 'count' for col in categorical_cols})

    grouped_df = df.groupby(groups_to_organize_by).agg(agg_funcs)
    grouped_df = reindex(grouped_df, groups_to_organize_by)

    #this will set the value to 'all' if we are not grouping by that group
    for element in all_groups_possibilities:
        if element not in groups_to_organize_by:
            grouped_df[rename_col_to_group(element)] = 'all'

    return grouped_df

# START EXTRACTION
# Database connection (modify the path to your SQLite database file)
conn = sqlite3.connect('../../data_analysis/pisos_backup.db')

# Read data from 'pisos' table
query = 'SELECT * FROM pisos'
df = pd.read_sql(query, conn)

# Convert 'createdat' from Unix time to datetime
df['updated_month'] = pd.to_datetime(df['createdat'], unit='s').dt.to_period('M')

# Define the columns to be aggregated
numeric_columns = ['price_euro', 'superficie_construida_m2', 'superficie_util_m2', 'superficie_solar_m2', 'habitaciones', 'banos']
categorical_columns = ['city', 'type']  # Add more columns if needed

# Aggregate data for all records

# START TRANSFORMATION
group_variables = ['updated_month', 'city', 'type', 'active']
all_combinations = return_all_combinations(group_variables)
all_aggregated_data = [aggregate_data(df, numeric_columns, categorical_columns, groups, group_variables) for groups in all_combinations]

# Concatenate the results
final_df = pd.concat(all_aggregated_data)

final_df['updated_month_group'] = final_df['updated_month_group'].astype(str)

print(final_df)

# START LOADING

# Insert aggregated data into 'pisos_dw'
final_df.to_sql('pisos_dw', conn, if_exists='replace', index=False)

# Close the database connection
conn.close()
print("Data aggregation and insertion completed successfully.")
