
const API = "";


// ==========================================
// 1. WELCOME BUTTON
// ==========================================

function showMessage() {
    alert("Welcome to the Waste Collection Management System! Let's make our environment cleaner.");
}


// ==========================================
// 2. COMMON API FUNCTIONS
// ==========================================

async function getData(path) {
    const response = await fetch(`${API}${path}`, {
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error(await response.text() || "Unable to fetch data");
    }

    return response.json();
}

async function sendData(path, method, data) {
    const response = await fetch(`${API}${path}`, {
        method,
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await response.text();

    if (!response.ok || /not found|invalid|error|failed/i.test(result)) {
        throw new Error(result || "Request failed");
    }

    return result;
}

function showText(id, value, color = "black") {
    const element = document.getElementById(id);
    if (!element) return;

    element.textContent = value;
    element.style.color = color;
}


// ==========================================
// 3. LOAD DASHBOARD
// ==========================================

async function loadDashboard() {
    try {
        const data = await getData("/api/dashboard");

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
// 4. CITIZEN REGISTRATION
// ==========================================

document.getElementById("registrationForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const userData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
        role: "citizen"
    };

    try {
        showText("registrationMessage", "Registering...");

        await sendData("/api/users", "POST", userData);

        showText("registrationMessage", "Registration successful!", "green");
        this.reset();

        await loadDashboard();
        await loadAdminData();

    } catch (error) {
        showText("registrationMessage", "Registration failed: " + error.message, "red");
    }
});


// ==========================================
// 5. WASTE REPORT SUBMISSION
// ==========================================

document.getElementById("reportForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const reportData = {
        user_id: Number(document.getElementById("reportUserId").value),
        category_id: Number(document.getElementById("wasteCategory").value),
        location: document.getElementById("wasteLocation").value.trim(),
        description: document.getElementById("wasteDescription").value.trim()
    };

    try {
        showText("reportMessage", "Submitting report...");

        await sendData("/api/reports", "POST", reportData);

        showText("reportMessage", "Waste report submitted successfully!", "green");
        this.reset();

        await loadDashboard();
        await loadAdminData();

    } catch (error) {
        showText("reportMessage", "Report failed: " + error.message, "red");
    }
});


// ==========================================
// 6. WASTE COLLECTION REQUEST
// ==========================================

document.getElementById("requestForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const requestData = {
        user_id: Number(document.getElementById("requestUserId").value),
        category_id: Number(document.getElementById("requestCategory").value),
        staff_id: Number(document.getElementById("requestStaffId").value),
        pickup_location: document.getElementById("pickupLocation").value.trim(),
        scheduled_date: document.getElementById("scheduledDate").value
    };

    try {
        showText("requestMessage", "Submitting collection request...");

        await sendData("/api/requests", "POST", requestData);

        showText("requestMessage", "Collection request submitted successfully!", "green");
        this.reset();

        await loadDashboard();
        await loadAdminData();

    } catch (error) {
        showText("requestMessage", "Request failed: " + error.message, "red");
    }
});


// ==========================================
// 7. TRACK COLLECTION REQUESTS
// ==========================================

document.getElementById("trackingForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const userId = Number(document.getElementById("trackingUserId").value);
    const results = document.getElementById("trackingResults");

    results.textContent = "Loading your collection requests...";

    try {
        const requests = await getData("/api/requests");

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

            [
                `Request ID: ${request.request_id}`,
                `Category ID: ${request.category_id}`,
                `Pickup Location: ${request.pickup_location}`,
                `Scheduled Date: ${request.scheduled_date || "Not scheduled"}`,
                `Status: ${request.status}`
            ].forEach(detail => {
                const paragraph = document.createElement("p");
                paragraph.textContent = detail;

                if (detail.startsWith("Status:")) {
                    paragraph.style.fontWeight = "bold";
                    paragraph.style.color =
                        request.status === "Completed" ? "green" : "orange";
                }

                card.appendChild(paragraph);
            });

            results.appendChild(card);
        });

    } catch (error) {
        results.textContent = "Unable to load requests: " + error.message;
    }
});


