
import sqlite3
import pandas as pd
import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
from pathlib import Path

# --------------------------------------------------
# 1. DATABASE CONNECTION AND FILE PATHS
# --------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DB_PATH = PROJECT_ROOT / "database" / "waste_collection.db"

OUTPUT_DIR = Path(__file__).resolve().parent / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

connection = sqlite3.connect(DB_PATH)

print("=" * 50)
print("       WASTE COLLECTION DATA ANALYSIS")
print("=" * 50)


# --------------------------------------------------
# 2. LOAD DATABASE TABLES
# --------------------------------------------------

users = pd.read_sql_query("SELECT * FROM users", connection)
categories = pd.read_sql_query("SELECT * FROM waste_categories", connection)
reports = pd.read_sql_query("SELECT * FROM waste_reports", connection)
staff = pd.read_sql_query("SELECT * FROM collection_staff", connection)
requests = pd.read_sql_query("SELECT * FROM collection_requests", connection)
records = pd.read_sql_query("SELECT * FROM collection_records", connection)


# --------------------------------------------------
# 3. DATABASE SUMMARY
# --------------------------------------------------

print("\nDATABASE SUMMARY")
print("-" * 50)

print("Total Users:", len(users))
print("Total Waste Categories:", len(categories))
print("Total Waste Reports:", len(reports))
print("Total Collection Staff:", len(staff))
print("Total Collection Requests:", len(requests))
print("Total Collection Records:", len(records))


# --------------------------------------------------
# 4. STAFF DETAILS
# --------------------------------------------------

print("\nSTAFF DETAILS")
print("-" * 50)

print(staff[["staff_id", "staff_name", "assigned_area", "availability"]])


# --------------------------------------------------
# 5. WASTE CATEGORY REPORT ANALYSIS
# --------------------------------------------------

print("\nWASTE CATEGORY ANALYSIS")
print("-" * 50)

category_analysis = pd.read_sql_query("""
    SELECT
        wc.category_name,
        COUNT(wr.report_id) AS total_reports
    FROM waste_categories wc
    LEFT JOIN waste_reports wr
        ON wc.category_id = wr.category_id
    GROUP BY wc.category_id, wc.category_name
    ORDER BY total_reports DESC
""", connection)

print(category_analysis)

plt.figure(figsize=(10, 5))

bars = plt.bar(
    category_analysis["category_name"],
    category_analysis["total_reports"]
)

for bar in bars:
    height = bar.get_height()
    plt.text(
        bar.get_x() + bar.get_width() / 2,
        height,
        str(int(height)),
        ha="center",
        va="bottom"
    )

plt.title("Waste Reports by Category")
plt.xlabel("Waste Category")
plt.ylabel("Number of Reports")
plt.xticks(rotation=30)
plt.tight_layout()

plt.savefig(OUTPUT_DIR / "waste_category_analysis.png")
plt.close()


# --------------------------------------------------
# 6. COLLECTION STAFF PERFORMANCE ANALYSIS
# --------------------------------------------------

print("\nSTAFF PERFORMANCE ANALYSIS")
print("-" * 50)

staff_analysis = pd.read_sql_query("""
    SELECT
        cs.staff_id,
        cs.staff_name,
        cs.assigned_area,
        COUNT(cr.record_id) AS completed_collections,
        COALESCE(SUM(cr.collected_quantity), 0) AS total_quantity
    FROM collection_staff cs
    LEFT JOIN collection_records cr
        ON cs.staff_id = cr.staff_id
    GROUP BY cs.staff_id, cs.staff_name, cs.assigned_area
    ORDER BY completed_collections DESC
""", connection)

staff_analysis["staff_label"] = (
    staff_analysis["staff_name"] + " - " +
    staff_analysis["assigned_area"]
)

print(staff_analysis)

plt.figure(figsize=(9, 5))

bars = plt.bar(
    staff_analysis["staff_label"],
    staff_analysis["completed_collections"]
)

for bar in bars:
    height = bar.get_height()
    plt.text(
        bar.get_x() + bar.get_width() / 2,
        height,
        str(int(height)),
        ha="center",
        va="bottom"
    )

plt.title("Collection Staff Performance")
plt.xlabel("Staff Name and Area")
plt.ylabel("Completed Collections")
plt.xticks(rotation=20)
plt.tight_layout()

plt.savefig(OUTPUT_DIR / "staff_performance.png")
plt.close()


# --------------------------------------------------
# 7. COLLECTION QUANTITY BY WASTE CATEGORY
# --------------------------------------------------

print("\nCOLLECTION QUANTITY BY CATEGORY")
print("-" * 50)

quantity_analysis = pd.read_sql_query("""
    SELECT
        wc.category_name,
        COALESCE(SUM(cr.collected_quantity), 0) AS total_quantity
    FROM waste_categories wc
    LEFT JOIN collection_requests req
        ON wc.category_id = req.category_id
    LEFT JOIN collection_records cr
        ON req.request_id = cr.request_id
    GROUP BY wc.category_id, wc.category_name
    ORDER BY total_quantity DESC
""", connection)

print(quantity_analysis)

plt.figure(figsize=(10, 5))

plt.bar(
    quantity_analysis["category_name"],
    quantity_analysis["total_quantity"]
)

plt.title("Collected Waste Quantity by Category")
plt.xlabel("Waste Category")
plt.ylabel("Collected Quantity (kg)")
plt.xticks(rotation=30)
plt.tight_layout()

plt.savefig(OUTPUT_DIR / "quantity_by_category.png")
plt.close()


# --------------------------------------------------
# 8. COLLECTION REQUEST STATUS ANALYSIS
# --------------------------------------------------

print("\nCOLLECTION REQUEST STATUS")
print("-" * 50)

status_analysis = pd.read_sql_query("""
    SELECT
        status,
        COUNT(*) AS total_requests
    FROM collection_requests
    GROUP BY status
    ORDER BY total_requests DESC
""", connection)

print(status_analysis)

plt.figure(figsize=(7, 5))

plt.bar(
    status_analysis["status"],
    status_analysis["total_requests"]
)

plt.title("Collection Requests by Status")
plt.xlabel("Request Status")
plt.ylabel("Number of Requests")
plt.tight_layout()

plt.savefig(OUTPUT_DIR / "request_status_analysis.png")
plt.close()


# --------------------------------------------------
# 9. AREA-WISE COLLECTION PERFORMANCE
# --------------------------------------------------

print("\nAREA-WISE COLLECTION PERFORMANCE")
print("-" * 50)

area_analysis = pd.read_sql_query("""
    SELECT
        cs.assigned_area,
        COUNT(cr.record_id) AS completed_collections,
        COALESCE(SUM(cr.collected_quantity), 0) AS total_quantity
    FROM collection_staff cs
    LEFT JOIN collection_records cr
        ON cs.staff_id = cr.staff_id
    GROUP BY cs.assigned_area
    ORDER BY total_quantity DESC
""", connection)

print(area_analysis)

plt.figure(figsize=(8, 5))

plt.bar(
    area_analysis["assigned_area"],
    area_analysis["total_quantity"]
)

plt.title("Waste Collection by Area")
plt.xlabel("Area")
plt.ylabel("Collected Quantity (kg)")
plt.tight_layout()

plt.savefig(OUTPUT_DIR / "area_wise_collection.png")
plt.close()


# --------------------------------------------------
# 10. FINISH
# --------------------------------------------------

connection.close()

print("\n" + "=" * 50)
print("DATA ANALYSIS COMPLETED SUCCESSFULLY!")
print("Charts saved inside the output folder.")
print("=" * 50)
