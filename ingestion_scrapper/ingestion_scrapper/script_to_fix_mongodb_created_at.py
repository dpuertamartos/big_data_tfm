from pymongo import MongoClient
from datetime import datetime

# Connect to the MongoDB instance running on localhost at the default port 27017
client = MongoClient('localhost', 27017)

# Select the 'pisos' database
db = client['pisos']

# Get a list of all collections (cities) in the database
collections = db.list_collection_names()

# For each collection (city), update all documents to include the 'createdAt' field
for collection_name in collections:
    collection = db[collection_name]

    # Update all documents in the collection to include the current date as the 'createdAt' field
    collection.update_many(
        {}, # Filter to match all documents
        {
            '$set': {'createdAt': datetime.now()} # Update operation
        }
    )

    print(f"Updated collection '{collection_name}' with 'createdAt' field")

print("All documents have been updated with the 'createdAt' field.")
