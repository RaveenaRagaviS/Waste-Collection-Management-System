
import sqlite3
import os

# Connect to the project database
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "waste_collection.db")

connection = sqlite3.connect(DB_PATH)
connection.execute("PRAGMA foreign_keys = ON")

cursor = connection.cursor()

# Display all tables
cursor.execute("""
SELECT name FROM sqlite_master
WHERE type = 'table'
AND name NOT LIKE 'sqlite_%'
ORDER BY name
""")

tables = cursor.fetchall()

print("\nDATABASE VERIFICATION")
print("=====================")

for table in tables:
    print("Table:", table[0])

print("\nTotal tables:", len(tables))

# Check foreign key relationships
print("\nFOREIGN KEY VERIFICATION")
print("========================")

for table in [
    "waste_reports",
    "collection_requests",
    "collection_records"
]:
    cursor.execute(f"PRAGMA foreign_key_list({table})")
    print(f"\n{table}:")

    for relationship in cursor.fetchall():
        print("References:", relationship[2])

# Check database integrity
cursor.execute("PRAGMA integrity_check")
print("\nDatabase integrity:", cursor.fetchone()[0])

connection.close()
