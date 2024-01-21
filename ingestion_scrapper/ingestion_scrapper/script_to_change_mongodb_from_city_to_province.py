from pymongo import MongoClient

def rename_city_to_province(db_name):
    # Connect to MongoDB
    client = MongoClient('localhost', 27017)
    db = client[db_name]

    # Iterate through each collection in the database
    for collection_name in db.list_collection_names():
        collection = db[collection_name]

        # Update all documents in the collection
        collection.update_many({}, {'$rename': {'city': 'province'}})

    print("Field rename completed.")

# Replace 'your_db_name' with the name of your database
rename_city_to_province('pisos')
