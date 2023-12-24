import pandas as pd
import sqlite3

def generate_csv_from_db(database, csv_name='pisos.csv'):
    # Connect to SQLite database
    conn = sqlite3.connect(database)

    # Read table into a Pandas DataFrame
    df = pd.read_sql_query("SELECT * FROM pisos", conn)

    # Write DataFrame to CSV with utf-8 encoding
    df.to_csv(csv_name, index=False, encoding='utf-8')

    # Close the connection
    conn.close()
    print(f'{csv_name} correctly generated from {database}')
