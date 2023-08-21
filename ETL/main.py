import pandas as pd
import pymongo
import sqlite3
import json
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)


def extract_data_from_mongodb(collection_name, latest_date=None):
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client["pisos"]
    query = {} if latest_date is None else {"createdAt": {"$gt": latest_date}}
    collection = db[collection_name]
    documents = list(collection.find(query, no_cursor_timeout=True))
    return documents


def transform_data(documents, city):
    df = pd.DataFrame(documents)
    if '_id' in df.columns:
        df = df.drop('_id', axis=1)
    for col in df.columns:
        if df[col].apply(isinstance, args=(list,)).any():
            df[col] = df[col].apply(json.dumps)
    df['city'] = city
    return df


def load_data_to_sql(df, conn):
    df.to_sql("pisos", conn, if_exists='append', index=False)


def main():
    # Create a new SQLite database (or connect to existing one)
    conn = sqlite3.connect("pisos.db")
    cursor = conn.cursor()

    collections = pymongo.MongoClient("mongodb://localhost:27017/")["pisos"].list_collection_names()
    collections = [c for c in collections if c not in ["last_updated_dates", "amount_parsed"]]

    # Create the table for storing the last update dates
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS last_updated_dates (
        collection_name TEXT PRIMARY KEY,
        last_updated_date TEXT
    )
    ''')

    all_data = pd.DataFrame()
    for collection_name in collections:
        try:
            cursor.execute(
                f"SELECT last_updated_date FROM last_updated_dates WHERE collection_name = '{collection_name}'")
            result = cursor.fetchone()
            latest_date = result[0] if result is not None else None
        except sqlite3.OperationalError:
            # Table does not exist, set latest_date to None
            latest_date = None

        if latest_date is not None:
            latest_date = datetime.strptime(latest_date, "%Y-%m-%d %H:%M:%S.%f")

        logging.info(f"Extracting data from MongoDB collection: {collection_name}")
        documents = extract_data_from_mongodb(collection_name, latest_date)

        if not documents:
            continue

        logging.info("Transforming data...")
        df = transform_data(documents, collection_name)
        all_data = pd.concat([all_data, df], ignore_index=True)

        # Update the last_updated_dates table
        max_date = max(doc['createdAt'] for doc in documents)
        cursor.execute('''
        INSERT OR REPLACE INTO last_updated_dates (collection_name, last_updated_date)
        VALUES (?, ?)
        ''', (collection_name, max_date))

    logging.info(f"Loading data to SQLite table: pisos")
    load_data_to_sql(all_data, conn)
    conn.commit()
    conn.close()


if __name__ == "__main__":
    main()

