
// ==========================================
// 1. WELCOME BUTTON
// ==========================================

function showMessage() {
    alert("Welcome to the Waste Collection Management System! Let's make our environment cleaner.");
}


// ==========================================
// 2. LOAD DASHBOARD
// ==========================================

async function loadDashboard() {
    try {
        const response = await fetch("http://localhost:8080/api/dashboard");

        if (!response.ok) {
            throw new Error("Unable to fetch dashboard data");
        }

        const data = await response.json();

        document.getElementById("totalUsers").textContent = data.total_users;
        document.getElementById("totalReports").textContent = data.total_reports;
        document.getElementById("totalStaff").textContent = data.total_staff;
        document.getElementById("totalRequests").textContent = data.total_requests;
        document.getElementById("pendingRequests").textContent = data.pending_requests;
        document.getElementById("completedRequests").textContent = data.completed_requests;
        document.getElementById("totalWaste").textContent =
            data.total_waste_collected + " kg";

    } catch (error) {
        console.error("Dashboard error:", error);

        document.querySelectorAll("#dashboard .service-card p")
            .forEach(item => item.textContent = "Unable to load");
    }
}


// ==========================================
// 3. CITIZEN REGISTRATION
// ==========================================

document.getElementById("registrationForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const message = document.getElementById("registrationMessage");

    const userData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
        role: "citizen"
    };

    try {
        message.textContent = "Registering...";

        const response = await fetch("http://localhost:8080/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        const result = await response.text();

        if (!response.ok) {
            throw new Error(result || "Registration failed");
        }

        message.textContent = "Registration successful!";
        message.style.color = "green";

        document.getElementById("registrationForm").reset();

        await loadDashboard();
        await loadAdminData();

    } catch (error) {
        message.textContent = "Registration failed: " + error.message;
        message.style.color = "red";
    }
});


// ==========================================
// 4. WASTE REPORT SUBMISSION
// ==========================================

document.getElementById("reportForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const message = document.getElementById("reportMessage");

    const reportData = {
        user_id: Number(document.getElementById("reportUserId").value),
        category_id: Number(document.getElementById("wasteCategory").value),
        location: document.getElementById("wasteLocation").value.trim(),
        description: document.getElementById("wasteDescription").value.trim()
    };

    try {
        message.textContent = "Submitting report...";

        const response = await fetch("http://localhost:8080/api/reports", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reportData)
        });

        const result = await response.text();

        if (!response.ok) {
            throw new Error(result || "Report submission failed");
        }

        message.textContent = "Waste report submitted successfully!";
        message.style.color = "green";

        document.getElementById("reportForm").reset();

        await loadDashboard();
        await loadAdminData();

    } catch (error) {
        message.textContent = "Report failed: " + error.message;
        message.style.color = "red";
    }
});


// ==========================================
// 5. WASTE COLLECTION REQUEST
// ==========================================

document.getElementById("requestForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const message = document.getElementById("requestMessage");

    const requestData = {
        user_id: Number(document.getElementById("requestUserId").value),
        category_id: Number(document.getElementById("requestCategory").value),
        staff_id: Number(document.getElementById("requestStaffId").value),
        pickup_location: document.getElementById("pickupLocation").value.trim(),
        scheduled_date: document.getElementById("scheduledDate").value
    };

    try {
        message.textContent = "Submitting collection request...";

        const response = await fetch("http://localhost:8080/api/requests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        });

        const result = await response.text();

        if (!response.ok) {
            throw new Error(result || "Collection request failed");
        }

        message.textContent = "Collection request submitted successfully!";
        message.style.color = "green";

        document.getElementById("requestForm").reset();

        await loadDashboard();
        await loadAdminData();

    } catch (error) {
        message.textContent = "Request failed: " + error.message;
        message.style.color = "red";
    }
});


// ==========================================
// 6. TRACK COLLECTION REQUESTS
// ==========================================

