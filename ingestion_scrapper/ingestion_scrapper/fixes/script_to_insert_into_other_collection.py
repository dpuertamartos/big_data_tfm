from pymongo import MongoClient

def copy_modify_and_remove_source(db_name, source_collection_name, target_collection_name):
    # Connect to MongoDB
    client = MongoClient('localhost', 27017)
    db = client[db_name]

    source_collection = db[source_collection_name]
    target_collection = db[target_collection_name]

    # Find all documents in the source collection
    documents = source_collection.find({})

    # Modify and insert documents into the target collection
    for doc in documents:
        # Change the 'province' field value to match the target collection name
        doc['province'] = target_collection_name
        # Remove the '_id' field to avoid duplicate key error
        doc.pop('_id', None)

        # Insert the modified document into the target collection
        target_collection.insert_one(doc)

    # Drop the source collection
    source_collection.drop()

    print("Documents copied, modified, and source collection removed successfully.")

# Example usage
db_name = 'pisos'  # Replace with your database name
copy_modify_and_remove_source(db_name, 'vigo', 'pontevedra')
