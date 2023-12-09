import pymongo
import sqlite3
from datetime import datetime
import logging


class mongodbHandler():
    def __init__(self, mongouri, database, sql_cursor):
        self.mongouri = mongouri
        self.database = database
        self.cursor = sql_cursor
        self.collections = self.get_mongo_collections()
        self.update_dates = self.extract_latest_update_dates()
        self.all_documents = {}
        self.next_run_update_dates = {}

    def get_mongo_collections(self):
        collections = pymongo.MongoClient(self.mongouri)[self.database].list_collection_names()
        collections = [c for c in collections if c not in ["last_updated_dates", "amount_parsed"]]
        return collections

    def extract_latest_update_dates(self):
        update_dates = {}

        for collection_name in self.collections:
            try:
                self.cursor.execute(
                    f"SELECT last_updated_date FROM last_updated_dates WHERE collection_name = '{collection_name}'")
                result = self.cursor.fetchone()
                latest_date = result[0] if result is not None else None
            except sqlite3.OperationalError:
                # Table does not exist, set latest_date to None
                latest_date = None

            if latest_date is not None:
                latest_date = datetime.strptime(latest_date, "%Y-%m-%d %H:%M:%S.%f")

            update_dates[collection_name] = latest_date

        return update_dates

    def extract_data_from_mongodb(self, collection_name, latest_date=None):
        client = pymongo.MongoClient(self.mongouri)
        db = client[self.database]
        query = {} if latest_date is None else {"updatedAt": {"$gt": latest_date}}
        collection = db[collection_name]
        documents = list(collection.find(query, no_cursor_timeout=True))
        return documents

    def extract_data(self):
        all_documents = {}
        next_run_update_dates = {}

        for collection_name in self.collections:
            try:

                logging.info(f"Extracting data from MongoDB collection: {collection_name}")
                documents = self.extract_data_from_mongodb(collection_name, self.update_dates[collection_name])

                if not documents:
                    continue

                all_documents[collection_name] = documents

                # Update the last_updated_dates table
                max_date = max(doc['updatedAt'] for doc in documents)
                next_run_update_dates[collection_name] = max_date

            except Exception as e:
                logging.error(f"Failed to process {collection_name}: {e}")

        self.all_documents = all_documents
        self.next_run_update_dates = next_run_update_dates













