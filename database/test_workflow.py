
import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "waste_collection.db")

connection = sqlite3.connect(DB_PATH)
connection.execute("PRAGMA foreign_keys = ON")
cursor = connection.cursor()

try:
    # 1. Insert a citizen
    cursor.execute("""
        INSERT INTO users
        (name, email, phone, address, role)
        VALUES (?, ?, ?, ?, ?)
    """, (
        "Test Citizen",
        "testcitizen@example.com",
        "9876501234",
        "Salem",
        "citizen"
    ))

    user_id = cursor.lastrowid

    # 2. Select Plastic category
    cursor.execute("""
        SELECT category_id FROM waste_categories
        WHERE category_name = 'Plastic'
    """)

    category_id = cursor.fetchone()[0]

    # 3. Insert a waste report
    cursor.execute("""
        INSERT INTO waste_reports
        (user_id, category_id, location, description)
        VALUES (?, ?, ?, ?)
    """, (
        user_id,
        category_id,
        "Near bus stand",
        "Plastic waste dumped on roadside"
    ))

    report_id = cursor.lastrowid

    # 4. Insert a collection request
    cursor.execute("""
        INSERT INTO collection_requests
        (user_id, category_id, pickup_location)
        VALUES (?, ?, ?)
    """, (
        user_id,
        category_id,
        "Near bus stand"
    ))

    request_id = cursor.lastrowid

    # 5. Insert collection staff
    cursor.execute("""
        INSERT INTO collection_staff
        (staff_name, phone, assigned_area)
        VALUES (?, ?, ?)
    """, (
        "Kumar",
        "9876501235",
        "Salem"
    ))

    staff_id = cursor.lastrowid

    # 6. Assign staff to request
    cursor.execute("""
        UPDATE collection_requests
        SET staff_id = ?, status = 'Assigned'
        WHERE request_id = ?
    """, (staff_id, request_id))

    # 7. Insert completed collection record
    cursor.execute("""
        INSERT INTO collection_records
        (request_id, staff_id, collected_quantity, remarks)
        VALUES (?, ?, ?, ?)
    """, (
        request_id,
        staff_id,
        5.0,
        "Plastic waste collected successfully"
    ))

    # 8. Update request status
    cursor.execute("""
        UPDATE collection_requests
        SET status = 'Completed'
        WHERE request_id = ?
    """, (request_id,))

    connection.commit()

    print("WORKFLOW TEST SUCCESSFUL!")
    print("User ID:", user_id)
    print("Report ID:", report_id)
    print("Request ID:", request_id)
    print("Staff ID:", staff_id)
    print("Collected Quantity: 5 kg")
    print("Request Status: Completed")

except Exception as error:
    connection.rollback()
    print("Workflow test failed:", error)

finally:
    connection.close()