document.getElementById("trackingForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const userId = Number(document.getElementById("trackingUserId").value);
    const results = document.getElementById("trackingResults");

    results.textContent = "Loading your collection requests...";

    try {
        const response = await fetch("http://localhost:8080/api/requests");

        if (!response.ok) {
            throw new Error("Unable to retrieve collection requests");
        }

        const requests = await response.json();

        const userRequests = requests.filter(request =>
            Number(request.user_id) === userId
        );

        results.replaceChildren();

        if (userRequests.length === 0) {
            results.textContent = "No collection requests found for this User ID.";
            return;
        }

        const heading = document.createElement("h3");
        heading.textContent = "Your Collection Requests";
        results.appendChild(heading);

        userRequests.forEach(request => {
            const card = document.createElement("div");
            card.className = "service-card";

            const details = [
                `Request ID: ${request.request_id}`,
                `Category ID: ${request.category_id}`,
                `Pickup Location: ${request.pickup_location}`,
                `Scheduled Date: ${request.scheduled_date || "Not scheduled"}`
            ];

            details.forEach(detail => {
                const paragraph = document.createElement("p");
                paragraph.textContent = detail;
                card.appendChild(paragraph);
            });

            const status = document.createElement("p");
            status.textContent = "Status: " + request.status;
            status.style.fontWeight = "bold";
            status.style.color =
                request.status === "Completed" ? "green" : "orange";

            card.appendChild(status);
            results.appendChild(card);
        });

    } catch (error) {
        console.error("Tracking error:", error);
        results.textContent = "Unable to load requests: " + error.message;
    }
});


// ==========================================
// 7. RECORD WASTE COLLECTION
// ==========================================

document.getElementById("recordForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const message = document.getElementById("recordMessage");

    const recordData = {
        request_id: Number(document.getElementById("recordRequestId").value),
        staff_id: Number(document.getElementById("recordStaffId").value),
        collected_quantity: Number(document.getElementById("collectedQuantity").value),
        quantity_unit: "kg",
        remarks: document.getElementById("recordRemarks").value.trim()
    };

    try {
        message.textContent = "Saving collection record...";
        message.style.color = "black";

        const response = await fetch("http://localhost:8080/api/records", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(recordData)
        });

        const result = await response.text();

        if (!response.ok) {
            throw new Error(result || "Unable to save collection record");
        }

        message.textContent =
            "Collection record saved successfully! Request status updated to Completed.";

        message.style.color = "green";

        document.getElementById("recordForm").reset();

        await loadDashboard();
        await loadAdminData();

        const trackingForm = document.getElementById("trackingForm");

        if (trackingForm && document.getElementById("trackingUserId").value) {
            trackingForm.requestSubmit();
        }

    } catch (error) {
        console.error("Collection record error:", error);

        message.textContent = "Collection record failed: " + error.message;
        message.style.color = "red";
    }
});


// ==========================================
// 8. STAFF REGISTRATION
// ==========================================

document.getElementById("staffForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const message = document.getElementById("staffMessage");

    const staffData = {
        staff_name: document.getElementById("staffName").value.trim(),
        phone: document.getElementById("staffPhone").value.trim(),
        assigned_area: document.getElementById("assignedArea").value.trim(),
        availability: document.getElementById("staffAvailability").value
    };

    try {
        message.textContent = "Registering staff...";

        const response = await fetch("http://localhost:8080/api/staff", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(staffData)
        });

        const result = await response.text();

        if (!response.ok) {
            throw new Error(result || "Staff registration failed");
        }

        message.textContent = "Staff registered successfully!";
        message.style.color = "green";

        document.getElementById("staffForm").reset();

        await loadStaff();
        await loadDashboard();
        await loadAdminData();

    } catch (error) {
        message.textContent = "Staff registration failed: " + error.message;
        message.style.color = "red";
    }
});


// ==========================================
// 9. DISPLAY ALL STAFF MEMBERS
// ==========================================

async function loadStaff() {

    const staffList = document.getElementById("staffList");

    staffList.textContent = "Loading staff details...";

    try {
        const response = await fetch("http://localhost:8080/api/staff");

        if (!response.ok) {
            throw new Error("Unable to retrieve staff details");
        }

        const staffMembers = await response.json();

        window.allStaff = staffMembers;

        staffList.replaceChildren();

        if (staffMembers.length === 0) {
            staffList.textContent = "No staff members registered yet.";
            return;
        }

        staffMembers.forEach(staff => {

            const card = document.createElement("div");
            card.className = "service-card";

            const details = [
                "Staff ID: " + staff.staff_id,
                "Name: " + staff.staff_name,
                "Phone: " + staff.phone,
                "Assigned Area: " + staff.assigned_area,
                "Availability: " + staff.availability
            ];

            details.forEach(detail => {
                const paragraph = document.createElement("p");
                paragraph.textContent = detail;
                card.appendChild(paragraph);
            });

            staffList.appendChild(card);
        });

    } catch (error) {
        console.error("Staff loading error:", error);
        staffList.textContent = "Unable to load staff: " + error.message;
    }
}


// ==========================================
// 10. VIEW STAFF BUTTON
// ==========================================

