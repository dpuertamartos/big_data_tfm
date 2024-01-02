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
    formatted_date = max_date.strftime("%Y-%m-%d %H:%M:%S.%f")
    cursor.execute('''
    INSERT OR REPLACE INTO last_updated_dates (collection_name, last_updated_date)
    VALUES (?, ?)
    ''', (collection_name, formatted_date))


def table_exists(cursor, table_name):
    cursor.execute(''' SELECT count(name) FROM sqlite_master WHERE type='table' AND name=? ''', (table_name,))
    return cursor.fetchone()[0] == 1


def create_index(cursor, table_name, column_name):
    cursor.execute(f"PRAGMA index_list('{table_name}')")
    indexes = cursor.fetchall()
    index_exists = any(column_name in index[1] for index in indexes)
    if not index_exists:
        index_name = f"{table_name}_{column_name}_idx"
        cursor.execute(f"CREATE INDEX {index_name} ON {table_name} ({column_name})")
        logging.info(f"Index {index_name} created on table {table_name} for column {column_name}")
    else:
        logging.info(f"Index already exists on column {column_name} of table {table_name}")


def add_columns_to_table(conn):
    # Adding the 'prediction' column
    conn.execute("ALTER TABLE pisos ADD COLUMN prediction REAL")
    # Adding the 'predictionupdatedat' column
    conn.execute("ALTER TABLE pisos ADD COLUMN predictionupdatedat TIMESTAMP")
    # Adding the 'rating' column
    conn.execute("ALTER TABLE pisos ADD COLUMN rating REAL")
    conn.commit()


def load_data_to_sql(df, list_of_collections_correctly_transformed, future_run_update_dates, conn, cursor):
    logging.info("loading data into sql...")

    # Check if the 'pisos' table exists
    if not table_exists(cursor, 'pisos'):
        if df is not None:
            df.head(0).to_sql("pisos", conn, if_exists='replace', index=False)
            create_index(cursor, 'pisos', 'id')
            logging.info("table created and indexed")
            add_columns_to_table(conn)
            logging.info("columns needed for ML added to table pisos")

    if df is not None:
        # Existing IDs in the 'pisos' table
        cursor.execute('SELECT id FROM pisos')
        existing_ids = {row[0] for row in cursor.fetchall()}

        # Separate new entries from the existing ones
        new_entries = df[~df['id'].isin(existing_ids)]
        updates = df[df['id'].isin(existing_ids)]
        logging.info(f"New entries: {len(new_entries)}, updates: {len(updates)}")

        # Bulk insert new entries
        if not new_entries.empty:
            new_entries.to_sql("pisos", conn, if_exists='append', index=False)
            logging.info("New entries successfully inserted.")

        # Handle updates
        if not updates.empty:
            # Delete the outdated rows
            outdated_ids = updates['id'].tolist()
            cursor.execute("DELETE FROM pisos WHERE id IN ({seq})".format(seq=','.join(['?']*len(outdated_ids))), outdated_ids)

            # Insert the updated rows
            updates.to_sql("pisos", conn, if_exists='append', index=False)
            logging.info("Existing entries successfully updated.")

        # Update last_updated_dates for each collection
        for collection_name in list_of_collections_correctly_transformed:
            update_last_updated_dates(cursor, collection_name, future_run_update_dates[collection_name])

    else:
        logging.info("No data to load.")

    logging.info("Data loading process completed.")
    try:
        conn.commit()
    except Exception as e:
        logging.error("Final commit failed, data might be corrupted, rolling back...")
        logging.error(e)
        conn.rollback()
    finally:
        conn.close()
        logging.info("Database connection closed.")




