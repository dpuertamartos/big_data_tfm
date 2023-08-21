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


def transform_data(documents):
    df = pd.DataFrame(documents)
    if '_id' in df.columns:
        df = df.drop('_id', axis=1)
    for col in df.columns:
        if df[col].apply(isinstance, args=(list,)).any():
            df[col] = df[col].apply(json.dumps)
    return df


def load_data_to_sql(df, collection_name, conn, latest_date):
    if latest_date is None:
        df.to_sql(collection_name, conn, if_exists='replace', index=False)
    else:
        df.to_sql(collection_name, conn, if_exists='append', index=False)


def main():
    # Create a new SQLite database (or connect to existing one)
    conn = sqlite3.connect("pisos.db")
    cursor = conn.cursor()

    collections = pymongo.MongoClient("mongodb://localhost:27017/")["pisos"].list_collection_names()
    for collection_name in collections:
        try:
            cursor.execute(f"SELECT MAX(createdAt) FROM {collection_name}")
            latest_date = cursor.fetchone()[0]
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
        df = transform_data(documents)

        logging.info(f"Loading data to SQLite table: {collection_name}")
        load_data_to_sql(df, collection_name, conn, latest_date)

    conn.close()

if __name__ == "__main__":
    main()