// ==========================================
// 8. RECORD WASTE COLLECTION
// ==========================================

document.getElementById("recordForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const recordData = {
        request_id: Number(document.getElementById("recordRequestId").value),
        staff_id: Number(document.getElementById("recordStaffId").value),
        collected_quantity: Number(document.getElementById("collectedQuantity").value),
        quantity_unit: "kg",
        remarks: document.getElementById("recordRemarks").value.trim()
    };

    try {
        showText("recordMessage", "Saving collection record...");

        await sendData("/api/records", "POST", recordData);

        showText(
            "recordMessage",
            "Collection record saved! Request status updated to Completed.",
            "green"
        );

        this.reset();

        await loadDashboard();
        await loadAdminData();

        const trackingForm = document.getElementById("trackingForm");

        if (trackingForm && document.getElementById("trackingUserId").value) {
            trackingForm.requestSubmit();
        }

    } catch (error) {
        showText("recordMessage", "Collection record failed: " + error.message, "red");
    }
});


// ==========================================
// 9. STAFF REGISTRATION
// ==========================================

document.getElementById("staffForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const staffData = {
        staff_name: document.getElementById("staffName").value.trim(),
        phone: document.getElementById("staffPhone").value.trim(),
        assigned_area: document.getElementById("assignedArea").value.trim(),
        availability: document.getElementById("staffAvailability").value
    };

    try {
        showText("staffMessage", "Registering staff...");

        await sendData("/api/staff", "POST", staffData);

        showText("staffMessage", "Staff registered successfully!", "green");
        this.reset();

        await loadStaff();
        await loadDashboard();
        await loadAdminData();

    } catch (error) {
        showText("staffMessage", "Staff registration failed: " + error.message, "red");
    }
});


// ==========================================
// 10. DISPLAY ALL STAFF MEMBERS
// ==========================================

