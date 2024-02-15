import pymongo
import datetime

#Run this script to populate the amount_parsed collection with the total number of documents (flats) from all collections prior to implementing the new feature in your spider.
# Connect to the MongoDB server and select the "pisos" database
client = pymongo.MongoClient('mongodb://localhost:27017/')
db = client['pisos']

# Count the total number of documents in each collection
total_documents = 0
for collection_name in db.list_collection_names():
    if collection_name not in ['amount_parsed', 'last_updated_dates']:  # Exclude the amount_parsed collection itself and 'last_updated_dates'
        total_documents += db[collection_name].count_documents({})

# Update the `amount_parsed` collection with the current date and total count
db['amount_parsed'].insert_one({
    'date': datetime.datetime.utcnow(),
    'count': total_documents
})

print(f"Total documents in all collections: {total_documents}")
print("Data updated in the 'amount_parsed' collection.")

# Close the MongoDB connection
client.close()






