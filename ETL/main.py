import pandas as pd
import pymongo
import sqlite3
import json
from datetime import datetime
import logging
import re
from unidecode import unidecode


logging.basicConfig(level=logging.INFO)


def convert_to_snake_case(name):
    name = unidecode(name)  # Remove accented characters
    name = re.sub('[^0-9a-zA-Z]+', '_', name)  # Replace any non-alphanumeric characters with underscore
    return name.lower()  # Convert to lower case to get snake_case


def update_last_updated_dates(cursor, collection_name, max_date):
    cursor.execute('''
    INSERT OR REPLACE INTO last_updated_dates (collection_name, last_updated_date)
    VALUES (?, ?)
    ''', (collection_name, max_date))


def extract_data_from_mongodb(collection_name, latest_date=None):
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client["pisos"]
    query = {} if latest_date is None else {"createdAt": {"$gt": latest_date}}
    collection = db[collection_name]
    documents = list(collection.find(query, no_cursor_timeout=True))
    return documents

def summarize_to_yes(value, consider_as_no = []):
    if value is not None and isinstance(value, str):
        value = value.strip().upper()  # Strip whitespace and convert to lower case

    consider_as_no = [v.strip().upper() for v in consider_as_no] # Strip whitespace and convert to lower case

    if value in ['NO'] + consider_as_no:
        return 'NO'
    elif pd.isnull(value) or value == '' or value is None:
        return None
    else:
        return 'YES'


def clean_gastos(value):
    if value is None:
        return None
    # Extract all numeric values from the string
    string_value = str(value).lower()

    nums = re.findall(r"\d+\.?\d*", string_value)
    nums = [float(n) for n in nums]

    divisor = 1
    if 'año' in string_value or "anual" in string_value:
        divisor = 12
    elif 'semestr' in string_value:
        divisor = 6
    elif 'trimestr' in string_value:
        divisor = 3

    multiplier = 1
    if "más" in string_value:
        multiplier = 1.35

    if len(nums) == 1:
        return nums[0] * multiplier / divisor
    elif len(nums) == 2:
        return ((nums[0] + nums[1]) * multiplier) / (2 * divisor)
    else:
        return None

# Define the function to calculate the "mascotas" value
def get_mascotas(row):
    aceptan = row.get('se_aceptan_mascotas', None)
    no_aceptan = row.get('no_se_aceptan_mascotas', None)

    if aceptan is not None and isinstance(aceptan, str):
        return 'YES'
    elif no_aceptan is not None and isinstance(no_aceptan, str):
        return 'NO'
    else:
        return None

def transform_data(documents, city):
    df = pd.DataFrame(documents)
    if '_id' in df.columns:
        df = df.drop('_id', axis=1)
    for col in df.columns:
        if df[col].apply(isinstance, args=(list,)).any():
            df[col] = df[col].apply(json.dumps)
    df['city'] = city

    # Transform the "price" and "old price" columns
    for col in ['price', 'old_price', 'superficie_construida', 'superficie_útil', 'superficie_solar']:
        if col in df.columns:
            df[col] = df[col].apply(
                lambda x: int(re.sub('[^0-9]', '', x)) if isinstance(x, str) and re.sub('[^0-9]', '',
                                                                                        x) != '' else None)
            # Rename the columns
            new_col_name = f"{col.replace(' ', '_')}_euro" if 'price' in col else f"{col.replace(' ', '_')}_m2"
            df.rename(columns={col: new_col_name}, inplace=True)

    # Convert "habitaciones" and "banos" to numeric types
    for col in ["habitaciones", "banos"]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')

    # summarize to "yes", "no", "null"
    for col in ['exterior', 'vidrios_dobles', 'adaptado_a_personas_con_movilidad_reducida']:
        if col in df.columns:
            df[col+"_summary"] = df[col].apply(summarize_to_yes)

    df["amueblado_summary"] = df["amueblado"].apply(summarize_to_yes, consider_as_no = ["SIN AMUEBLAR", "VACÍO"])
    # Create the new "mascotas" column
    df['mascotas_summary'] = df.apply(get_mascotas, axis=1)


    # Clean the gastos_de_comunidad column
    if 'gastos_de_comunidad' in df.columns:
        df['gastos_de_comunidad_cleaned'] = df['gastos_de_comunidad'].apply(clean_gastos)

    df.columns = [convert_to_snake_case(col) for col in df.columns]

    return df


def load_data_to_sql(df, conn):
    df.to_sql("pisos", conn, if_exists='append', index=False)


def main():
    # Create a new SQLite database (or connect to existing one)
    conn = sqlite3.connect("pisos.db")
    cursor = conn.cursor()

    collections = pymongo.MongoClient("mongodb://localhost:27017/")["pisos"].list_collection_names()
    collections = [c for c in collections if c not in ["last_updated_dates", "amount_parsed"]]

    # Create the table for storing the last update dates
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS last_updated_dates (
        collection_name TEXT PRIMARY KEY,
        last_updated_date TEXT
    )
    ''')

    list_of_dfs = []
    for collection_name in collections:
        try:
            try:
                cursor.execute(
                    f"SELECT last_updated_date FROM last_updated_dates WHERE collection_name = '{collection_name}'")
                result = cursor.fetchone()
                latest_date = result[0] if result is not None else None
            except sqlite3.OperationalError:
                # Table does not exist, set latest_date to None
                latest_date = None

            if latest_date is not None:
                latest_date = datetime.strptime(latest_date, "%Y-%m-%d %H:%M:%S.%f")

            logging.info(f"Extracting data from MongoDB collection: {collection_name}")
            documents = extract_data_from_mongodb(collection_name, latest_date)

            if not documents:
                continue

            logging.info("Transforming data...")
            df = transform_data(documents, collection_name)
            list_of_dfs.append(df)

            # Update the last_updated_dates table
            max_date = max(doc['createdAt'] for doc in documents)
            update_last_updated_dates(cursor, collection_name, max_date)
        except Exception as e:
            logging.error(f"Failed to process {collection_name}: {e}")

    all_data = pd.concat(list_of_dfs, ignore_index=True)
    logging.info(f"Loading data to SQLite table: pisos")
    load_data_to_sql(all_data, conn)
    conn.commit()
    conn.close()


if __name__ == "__main__":
    main()

