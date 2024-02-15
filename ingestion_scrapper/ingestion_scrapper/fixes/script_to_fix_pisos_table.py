import sqlite3


def add_columns_to_table(database_path):
    with sqlite3.connect(database_path) as conn:
        # Adding the 'prediction' column
        conn.execute("ALTER TABLE pisos ADD COLUMN prediction REAL")

        # Adding the 'predictionupdatedat' column
        conn.execute("ALTER TABLE pisos ADD COLUMN predictionupdatedat TIMESTAMP")

        # Adding the 'rating' column
        conn.execute("ALTER TABLE pisos ADD COLUMN rating REAL")

        conn.commit()
    print("Columns added to 'pisos' table.")


def main():
    database_path = "pisos_backup.db"

    # Add columns to the table
    add_columns_to_table(database_path)


if __name__ == "__main__":
    main()