async function loadStaff() {
    const staffList = document.getElementById("staffList");

    if (!staffList) return;

    staffList.textContent = "Loading staff details...";

    try {
        const staffMembers = await getData("/api/staff");

        window.allStaff = staffMembers;

        staffList.replaceChildren();

        if (staffMembers.length === 0) {
            staffList.textContent = "No staff members registered yet.";
            return;
        }

        staffMembers.forEach(staff => {
            const card = document.createElement("div");
            card.className = "service-card";

            [
                "Staff ID: " + staff.staff_id,
                "Name: " + staff.staff_name,
                "Phone: " + staff.phone,
                "Assigned Area: " + staff.assigned_area,
                "Availability: " + staff.availability
            ].forEach(detail => {
                const paragraph = document.createElement("p");
                paragraph.textContent = detail;

                if (detail.startsWith("Availability:")) {
                    paragraph.style.fontWeight = "bold";
                    paragraph.style.color =
                        staff.availability === "Available" ? "green" : "red";
                }

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
// 11. VIEW STAFF BUTTON
// ==========================================

document.getElementById("loadStaffButton").addEventListener("click", loadStaff);


// ==========================================
// 12. ADMIN TABLE DISPLAY
// ==========================================

function displayAdminTable(containerId, columns, data) {
    const container = document.getElementById(containerId);

    if (!container) return;

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

    if (containerId === "adminRequests" || containerId === "adminStaff") {
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

            if (containerId === "adminStaff" && column.key === "availability") {
                td.style.fontWeight = "bold";
                td.style.color = value === "Available" ? "green" : "red";
            }

            row.appendChild(td);
        });


        // COLLECTION REQUEST ACTIONS

        if (containerId === "adminRequests") {
            const actionCell = document.createElement("td");

            const statusSelect = document.createElement("select");

            ["Pending", "Approved", "Completed"].forEach(status => {
                const option = document.createElement("option");
                option.value = status;
                option.textContent = status;
                option.selected = item.status === status;
                statusSelect.appendChild(option);
            });

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
                    await sendData(
                        `/api/requests/${item.request_id}/status`,
                        "PUT",
                        { status: selectedStatus }
                    );

                    alert("Request status updated successfully!");

                    await loadAdminData();
                    await loadDashboard();

                } catch (error) {
                    alert("Error updating status: " + error.message);
                }
            });

            const staffSelect = document.createElement("select");

            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Select Staff";
            staffSelect.appendChild(defaultOption);

            (window.allStaff || []).forEach(staff => {
                const option = document.createElement("option");
                option.value = staff.staff_id;
                option.textContent =
                    `${staff.staff_name} (ID: ${staff.staff_id})`;

                option.selected =
                    String(item.staff_id) === String(staff.staff_id);

                staffSelect.appendChild(option);
            });

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
                    await sendData(
                        `/api/requests/${item.request_id}/assign-staff`,
                        "PUT",
                        { staff_id: Number(selectedStaffId) }
                    );

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


        // STAFF AVAILABILITY MANAGEMENT

        if (containerId === "adminStaff") {
            const actionCell = document.createElement("td");

            const availabilitySelect = document.createElement("select");

            ["Available", "Unavailable"].forEach(status => {
                const option = document.createElement("option");
                option.value = status;
                option.textContent = status;
                option.selected = item.availability === status;
                availabilitySelect.appendChild(option);
            });

            const updateButton = document.createElement("button");
            updateButton.type = "button";
            updateButton.textContent = "Update Availability";

            updateButton.addEventListener("click", async function() {
                const selectedAvailability = availabilitySelect.value;

                updateButton.disabled = true;
                updateButton.textContent = "Updating...";

                try {
                    // UPDATE AVAILABILITY
                    await sendData(
                        `/api/staff/${item.staff_id}/availability`,
                        "PUT",
                        { availability: selectedAvailability }
                    );

                    // VERIFY THE UPDATED STAFF FROM BACKEND
                    const verifiedData = await getData(`/api/staff/${item.staff_id}`);

                    const verifiedStaff = Array.isArray(verifiedData)
                        ? verifiedData[0]
                        : verifiedData;

                    if (!verifiedStaff ||
                        verifiedStaff.availability !== selectedAvailability) {
                        throw new Error("Availability update could not be verified.");
                    }

                    alert(
                        `Staff ID ${item.staff_id} availability is now ${verifiedStaff.availability}.`
                    );

                    // RELOAD BOTH STAFF DISPLAYS
                    await loadStaff();
                    await loadAdminData();
                    await loadDashboard();

                } catch (error) {
                    alert("Error updating availability: " + error.message);
                    await loadStaff();
                    await loadAdminData();

                } finally {
                    updateButton.disabled = false;
                    updateButton.textContent = "Update Availability";
                }
            });

            actionCell.appendChild(availabilitySelect);
            actionCell.appendChild(document.createElement("br"));
            actionCell.appendChild(document.createElement("br"));
            actionCell.appendChild(updateButton);

            row.appendChild(actionCell);
        }

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
}


// ==========================================
// 13. LOAD ADMIN DATA
// ==========================================

async function loadAdminData() {
    const message = document.getElementById("adminMessage");

    if (message) {
        message.textContent = "Loading administrator data...";
        message.style.color = "black";
    }

    try {
        const [
            users,
            reports,
            requests,
            staff,
            records
        ] = await Promise.all([
            getData("/api/users"),
            getData("/api/reports"),
            getData("/api/requests"),
            getData("/api/staff"),
            getData("/api/records")
        ]);

        window.allCitizens = users;
        window.allReports = reports;
        window.allRequests = requests;
        window.allStaff = staff;
        window.allRecords = records;

        displayAdminTable("adminUsers", [
            { key: "user_id", label: "User ID" },
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
            { key: "address", label: "Address" },
            { key: "role", label: "Role" }
        ], users);

        displayAdminTable("adminReports", [
            { key: "report_id", label: "Report ID" },
            { key: "user_id", label: "User ID" },
            { key: "category_id", label: "Category ID" },
            { key: "location", label: "Location" },
            { key: "description", label: "Description" },
            { key: "report_date", label: "Report Date" },
            { key: "status", label: "Status" }
        ], reports);

        displayAdminTable("adminRequests", [
            { key: "request_id", label: "Request ID" },
            { key: "user_id", label: "User ID" },
            { key: "category_id", label: "Category ID" },
            { key: "staff_id", label: "Staff ID" },
            { key: "pickup_location", label: "Pickup Location" },
            { key: "scheduled_date", label: "Scheduled Date" },
            { key: "status", label: "Status" }
        ], requests);

        displayAdminTable("adminStaff", [
            { key: "staff_id", label: "Staff ID" },
            { key: "staff_name", label: "Staff Name" },
            { key: "phone", label: "Phone" },
            { key: "assigned_area", label: "Assigned Area" },
            { key: "availability", label: "Availability" }
        ], staff);

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
        [
            "searchCitizen",
            "searchReport",
            "searchRequest",
            "searchStaff",
            "searchRecord"
        ].forEach(id => {
            const input = document.getElementById(id);
            if (input) input.dispatchEvent(new Event("input"));
        });

        if (message) {
            message.textContent = "All administrator data loaded successfully!";
            message.style.color = "green";
        }

    } catch (error) {
        console.error("Admin dashboard error:", error);

        if (message) {
            message.textContent = "Unable to load admin data: " + error.message;
            message.style.color = "red";
        }
    }
}


// ==========================================
// 14. REFRESH ADMIN DATA BUTTON
// ==========================================

document.getElementById("loadAdminData").addEventListener("click", async function() {
    await loadAdminData();
    await loadStaff();
    await loadDashboard();
});


// ==========================================
// 15. SEARCH REGISTERED CITIZENS
// ==========================================

document.getElementById("searchCitizen").addEventListener("input", function() {
    const searchText = this.value.toLowerCase().trim();

    const filtered = (window.allCitizens || []).filter(citizen =>
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
    ], filtered);
});


// ==========================================
// 16. SEARCH WASTE REPORTS
// ==========================================

document.getElementById("searchReport").addEventListener("input", function() {
    const searchText = this.value.toLowerCase().trim();

    const filtered = (window.allReports || []).filter(report =>
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
    ], filtered);
});


// ==========================================
// 17. SEARCH COLLECTION REQUESTS
// ==========================================

document.getElementById("searchRequest").addEventListener("input", function() {
    const searchText = this.value.toLowerCase().trim();

    const filtered = (window.allRequests || []).filter(request =>
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
    ], filtered);
});


