
# SYSTEM ARCHITECTURE AND MODULE DESIGN

## 1. Introduction

The Waste Collection Management System is a web-based application developed to simplify and organize waste reporting, collection requests, staff management, and collection record maintenance.

The system allows citizens to register, report waste disposal problems, and request waste collection. Administrators can manage collection staff, assign staff to requests, monitor request statuses, and maintain collection records.

The system also includes a Python-based data analysis module that analyzes information stored in the database and generates charts to help understand waste collection activities.

## 2. System Architecture

The system follows a three-tier architecture.

### 2.1 Presentation Layer

The presentation layer provides the user interface through which users interact with the application.

Technologies:
- HTML
- CSS
- JavaScript

Responsibilities:
- Display the home page and system information.
- Allow citizens to register.
- Provide waste reporting forms.
- Allow users to submit collection requests.
- Display collection request information.
- Provide staff management features.
- Display the administrator dashboard.

### 2.2 Application Layer

The application layer handles the system's business logic and communication between the frontend and database.

Technology:
- Java
- Spring Boot
- REST APIs
- JDBC

Responsibilities:
- Process citizen registration.
- Handle waste reports.
- Manage collection requests.
- Retrieve and update staff information.
- Assign staff to collection requests.
- Update collection request statuses.
- Record completed waste collections.
- Provide dashboard information.
- Communicate with the SQLite database.

### 2.3 Data Layer

The data layer stores and manages the information required by the application.

Technology:
- SQLite

Database file:

`database/waste_collection.db`

The database contains the following six tables:

1. users
2. waste_categories
3. waste_reports
4. collection_staff
5. collection_requests
6. collection_records

The database maintains relationships between users, waste categories, reports, staff, requests, and collection records.

## 3. Overall System Workflow

The system follows this general workflow:

1. A citizen registers in the application.
2. The citizen submits a waste report or creates a collection request.
3. The application sends the information to the Spring Boot backend through REST APIs.
4. The backend validates and processes the information.
5. The information is stored in the SQLite database.
6. The administrator views collection requests and assigns available staff.
7. The administrator can update the request status.
8. After collection is completed, a collection record is created.
9. The dashboard displays the available collection information.
10. The Python analysis module reads database information and generates analytical reports and charts.

## 4. Module Design

### 4.1 Citizen Registration Module

Purpose:

Allows citizens to register and store their information in the system.

Main functions:
- Enter citizen name.
- Enter email address.
- Enter phone number.
- Enter address.
- Save citizen details in the database.
- Retrieve registered user information.

Database table:
- users

### 4.2 Waste Reporting Module

Purpose:

Allows citizens to report waste disposal problems in their surroundings.

Main functions:
- Select waste category.
- Enter waste location.
- Provide a description.
- Submit the waste report.
- Store the report in the database.
- Retrieve submitted waste reports.

Database tables:
- waste_reports
- waste_categories
- users

### 4.3 Waste Collection Request Module

Purpose:

Allows citizens to request waste collection from a specified location.

Main functions:
- Select waste category.
- Enter pickup location.
- Submit a collection request.
- View collection request details.
- Track request status.
- Allow administrators to update request status.

Database tables:
- collection_requests
- users
- waste_categories
- collection_staff

### 4.4 Collection Staff Management Module

Purpose:

Allows administrators to maintain collection staff information and availability.

Main functions:
- Add collection staff.
- View staff details.
- View assigned areas.
- Check staff availability.
- Update staff availability.
- Assign staff to collection requests.

Database table:
- collection_staff

### 4.5 Collection Record Management Module

Purpose:

Maintains information about completed waste collection activities.

Main functions:
- Select the relevant collection request.
- Record the assigned staff member.
- Enter collected waste quantity.
- Specify the quantity unit.
- Enter collection remarks.
- Store the completed collection record.
- Update the associated request status to Completed.

Database tables:
- collection_records
- collection_requests
- collection_staff

