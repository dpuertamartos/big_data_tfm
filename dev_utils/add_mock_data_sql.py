import sqlite3
import random
import time

# Connect to the SQLite database (replace 'your_database.db' with your database file)
conn = sqlite3.connect('pisos_backup.db')
cursor = conn.cursor()

# # Add the new columns to the 'pisos' table
cursor.execute("ALTER TABLE pisos ADD COLUMN predicted_price REAL")
cursor.execute("ALTER TABLE pisos ADD COLUMN rating REAL")
cursor.execute("ALTER TABLE pisos ADD COLUMN deletedat INTEGER")

# Fetch all rows from the 'pisos' table
cursor.execute("SELECT id, price_euro, active, updatedat FROM pisos")
rows = cursor.fetchall()

for row in rows:
    id, price_euro, active, updatedat = row

    # Manejar casos donde price_euro es nulo
    if price_euro is not None:
        # Calcular predicted_price
        change_percentage = random.uniform(-0.75, 0.75)  # Porcentaje aleatorio entre -75% y +75%
        predicted_price = price_euro * (1 + change_percentage)

        # Calcular rating
        rating = change_percentage
    else:
        # Establecer predicted_price y rating a nulo si price_euro es nulo
        predicted_price = None
        rating = None

    # Determine active status and deletedat value
    if random.random() < 0.4:  # 40% probability
        active = 0  # Set active to false
        deletedat = random.randint(updatedat, int(time.time()))  # Random timestamp between updatedat and now
    else:
        active = 1  # Keep active as true
        deletedat = None  # Set deletedat to NULL

    # Update the row
    cursor.execute("""
        UPDATE pisos
        SET predicted_price = ?, rating = ?, active = ?, deletedat = ?
        WHERE id = ?
    """, (predicted_price, rating, active, deletedat, id))

# Commit the changes
conn.commit()

# Close the connection
conn.close()