// ==========================================
// 18. SEARCH COLLECTION STAFF
// ==========================================

document.getElementById("searchStaff").addEventListener("input", function() {
    const searchText = this.value.toLowerCase().trim();

    const filtered = (window.allStaff || []).filter(staff =>
        String(staff.staff_id).includes(searchText) ||
        (staff.staff_name || "").toLowerCase().includes(searchText) ||
        (staff.phone || "").toLowerCase().includes(searchText) ||
        (staff.assigned_area || "").toLowerCase().includes(searchText) ||
        (staff.availability || "").toLowerCase().includes(searchText)
    );

    displayAdminTable("adminStaff", [
        { key: "staff_id", label: "Staff ID" },
        { key: "staff_name", label: "Staff Name" },
        { key: "phone", label: "Phone" },
        { key: "assigned_area", label: "Assigned Area" },
        { key: "availability", label: "Availability" }
    ], filtered);
});


// ==========================================
// 19. SEARCH COLLECTION RECORDS
// ==========================================

document.getElementById("searchRecord").addEventListener("input", function() {
    const searchValue = this.value.toLowerCase().trim();

    const filtered = (window.allRecords || []).filter(record =>
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
    ], filtered);
});


// ==========================================
// 20. LOAD DATA WHEN PAGE OPENS
// ==========================================

document.addEventListener("DOMContentLoaded", async function() {
    await loadDashboard();
    await loadStaff();
    await loadAdminData();
});
