import sqlite3
import json

# Path to your SQLite database
db_path = 'pisos.db'

# Connect to the SQLite database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Execute the query
query = "SELECT * FROM pisos ORDER BY createdat DESC LIMIT 10000"
cursor.execute(query)
rows = cursor.fetchall()


columns = [description[0] for description in cursor.description]
data = [dict(zip(columns, row)) for row in rows]

# Convert the data to JSON format
json_data = json.dumps(data, indent=4, ensure_ascii=False)

conn.close()

with open('data.json', 'w', encoding='UTF-8') as file:
    file.write(json_data)

print("Data extracted and converted to JSON.")
