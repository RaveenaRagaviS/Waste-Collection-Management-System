
import sqlite3
import os

# Database connection
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "waste_collection.db")

connection = sqlite3.connect(DB_PATH)
connection.execute("PRAGMA foreign_keys = ON")
cursor = connection.cursor()

# Create users table if it doesn't exist
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT
)
""")

# Add new columns without deleting existing records
cursor.execute("PRAGMA table_info(users)")
existing_columns = [column[1] for column in cursor.fetchall()]

if "address" not in existing_columns:
    cursor.execute("ALTER TABLE users ADD COLUMN address TEXT")

if "role" not in existing_columns:
    cursor.execute(
        "ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'citizen'"
    )


# Create waste categories table
cursor.execute("""
CREATE TABLE IF NOT EXISTS waste_categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name TEXT NOT NULL UNIQUE,
    description TEXT
)
""")

# Insert default waste categories
categories = [
    ("Plastic", "Plastic bottles, bags and wrappers"),
    ("Paper", "Newspapers, cardboard and paper"),
    ("Organic", "Food waste and garden waste"),
    ("Glass", "Glass bottles and containers"),
    ("Metal", "Iron, aluminium and metal scraps"),
    ("Electronic", "Old electronic devices and components")
]

cursor.executemany("""
INSERT OR IGNORE INTO waste_categories
(category_name, description)
VALUES (?, ?)
""", categories)


# Create waste reports table
cursor.execute("""
CREATE TABLE IF NOT EXISTS waste_reports (
    report_id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER NOT NULL,

    category_id INTEGER NOT NULL,

    location TEXT NOT NULL,

    description TEXT,

    image_path TEXT,

    report_date TEXT DEFAULT CURRENT_TIMESTAMP,

    status TEXT DEFAULT 'Pending',

    FOREIGN KEY (user_id)
        REFERENCES users(user_id),

    FOREIGN KEY (category_id)
        REFERENCES waste_categories(category_id)
)
""")

print("Waste reports table created successfully!")

# Create collection staff table
cursor.execute("""
CREATE TABLE IF NOT EXISTS collection_staff (
    staff_id INTEGER PRIMARY KEY AUTOINCREMENT,
    staff_name TEXT NOT NULL,
    phone TEXT UNIQUE,
    assigned_area TEXT,
    availability TEXT DEFAULT 'Available'
)
""")

print("Collection staff table created successfully!")

# Create collection requests table
cursor.execute("""
CREATE TABLE IF NOT EXISTS collection_requests (
    request_id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER NOT NULL,

    category_id INTEGER NOT NULL,

    staff_id INTEGER,

    pickup_location TEXT NOT NULL,

    request_date TEXT DEFAULT CURRENT_TIMESTAMP,

    scheduled_date TEXT,

    status TEXT DEFAULT 'Pending',

    FOREIGN KEY (user_id)
        REFERENCES users(user_id),

    FOREIGN KEY (category_id)
        REFERENCES waste_categories(category_id),

    FOREIGN KEY (staff_id)
        REFERENCES collection_staff(staff_id)
)
""")

print("Collection requests table created successfully!")

# Create collection records table
cursor.execute("""
CREATE TABLE IF NOT EXISTS collection_records (
    record_id INTEGER PRIMARY KEY AUTOINCREMENT,

    request_id INTEGER NOT NULL UNIQUE,

    staff_id INTEGER NOT NULL,

    collected_quantity REAL NOT NULL,

    quantity_unit TEXT DEFAULT 'kg',

    collection_date TEXT DEFAULT CURRENT_TIMESTAMP,

    remarks TEXT,

    FOREIGN KEY (request_id)
        REFERENCES collection_requests(request_id),

    FOREIGN KEY (staff_id)
        REFERENCES collection_staff(staff_id)
)
""")

print("Collection records table created successfully!")

connection.commit()

# Display waste categories
cursor.execute("SELECT * FROM waste_categories")

print("\nWASTE CATEGORIES")
print("----------------")

for category in cursor.fetchall():
    print(category)

# Display table structure
cursor.execute("PRAGMA table_info(users)")

print("\nUSERS TABLE STRUCTURE")
print("---------------------")

for column in cursor.fetchall():
    print(column[1], "-", column[2])

connection.close()

print("\nUsers table updated successfully!")
