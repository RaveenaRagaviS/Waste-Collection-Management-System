# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

## Project: Waste Collection Management System

## 1. Introduction

### 1.1 Purpose

The purpose of this document is to describe the functional and non-functional requirements of the Waste Collection Management System. It defines the system features, users, interfaces and constraints.

### 1.2 Scope

The system is a web-based application that manages citizen registration, waste reports, collection requests, staff details and collection records. It uses Java Spring Boot for backend operations and SQLite for data storage.

A separate Python-based module is planned for analysing waste collection data.

### 1.3 Intended Users

- Citizens: Register, report waste problems and request collection.
- Administrators: Manage users, reports, staff and collection requests.
- Collection Staff: Participate in assigned waste collection activities.

## 2. Overall Description

### 2.1 Product Perspective

The Waste Collection Management System consists of a web frontend, Java backend and SQLite database.

The frontend communicates with the backend through REST API endpoints. The backend processes requests and performs database operations using JDBC.

### 2.2 Product Functions

The main functions include:

1. Citizen registration.
2. Waste reporting.
3. Collection request creation.
4. Staff registration and management.
5. Staff availability management.
6. Staff assignment to collection requests.
7. Collection record maintenance.
8. Request tracking.
9. Administrative dashboard.
10. Python-based data analysis (planned module).

### 2.3 User Characteristics

- Citizens should have basic knowledge of using a web browser.
- Administrators should understand the system's management functions.
- Collection staff should be able to follow assigned collection activities.

## 3. Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | The system shall allow citizens to register. |
| FR-02 | The system shall allow users to submit waste reports. |
| FR-03 | The system shall allow users to create collection requests. |
| FR-04 | The system shall display collection request details. |
| FR-05 | The system shall allow administrators to register staff. |
| FR-06 | The system shall maintain staff availability. |
| FR-07 | The system shall allow staff assignment to collection requests. |
| FR-08 | The system shall allow administrators to update request status. |
| FR-09 | The system shall store completed collection records. |
| FR-10 | The system shall display dashboard statistics. |
| FR-11 | The system shall retrieve records from the SQLite database. |
| FR-12 | The planned Python module shall analyse collection data. |

## 4. Non-Functional Requirements

### 4.1 Performance

The system should respond to normal user operations within a reasonable time.

### 4.2 Reliability

The application should maintain consistent database records and handle invalid requests appropriately.

### 4.3 Usability

The interface should be simple, clear and easy to navigate.

### 4.4 Maintainability

The application should use separate frontend, backend and database components to make maintenance easier.

### 4.5 Security

The system should validate user input and protect database operations. Authentication and role-based access control should be implemented before production use.

### 4.6 Portability

The application should be capable of running on compatible systems with the required Java and database environment.

## 5. External Interface Requirements

### 5.1 User Interface

The system provides web pages for registration, waste reporting, collection requests, tracking, staff management and administration.

### 5.2 Software Interface

- Frontend: HTML, CSS and JavaScript.
- Backend: Java Spring Boot.
- Database: SQLite.
- Database connectivity: JDBC.
- Data analysis: Python (planned).

### 5.3 Communication Interface

The frontend communicates with the backend using HTTP requests and REST API endpoints.

## 6. Hardware Requirements

- Computer or laptop.
- Minimum 4 GB RAM recommended.
- Keyboard and mouse.
- Internet connection for accessing the deployed application.

## 7. Software Requirements

- Windows, Linux or another compatible operating system.
- Java Development Kit.
- Maven.
- Visual Studio Code or another suitable IDE.
- SQLite database.
- Python 3 for the planned analysis module.
- Modern web browser.

## 8. Constraints and Assumptions

- The application requires a compatible Java runtime.
- The SQLite database file must be accessible to the backend.
- Users must provide valid information when submitting forms.
- The Python analysis module will depend on the availability of collection data.
- Production deployment requires suitable database persistence and security configuration.

## 9. Conclusion

This SRS defines the requirements of the Waste Collection Management System. It provides a foundation for system design, development, testing and future enhancement.