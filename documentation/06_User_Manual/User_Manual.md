# USER MANUAL
## Waste Collection Management System

### 1. Introduction
The Waste Collection Management System is a web-based application designed to simplify waste reporting, collection requests, staff assignment, and collection record management.

This manual explains how users can interact with the system.

### 2. System Requirements

**Hardware Requirements**
- Desktop computer or laptop
- Minimum 4 GB RAM
- Internet connection for accessing the web application

**Software Requirements**
- Windows, Linux, or macOS
- Modern web browser such as Google Chrome
- Java Runtime Environment
- SQLite database

### 3. Starting the Application

1. Open the project folder in Visual Studio Code.
2. Open the terminal.
3. Navigate to the backend folder:
   ```bash
   cd backend
   ```
4. Start the Spring Boot application:
   ```bash
   .\mvnw.cmd spring-boot:run
   ```
5. Wait until the backend server starts successfully.
6. Open `frontend/index.html` in a web browser.

### 4. Citizen Operations

#### 4.1 User Registration
1. Open the application.
2. Navigate to the registration section.
3. Enter the required details, such as name, email, phone number, and address.
4. Submit the registration form.

#### 4.2 Reporting Waste
1. Open the waste reporting section.
2. Select the waste category.
3. Enter the waste location.
4. Provide a description of the waste.
5. Submit the report.

#### 4.3 Requesting Waste Collection
1. Open the collection request section.
2. Select the waste category.
3. Enter the pickup location.
4. Provide the required details.
5. Submit the request.

#### 4.4 Tracking Requests
1. Open the request tracking section.
2. View the available collection requests.
3. Check the current status of a request.

### 5. Administrator Operations

#### 5.1 Viewing Dashboard
The administrator can view dashboard information related to users, waste reports, collection requests, staff, and collection records.

#### 5.2 Managing Staff
1. Open the staff management section.
2. Add staff details.
3. View the available staff list.
4. Update staff availability when required.

#### 5.3 Managing Collection Requests
1. View the collection requests.
2. Update the request status where permitted.
3. Assign an available staff member to a request.
4. Review the updated request details.

### 6. Collection Staff Operations

Collection staff details and availability are maintained through the staff management module.

Collection records can be entered with:
- Collection request ID
- Staff ID
- Collected quantity
- Quantity unit
- Remarks

When a collection record is successfully created, the associated request is marked as Completed.

### 7. Database Management

The application uses SQLite to store system information.

The database file is located at:

`database/waste_collection.db`

It stores user details, waste categories, waste reports, collection staff, collection requests, and collection records.

### 8. Troubleshooting

| Problem | Suggested Solution |
|---|---|
| Backend does not start | Check Java installation and run the Maven command again. |
| Frontend cannot load data | Ensure the backend server is running. |
| Database connection error | Verify the SQLite database path and configuration. |
| Request submission fails | Check the entered details and backend console output. |
| Data is not displayed | Check the API response and database records. |

### 9. Future Enhancements
- User authentication and role-based access.
- Email or SMS notifications.
- Interactive collection maps.
- Advanced waste collection analytics.
- Mobile-friendly application improvements.

### 10. Conclusion
The Waste Collection Management System provides a structured way to manage waste reports, collection requests, staff details, and collection records. This manual helps users understand the major operations available in the application.