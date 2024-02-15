import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")  # Conexión a MongoDB
db = client["pisos"]  # Nombre de tu base de datos

collections = db.list_collection_names()  # Lista de nombres de colecciones
collections = [c for c in collections if c not in ['last_updated_dates', 'amount parsed']]

for collection_name in collections:
    collection = db[collection_name]
    # Actualizar todos los documentos en la colección
    collection.update_many({}, {"$set": {"active": True}})

    print(f"All documents in collection '{collection_name}' have been updated with 'active': True.")

print("Update complete for all collections.")
