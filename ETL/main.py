from extraction import mongodbHandler
from transformation import transform_all_data
from loading import initialize_sql, load_data_to_sql
import logging


def main():

    logging.basicConfig(level=logging.INFO)

    conn, cursor = initialize_sql("pisos.db")
    mongo_handler = mongodbHandler(mongouri="mongodb://localhost:27017/", database="pisos", sql_cursor=cursor)

    mongo_handler.extract_data()

    transformed_data, list_of_collections_transformed = transform_all_data(mongo_handler.all_documents)
    logging.info(f"list of collections transformed: {list_of_collections_transformed}")
    load_data_to_sql(transformed_data, list_of_collections_transformed, mongo_handler.next_run_update_dates, conn, cursor)


if __name__ == "__main__":
    main()
