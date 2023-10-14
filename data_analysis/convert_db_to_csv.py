import pandas as pd
import sqlite3

# Connect to SQLite database
conn = sqlite3.connect('pisos.db')

# Read table into a Pandas DataFrame
df = pd.read_sql_query("SELECT * FROM pisos", conn)

# Write DataFrame to CSV with utf-8 encoding
df.to_csv('pisos.csv', index=False, encoding='utf-8')

# Close the connection
conn.close()
