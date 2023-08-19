import pandas as pd
import pymongo
import sqlite3
import json
from datetime import datetime

# Step 1: Extract Data from MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["pisos"]
collections = db.list_collection_names()

# Create a new SQLite database (or connect to existing one)
conn = sqlite3.connect("pisos.db")
cursor = conn.cursor()

for collection_name in collections:
    # Check SQLite for the most recent createdAt timestamp in this collection
    try:
        cursor.execute(f"SELECT MAX(createdAt) FROM {collection_name}")
        latest_date = cursor.fetchone()[0]
    except sqlite3.OperationalError:
        # Table does not exist, set latest_date to None
        latest_date = None

    # Convert the latest_date from string to datetime if it exists
    if latest_date is not None:
        latest_date = datetime.strptime(latest_date, "%Y-%m-%d %H:%M:%S.%f")

    # Extract data from the collection with createdAt > latest_date
    query = {} if latest_date is None else {"createdAt": {"$gt": latest_date}}
    collection = db[collection_name]
    documents = list(collection.find(query))

    if not documents:
        continue

    # Step 2: Transform to Tabular Format
    df = pd.DataFrame(documents)

    # Drop the MongoDB-specific '_id' field
    if '_id' in df.columns:
        df = df.drop('_id', axis=1)

    # Convert list columns to JSON strings
    for col in df.columns:
        if df[col].apply(isinstance, args=(list,)).any():
            df[col] = df[col].apply(json.dumps)

    # Step 3: Store Data in SQL Database
    if latest_date is None:
        df.to_sql(collection_name, conn, if_exists='replace', index=False)
    else:
        df.to_sql(collection_name, conn, if_exists='append', index=False)

conn.close()