document.getElementById("loadStaffButton").addEventListener("click", loadStaff);


// ==========================================
// 11. ADMIN DASHBOARD - DISPLAY TABLES
// ==========================================


function displayAdminTable(containerId, columns, data) {

    const container = document.getElementById(containerId);
    container.replaceChildren();

    if (!data || data.length === 0) {
        container.textContent = "No records available.";
        return;
    }

    const table = document.createElement("table");
    table.className = "admin-table";

    const thead = document.createElement("thead");
    const headingRow = document.createElement("tr");

    columns.forEach(column => {
        const th = document.createElement("th");
        th.textContent = column.label;
        headingRow.appendChild(th);
    });

    // Actions column
    if (containerId === "adminRequests" ||
        containerId === "adminStaff") {

        const th = document.createElement("th");
        th.textContent = "Actions";
        headingRow.appendChild(th);
    }

    thead.appendChild(headingRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    data.forEach(item => {

        const row = document.createElement("tr");

        columns.forEach(column => {
            const td = document.createElement("td");
            const value = item[column.key];

            td.textContent =
                value === null || value === undefined || value === ""
                    ? "-"
                    : String(value);

            row.appendChild(td);
        });

        // ======================================
        // COLLECTION REQUEST ACTIONS
        // ======================================

        if (containerId === "adminRequests") {

            const actionCell = document.createElement("td");

            // Status dropdown
            const statusSelect = document.createElement("select");

            ["Pending", "Approved", "Completed"].forEach(status => {

                const option = document.createElement("option");
                option.value = status;
                option.textContent = status;

                if (item.status === status) {
                    option.selected = true;
                }

                statusSelect.appendChild(option);
            });

            // Update status button
            const updateButton = document.createElement("button");

            updateButton.type = "button";
            updateButton.textContent = "Update Status";

            updateButton.addEventListener("click", async function() {

                const selectedStatus = statusSelect.value;

                if (selectedStatus === "Completed") {
                    alert("Please complete this request by recording the waste collection.");
                    statusSelect.value = item.status;
                    return;
                }

                try {
                    const response = await fetch(
                        `http://localhost:8080/api/requests/${item.request_id}/status`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                status: selectedStatus
                            })
                        }
                    );

                    const result = await response.text();

                    if (!response.ok) {
                        throw new Error(result);
                    }

                    alert("Request status updated successfully!");

                    await loadAdminData();
                    await loadDashboard();

                } catch (error) {
                    alert("Error updating status: " + error.message);
                }
            });

            // Staff dropdown
            const staffSelect = document.createElement("select");

            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Select Staff";

            staffSelect.appendChild(defaultOption);

            (window.allStaff || []).forEach(staff => {

                const option = document.createElement("option");

                option.value = staff.staff_id;
                option.textContent =
                    staff.staff_name + " (ID: " + staff.staff_id + ")";

                if (String(item.staff_id) === String(staff.staff_id)) {
                    option.selected = true;
                }

                staffSelect.appendChild(option);
            });

            // Assign staff button
            const assignButton = document.createElement("button");

            assignButton.type = "button";
            assignButton.textContent = "Assign Staff";

            assignButton.addEventListener("click", async function() {

                const selectedStaffId = staffSelect.value;

                if (!selectedStaffId) {
                    alert("Please select a staff member.");
                    return;
                }

                try {
                    const response = await fetch(
                        `http://localhost:8080/api/requests/${item.request_id}/assign-staff`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                staff_id: Number(selectedStaffId)
                            })
                        }
                    );

                    const result = await response.text();

                    if (!response.ok) {
                        throw new Error(result);
                    }

                    alert("Staff assigned successfully!");

                    await loadAdminData();

                } catch (error) {
                    alert("Error assigning staff: " + error.message);
                }
            });

            actionCell.appendChild(statusSelect);
            actionCell.appendChild(updateButton);
            actionCell.appendChild(document.createElement("br"));
            actionCell.appendChild(document.createElement("br"));
            actionCell.appendChild(staffSelect);
            actionCell.appendChild(assignButton);

            row.appendChild(actionCell);
        }

        // ======================================
        // STAFF AVAILABILITY MANAGEMENT
        // ======================================

        if (containerId === "adminStaff") {

            const actionCell = document.createElement("td");

            const availabilitySelect = document.createElement("select");

            ["Available", "Unavailable"].forEach(status => {

                const option = document.createElement("option");

                option.value = status;
                option.textContent = status;

                if (item.availability === status) {
                    option.selected = true;
                }

                availabilitySelect.appendChild(option);
            });

            const updateAvailabilityButton =
                document.createElement("button");

            updateAvailabilityButton.type = "button";
            updateAvailabilityButton.textContent = "Update Availability";

            updateAvailabilityButton.addEventListener("click", async function() {

                const selectedAvailability = availabilitySelect.value;

                try {

                    const response = await fetch(
                        `http://localhost:8080/api/staff/${item.staff_id}/availability`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                availability: selectedAvailability
                            })
                        }
                    );

                    const result = await response.text();

                    if (!response.ok) {
                        throw new Error(result);
                    }

                    alert("Staff availability updated successfully!");

                    await loadAdminData();
                    await loadStaff();

                } catch (error) {
                    alert("Error updating availability: " + error.message);
                }
            });

            actionCell.appendChild(availabilitySelect);
            actionCell.appendChild(document.createElement("br"));
            actionCell.appendChild(document.createElement("br"));
            actionCell.appendChild(updateAvailabilityButton);

            row.appendChild(actionCell);
        }

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
}

