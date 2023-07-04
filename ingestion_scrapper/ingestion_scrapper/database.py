import sqlite3
from sqlite3 import Error


def connect_db(db_name):
    conn = sqlite3.connect(db_name)
    return conn


def create_table(conn):
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS pisos (
        id TEXT PRIMARY KEY,
        title TEXT,
        location TEXT,
        city TEXT,
        price TEXT,
        characteristics TEXT,
        description TEXT,
        image_url TEXT,
        link TEXT
    )
    ''')

    conn.commit()


def insert_data(conn, data):
    cursor = conn.cursor()

    cursor.execute('''
    INSERT INTO pisos VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (data['id'], data['title'], data['location'], data['city'], data['price'], ', '.join(data['characteristics']), data['description'], data['image_url'], data['link']))

    conn.commit()

def check_id_exists(conn, id):
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM pisos WHERE id=?", (id,))
    data = cursor.fetchone()
    return True if data is not None else False