### 4.6 Administrator Dashboard Module

Purpose:

Provides administrators with an overview of waste collection activities.

Main functions:
- View total registered users.
- View total waste reports.
- View collection requests.
- View collection staff.
- Monitor request statuses.
- Assign staff to requests.
- Manage staff availability.
- View collection records.

The dashboard retrieves information from the backend through REST APIs.

### 4.7 Python Data Analysis Module

Purpose:

Analyzes waste collection information stored in the SQLite database and generates useful reports and visualizations.

Technologies:
- Python
- Pandas
- Matplotlib
- SQLite

Main functions:

1. Database Summary:
   - Displays the total number of users.
   - Displays the total number of waste categories.
   - Displays the total number of waste reports.
   - Displays the total number of collection staff.
   - Displays the total number of collection requests.
   - Displays the total number of collection records.

2. Waste Category Analysis:
   - Calculates the number of reports submitted under each waste category.
   - Displays the results in a table.
   - Generates a bar chart showing waste reports by category.

3. Staff Performance Analysis:
   - Calculates completed collections for each staff member.
   - Calculates the total quantity collected by each staff member.
   - Displays staff performance information.
   - Generates a staff performance chart.

4. Collection Quantity by Category:
   - Calculates the total collected quantity for each waste category.
   - Displays the results in a table.
   - Generates a bar chart.

5. Collection Request Status Analysis:
   - Counts collection requests according to their status.
   - Displays the number of requests in each status.
   - Generates a request status chart.

6. Area-wise Collection Performance:
   - Calculates completed collections by assigned area.
   - Calculates the total quantity collected in each area.
   - Generates an area-wise collection chart.

Output:

The generated charts are saved in:

`python-analysis/output/`

The analysis module reads existing database information. It does not modify the database records.

## 5. Database Design

The system uses SQLite as its database management system.

The database consists of six tables.

| Table Name | Purpose |
|---|---|
| users | Stores citizen and user details |
| waste_categories | Stores available waste categories |
| waste_reports | Stores submitted waste reports |
| collection_staff | Stores collection staff details |
| collection_requests | Stores collection requests and assignments |
| collection_records | Stores completed collection details |

### 5.1 Relationships

- One user can submit multiple waste reports.
- One waste category can be associated with multiple waste reports.
- One user can create multiple collection requests.
- One waste category can be associated with multiple collection requests.
- One staff member can be assigned to multiple collection requests.
- One collection request can produce at most one collection record.
- One staff member can record multiple completed collections.

## 6. Communication Between Components

The frontend communicates with the backend through REST API endpoints.

The Spring Boot backend communicates with the SQLite database using JDBC.

The Python analysis module independently connects to the same SQLite database using Python's built-in sqlite3 library and Pandas.

The communication flow is:

Frontend → Spring Boot REST APIs → JDBC → SQLite Database

Python Analysis Module → SQLite Database → Pandas and Matplotlib → Charts

## 7. Technologies Used

| Component | Technology |
|---|---|
| Frontend | HTML |
| Styling | CSS |
| Frontend interactions | JavaScript |
| Backend language | Java |
| Backend framework | Spring Boot |
| API communication | REST APIs |
| Database connectivity | JDBC |
| Database | SQLite |
| Data analysis | Python |
| Data processing | Pandas |
| Data visualization | Matplotlib |
| Development environment | Visual Studio Code |

## 8. Conclusion

The Waste Collection Management System combines web technologies, Java-based backend development, SQLite database management, and Python data analysis.

The three-tier architecture separates the presentation, application, and data layers, making the system easier to understand and maintain.

The implemented modules support citizen registration, waste reporting, collection requests, staff management, collection records, and administrator dashboard operations.

The Python data analysis module provides additional insights through database summaries, category analysis, staff performance analysis, request status analysis, and area-wise collection visualizations.

The system provides a foundation for organized waste collection management and can be extended with additional features in the future.
