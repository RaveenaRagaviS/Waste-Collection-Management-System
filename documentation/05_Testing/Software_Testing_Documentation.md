# SOFTWARE TESTING DOCUMENTATION

## Project: Waste Collection Management System

## 1. Introduction

Software testing is performed to verify that the Waste Collection Management System works according to its requirements. Testing helps identify errors, verify API operations and ensure proper communication between the frontend, backend and database.

## 2. Testing Objectives

- Verify citizen registration.
- Verify waste report submission.
- Verify collection request creation.
- Verify staff registration and management.
- Verify staff assignment.
- Verify collection record creation.
- Verify dashboard statistics.
- Verify database connectivity.
- Identify invalid inputs and unexpected errors.

## 3. Testing Methods

### 3.1 Unit Testing

Individual components and application methods are tested independently to identify errors.

### 3.2 Integration Testing

Integration testing verifies communication between the frontend, Spring Boot backend and SQLite database.

### 3.3 Functional Testing

Functional testing checks whether the implemented features perform their expected operations.

### 3.4 Database Testing

Database testing verifies data insertion, retrieval, updates, primary keys, foreign keys and data consistency.

## 4. Test Cases

| Test ID | Test Scenario | Expected Result |
|---|---|---|
| TC-01 | Register a citizen with valid details | Citizen details should be stored. |
| TC-02 | Retrieve registered users | User details should be displayed. |
| TC-03 | Submit a waste report with valid details | Waste report should be stored. |
| TC-04 | Retrieve waste reports | Report details should be displayed. |
| TC-05 | Create a collection request | Request should be stored with Pending status. |
| TC-06 | Retrieve collection requests | Request details should be displayed. |
| TC-07 | Register collection staff | Staff details should be stored. |
| TC-08 | Change staff availability | Availability should be updated. |
| TC-09 | Assign staff to a collection request | Assigned staff information should be updated. |
| TC-10 | Update collection request status | Request status should be updated. |
| TC-11 | Create a collection record | Collection information should be stored. |
| TC-12 | Complete a collection record | Associated request should become Completed. |
| TC-13 | Retrieve dashboard information | Dashboard statistics should be displayed. |
| TC-14 | Inspect database integrity | Database integrity check should return OK. |

## 5. Database Testing

The SQLite database is tested using database inspection and verification scripts.

The following operations are verified:

- Table creation.
- Primary key constraints.
- Foreign key relationships.
- Unique constraints.
- Data insertion.
- Data retrieval.
- Data updates.
- Database integrity.

## 6. API Testing

The application provides REST API endpoints for the following operations:

| API Endpoint | HTTP Method | Purpose |
|---|---|---|
| /api/categories | GET | Retrieve waste categories |
| /api/users | POST | Register a user |
| /api/users | GET | Retrieve users |
| /api/reports | POST | Submit a waste report |
| /api/reports | GET | Retrieve reports |
| /api/staff | POST | Register staff |
| /api/staff | GET | Retrieve staff |
| /api/requests | POST | Create a collection request |
| /api/requests | GET | Retrieve collection requests |
| /api/records | POST | Create a collection record |
| /api/records | GET | Retrieve collection records |
| /api/dashboard | GET | Retrieve dashboard statistics |

Additional API operations support retrieving individual records, updating request status, assigning staff and updating staff availability.

## 7. Test Results

The following activities have been performed during project development:

- Backend application startup verified.
- SQLite database connection and integrity verified.
- User, report, staff and collection request workflows tested.
- Staff assignment and availability updates tested.
- Collection record creation and associated request completion tested.
- Frontend and backend integration tested during development.

Detailed individual test execution evidence and screenshots should be maintained separately.

## 8. Future Testing

The following testing activities should be completed before production deployment:

- Invalid input testing.
- Security and authorization testing.
- Performance testing.
- Browser compatibility testing.
- Python analysis module testing.
- Cloud deployment testing.

## 9. Conclusion

Testing helps ensure that the Waste Collection Management System performs its intended operations. Functional, integration and database testing are important for maintaining reliable application behaviour. Additional security, performance and deployment testing will be required before production use.