async function loadAdminData() {

    const message = document.getElementById("adminMessage");

    message.textContent = "Loading administrator data...";
    message.style.color = "black";

    try {

        const [
            usersResponse,
            reportsResponse,
            requestsResponse,
            staffResponse,
            recordsResponse
        ] = await Promise.all([

            fetch("http://localhost:8080/api/users"),
            fetch("http://localhost:8080/api/reports"),
            fetch("http://localhost:8080/api/requests"),
            fetch("http://localhost:8080/api/staff"),
            fetch("http://localhost:8080/api/records")

        ]);

        const responses = [
            usersResponse,
            reportsResponse,
            requestsResponse,
            staffResponse,
            recordsResponse
        ];

        if (responses.some(response => !response.ok)) {
            throw new Error("One or more admin APIs could not be loaded.");
        }

        const [
            users,
            reports,
            requests,
            staff,
            records
        ] = await Promise.all(
            responses.map(response => response.json())
        );


        // SAVE ALL DATA FIRST
        window.allCitizens = users;
        window.allReports = reports;
        window.allRequests = requests;
        window.allStaff = staff;
        window.allRecords = records;


        // CITIZENS
        displayAdminTable("adminUsers", [
            { key: "user_id", label: "User ID" },
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
            { key: "address", label: "Address" },
            { key: "role", label: "Role" }
        ], users);


        // WASTE REPORTS
        displayAdminTable("adminReports", [
            { key: "report_id", label: "Report ID" },
            { key: "user_id", label: "User ID" },
            { key: "category_id", label: "Category ID" },
            { key: "location", label: "Location" },
            { key: "description", label: "Description" },
            { key: "report_date", label: "Report Date" },
            { key: "status", label: "Status" }
        ], reports);


        // COLLECTION REQUESTS
        displayAdminTable("adminRequests", [
            { key: "request_id", label: "Request ID" },
            { key: "user_id", label: "User ID" },
            { key: "category_id", label: "Category ID" },
            { key: "staff_id", label: "Staff ID" },
            { key: "pickup_location", label: "Pickup Location" },
            { key: "scheduled_date", label: "Scheduled Date" },
            { key: "status", label: "Status" }
        ], requests);


        // STAFF MEMBERS
        displayAdminTable("adminStaff", [
            { key: "staff_id", label: "Staff ID" },
            { key: "staff_name", label: "Staff Name" },
            { key: "phone", label: "Phone" },
            { key: "assigned_area", label: "Assigned Area" },
            { key: "availability", label: "Availability" }
        ], staff);


        // COLLECTION RECORDS
        displayAdminTable("adminRecords", [
            { key: "record_id", label: "Record ID" },
            { key: "request_id", label: "Request ID" },
            { key: "staff_id", label: "Staff ID" },
            { key: "collected_quantity", label: "Quantity" },
            { key: "quantity_unit", label: "Unit" },
            { key: "collection_date", label: "Collection Date" },
            { key: "remarks", label: "Remarks" }
        ], records);


        // RESTORE SEARCH FILTERS
        document.getElementById("searchCitizen").dispatchEvent(
            new Event("input")
        );

        document.getElementById("searchReport").dispatchEvent(
            new Event("input")
        );

        document.getElementById("searchRequest").dispatchEvent(
            new Event("input")
        );

        document.getElementById("searchStaff").dispatchEvent(
            new Event("input")
        );

        document.getElementById("searchRecord").dispatchEvent(
            new Event("input")
        );

        message.textContent = "All administrator data loaded successfully!";
        message.style.color = "green";

    } catch (error) {

        console.error("Admin dashboard error:", error);

        message.textContent = "Unable to load admin data: " + error.message;
        message.style.color = "red";
    }
}


