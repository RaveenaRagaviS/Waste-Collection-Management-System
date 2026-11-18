
# DATA FLOW DIAGRAM – LEVEL 1

## Waste Collection Management System

The Level 1 DFD explains the internal processes of the Waste Collection Management System and the flow of information between users, application processes, and database storage.

```mermaid
flowchart TD

    C["Citizen"]
    A["Administrator"]
    S["Collection Staff"]

    P1["1.0 Citizen Registration"]
    P2["2.0 Waste Reporting"]
    P3["3.0 Collection Request Management"]
    P4["4.0 Staff Management"]
    P5["5.0 Collection Record Management"]
    P6["6.0 Dashboard Management"]
    P7["7.0 Python Data Analysis"]

    D1[("Users")]
    D2[("Waste Categories")]
    D3[("Waste Reports")]
    D4[("Collection Staff")]
    D5[("Collection Requests")]
    D6[("Collection Records")]

    C -->|"Registration details"| P1
    P1 -->|"Save user information"| D1
    D1 -->|"User information"| P1
    P1 -->|"Registration result"| C

    C -->|"Waste report details"| P2
    D1 -->|"User information"| P2
    D2 -->|"Category information"| P2
    P2 -->|"Save waste report"| D3
    P2 -->|"Report confirmation"| C

    C -->|"Collection request details"| P3
    D1 -->|"User information"| P3
    D2 -->|"Category information"| P3
    P3 -->|"Save request"| D5
    D5 -->|"Request details"| P3
    P3 -->|"Request status"| C

    A -->|"Staff details and availability updates"| P4
    P4 -->|"Save or update staff"| D4
    D4 -->|"Staff information"| P4
    P4 -->|"Staff information"| A

    A -->|"Staff assignment and status updates"| P3
    D4 -->|"Available staff information"| P3
    P3 -->|"Updated request assignment and status"| D5

    A -->|"Collection record details"| P5
    S -->|"Collection details"| P5
    D5 -->|"Request information"| P5
    D4 -->|"Staff information"| P5
    P5 -->|"Save completed collection"| D6
    P5 -->|"Update request status"| D5

    A -->|"Dashboard request"| P6
    D1 --> P6
    D3 --> P6
    D4 --> P6
    D5 --> P6
    D6 --> P6
    P6 -->|"Dashboard information"| A

    D1 -->|"Database information"| P7
    D2 -->|"Database information"| P7
    D3 -->|"Database information"| P7
    D4 -->|"Database information"| P7
    D5 -->|"Database information"| P7
    D6 -->|"Database information"| P7

    P7 -->|"Analysis tables and charts"| A
```

## Description

1. Citizen Registration stores citizen details.
2. Waste Reporting stores information about waste disposal problems.
3. Collection Request Management handles collection requests, assignments, and statuses.
4. Staff Management maintains staff details and availability.
5. Collection Record Management stores completed collection details.
6. Dashboard Management retrieves information for the administrator.
7. Python Data Analysis reads database information and generates analytical charts.

The Python analysis process reads the database for analysis; it does not update the database.
