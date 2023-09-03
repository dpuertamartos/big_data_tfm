from extraction import mongodbHandler
from transformation import transform_all_data
from loading import initialize_sql, load_data_to_sql
import logging
import argparse


def main(sql_uri="./pisos.db", mongo_uri="mongodb://localhost:27017/", mongo_db="pisos"):

    logging.basicConfig(level=logging.INFO)

    conn, cursor = initialize_sql(sql_uri)
    mongo_handler = mongodbHandler(mongouri=mongo_uri, database=mongo_db, sql_cursor=cursor)

    mongo_handler.extract_data()

    transformed_data, list_of_collections_transformed = transform_all_data(mongo_handler.all_documents)
    logging.info(f"list of collections transformed: {list_of_collections_transformed}")
    load_data_to_sql(transformed_data, list_of_collections_transformed, mongo_handler.next_run_update_dates, conn, cursor)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='ETL script for processing data.')
    parser.add_argument('--sql_uri', default='./pisos.db', help='SQL database URI.')
    parser.add_argument('--mongo_uri', default='mongodb://localhost:27017/', help='MongoDB URI.')
    parser.add_argument('--mongo_db', default='pisos', help='MongoDB database name.')

    args = parser.parse_args()

    main(sql_uri=args.sql_uri, mongo_uri=args.mongo_uri, mongo_db=args.mongo_db)