// ==========================================
// 13. REFRESH ADMIN DATA BUTTON
// ==========================================

document.getElementById("loadAdminData").addEventListener("click", async function() {

    await loadAdminData();
    await loadDashboard();

});


// ==========================================
// 14. SEARCH REGISTERED CITIZENS
// ==========================================

document.getElementById("searchCitizen").addEventListener("input", function() {

    const searchText = this.value.toLowerCase().trim();

    const filteredCitizens = (window.allCitizens || []).filter(citizen =>

        (citizen.name || "").toLowerCase().includes(searchText) ||

        (citizen.email || "").toLowerCase().includes(searchText)

    );

    displayAdminTable("adminUsers", [
        { key: "user_id", label: "User ID" },
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "address", label: "Address" },
        { key: "role", label: "Role" }
    ], filteredCitizens);

});


// ==========================================
// 15. SEARCH WASTE REPORTS
// ==========================================

document.getElementById("searchReport").addEventListener("input", function() {

    const searchText = this.value.toLowerCase().trim();

    const filteredReports = (window.allReports || []).filter(report =>

        String(report.report_id).includes(searchText) ||

        (report.location || "").toLowerCase().includes(searchText)

    );

    displayAdminTable("adminReports", [
        { key: "report_id", label: "Report ID" },
        { key: "user_id", label: "User ID" },
        { key: "category_id", label: "Category ID" },
        { key: "location", label: "Location" },
        { key: "description", label: "Description" },
        { key: "report_date", label: "Report Date" },
        { key: "status", label: "Status" }
    ], filteredReports);

});


// ==========================================
// 16. SEARCH COLLECTION REQUESTS
// ==========================================

document.getElementById("searchRequest").addEventListener("input", function() {

    const searchText = this.value.toLowerCase().trim();

    const filteredRequests = (window.allRequests || []).filter(request =>

        String(request.request_id).includes(searchText) ||

        (request.pickup_location || "").toLowerCase().includes(searchText) ||

        (request.status || "").toLowerCase().includes(searchText)

    );

    displayAdminTable("adminRequests", [
        { key: "request_id", label: "Request ID" },
        { key: "user_id", label: "User ID" },
        { key: "category_id", label: "Category ID" },
        { key: "staff_id", label: "Staff ID" },
        { key: "pickup_location", label: "Pickup Location" },
        { key: "scheduled_date", label: "Scheduled Date" },
        { key: "status", label: "Status" }
    ], filteredRequests);

});


// ==========================================
// 17. SEARCH COLLECTION STAFF
// ==========================================

document.getElementById("searchStaff").addEventListener("input", function() {

    const searchText = this.value.toLowerCase().trim();

    const filteredStaff = (window.allStaff || []).filter(staff =>

        (staff.staff_name || "").toLowerCase().includes(searchText) ||

        (staff.phone || "").toLowerCase().includes(searchText) ||

        (staff.assigned_area || "").toLowerCase().includes(searchText)

    );

    displayAdminTable("adminStaff", [
        { key: "staff_id", label: "Staff ID" },
        { key: "staff_name", label: "Staff Name" },
        { key: "phone", label: "Phone" },
        { key: "assigned_area", label: "Assigned Area" },
        { key: "availability", label: "Availability" }
    ], filteredStaff);

});


// ==========================================
// 18. SEARCH COLLECTION RECORDS
// ==========================================

document.getElementById("searchRecord").addEventListener("input", function() {

    const searchValue = this.value.toLowerCase().trim();

    const filteredRecords = (window.allRecords || []).filter(record =>

        String(record.record_id).includes(searchValue) ||

        String(record.request_id).includes(searchValue) ||

        String(record.staff_id).includes(searchValue) ||

        String(record.remarks || "").toLowerCase().includes(searchValue)

    );

    displayAdminTable("adminRecords", [
        { key: "record_id", label: "Record ID" },
        { key: "request_id", label: "Request ID" },
        { key: "staff_id", label: "Staff ID" },
        { key: "collected_quantity", label: "Quantity" },
        { key: "quantity_unit", label: "Unit" },
        { key: "collection_date", label: "Collection Date" },
        { key: "remarks", label: "Remarks" }
    ], filteredRecords);

});


// ==========================================
// 19. LOAD DATA WHEN PAGE OPENS
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    loadDashboard();
    loadStaff();
    loadAdminData();

});
