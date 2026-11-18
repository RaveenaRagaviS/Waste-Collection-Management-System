
import sqlite3

connection = sqlite3.connect("database/waste_collection.db")

query = """
SELECT name, sql
FROM sqlite_master
WHERE type = 'table'
AND name NOT LIKE 'sqlite_%'
"""

tables = connection.execute(query).fetchall()

for table_name, table_structure in tables:
    print("\nTABLE:", table_name)
    print(table_structure)

connection.close()
import sqlite3
from pathlib import Path

db_path = Path(__file__).resolve().parent / "waste_collection.db"

connection = sqlite3.connect(db_path)
cursor = connection.cursor()

tables = [
    "users",
    "waste_categories",
    "waste_reports",
    "collection_staff",
    "collection_requests",
    "collection_records"
]

print("\nDATABASE RECORD COUNTS")
print("----------------------")

for table in tables:
    cursor.execute(f"SELECT COUNT(*) FROM {table}")
    count = cursor.fetchone()[0]
    print(f"{table}: {count} records")

connection.close()