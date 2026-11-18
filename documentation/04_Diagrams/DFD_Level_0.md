
flowchart LR
    Citizen["Citizen"]
    Admin["Administrator"]
    Staff["Collection Staff"]

    System(("Waste Collection Management System"))

    Citizen -->|"Registration, waste reports, collection requests"| System
    System -->|"Registration result, request tracking"| Citizen

    Admin -->|"Staff management, assignments, status updates"| System
    System -->|"Dashboard statistics, reports, records"| Admin

    Staff -->|"Collection activity information"| System
    System -->|"Assigned collection information"| Staff
