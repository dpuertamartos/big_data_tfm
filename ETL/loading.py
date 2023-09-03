import sqlite3
import logging

def initialize_sql(sqluri):
    conn = sqlite3.connect(sqluri)
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS last_updated_dates (
        collection_name TEXT PRIMARY KEY,
        last_updated_date TEXT
    )
    ''')
    return conn, cursor


def update_last_updated_dates(cursor, collection_name, max_date):
    cursor.execute('''
    INSERT OR REPLACE INTO last_updated_dates (collection_name, last_updated_date)
    VALUES (?, ?)
    ''', (collection_name, max_date))


def load_data_to_sql(df, list_of_collections_correctly_transformed, future_run_update_dates, conn, cursor):
    logging.info("loading data into sql...")

    try:
        if df is not None:
            df.to_sql("pisos", conn, if_exists='append', index=False)
            # update dates
            for collection_name in list_of_collections_correctly_transformed:
                logging.info(f"updating date for correctly extracted, transformed and loaded {collection_name}")
                update_last_updated_dates(cursor, collection_name, future_run_update_dates[collection_name])

            logging.info("loading success...")
            conn.commit()  # Commit the transaction only if everything succeeds
        else:
            logging.info("No data to load")
            conn.commit()  # You can decide whether to commit when there's no data; you may not need to

    except Exception as e:
        logging.error("loading failed, data could be corrupted, rolling back...")
        ## NOTIFY!!
        logging.error(e)  # Log the exception for debugging
        conn.rollback()  # Rollback the transaction on an exception

    finally:
        conn.close()
        logging.info("connection to sql closed")