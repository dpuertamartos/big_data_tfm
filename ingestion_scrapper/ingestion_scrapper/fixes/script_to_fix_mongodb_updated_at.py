import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")  # Conexión a MongoDB
db = client["pisos"]  # Nombre de tu base de datos

collections = db.list_collection_names()  # Lista de nombres de colecciones
collections = [c for c in collections if c not in ['last_updated_dates', 'amount parsed']]

for collection_name in collections:
    collection = db[collection_name]
    all_ids = collection.distinct("id")  # Obtener todos los ids únicos

    for id in all_ids:
        # Buscar todos los documentos con el mismo id
        duplicates = list(collection.find({"id": id}))

        if len(duplicates) > 1:
            # Ordenar los duplicados por fecha de creación
            duplicates.sort(key=lambda x: x['createdAt'])
            oldest = duplicates[0]
            newest = duplicates[-1]

            newest_created_at = newest['createdAt']

            # Preparar el documento a mantener
            updated_document = newest
            updated_document['createdAt'] = oldest['createdAt']
            updated_document['updatedAt'] = newest_created_at
            updated_document['version'] = len(duplicates) - 1

            # Actualizar el documento en la base de datos
            collection.replace_one({"_id": newest['_id']}, updated_document)

            # Eliminar todos los duplicados excepto el más reciente
            for duplicate in duplicates[:-1]:
                collection.delete_one({"_id": duplicate['_id']})

        elif len(duplicates) == 1:
            updated_document = duplicates[0]
            if 'version' not in updated_document or 'updatedAt' not in updated_document:
                updated_document['version'] = 0
                updated_document['updatedAt'] = updated_document['createdAt']
                collection.replace_one({"_id": updated_document['_id']}, updated_document)

    print(f"collection {collection_name} finished...")

print("Database cleanup complete.")
