import pandas as pd
import sqlite3
import time

def generate_csv_from_db(database, age_in_months=6, csv_name='pisos.csv'):
    # Connect to SQLite database
    conn = sqlite3.connect(database)

    query = "SELECT * FROM pisos"

    if age_in_months and age_in_months > 0:
        months_ago_unix_time = time.time() - (age_in_months * 30 * 24 * 60 * 60)
        query += f' WHERE updatedat > {months_ago_unix_time}'

    # Read table into a Pandas DataFrame
    df = pd.read_sql_query(query, conn)

    # Write DataFrame to CSV with utf-8 encoding
    df.to_csv(csv_name, index=False, encoding='utf-8')

    # Close the connection
    conn.close()
    print(f'{csv_name} correctly generated from {database}')
