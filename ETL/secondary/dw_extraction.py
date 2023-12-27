import pandas as pd
import sqlite3

# Database connection (modify the path to your SQLite database file)
conn = sqlite3.connect('../../data_analysis/pisos_backup.db')

# Read data from 'pisos' table
query = 'SELECT * FROM pisos'
df = pd.read_sql(query, conn)

# Convert 'updatedat' from Unix time to datetime
df['updated_month'] = pd.to_datetime(df['updatedat'], unit='s').dt.to_period('M')

# Define the columns to be aggregated
numeric_columns = ['price_euro', 'superficie_construida_m2', 'superficie_util_m2', 'superficie_solar_m2', 'habitaciones', 'banos']
categorical_columns = ['city', 'type']  # Add more columns if needed

# Aggregation function
def aggregate_data(df, numeric_cols, categorical_cols, group_by_month=True):
    agg_funcs = {col: 'mean' for col in numeric_cols}
    agg_funcs.update({col: 'count' for col in categorical_cols})

    if group_by_month:
        # Group by month, city, and type
        grouped_df = df.groupby(['updated_month', 'city', 'type']).agg(agg_funcs)
        grouped_df.index.rename(['month', 'city_group', 'type_group'], inplace=True)
        grouped_df = grouped_df.reset_index()
        grouped_df['category'] = 'all'
    else:
        # Group only by city and type for active records
        grouped_df = df.groupby(['city', 'type']).agg(agg_funcs)
        grouped_df.index.rename(['city_group', 'type_group'], inplace=True)
        grouped_df = grouped_df.reset_index()
        grouped_df['category'] = 'active'



    return grouped_df

# Aggregate data for all records
agg_all_df = aggregate_data(df, numeric_columns, categorical_columns, group_by_month=True)

# Aggregate data only for active records
agg_active_df = aggregate_data(df[df['active'] == 1], numeric_columns, categorical_columns, group_by_month=False)

# Concatenate the results
final_df = pd.concat([agg_all_df, agg_active_df])

final_df['month'] = final_df['month'].astype(str)

# Insert aggregated data into 'pisos_dw'
final_df.to_sql('pisos_dw', conn, if_exists='replace', index=False)

# Close the database connection
conn.close()

print("Data aggregation and insertion completed successfully.")
