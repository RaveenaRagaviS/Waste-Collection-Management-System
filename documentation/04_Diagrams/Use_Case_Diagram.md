
flowchart LR
    Citizen["Citizen"]
    Admin["Administrator"]
    Staff["Collection Staff"]

    subgraph System["Waste Collection Management System"]
        UC1(["Register"])
        UC2(["Report Waste"])
        UC3(["Request Waste Collection"])
        UC4(["Track Collection Request"])
        UC5(["View Dashboard"])
        UC6(["Manage Users"])
        UC7(["Manage Waste Reports"])
        UC8(["Manage Staff"])
        UC9(["Assign Collection Staff"])
        UC10(["Update Request Status"])
        UC11(["Maintain Collection Records"])
        UC12(["View Assigned Work"])
    end

    Citizen --- UC1
    Citizen --- UC2
    Citizen --- UC3
    Citizen --- UC4

    Admin --- UC5
    Admin --- UC6
    Admin --- UC7
    Admin --- UC8
    Admin --- UC9
    Admin --- UC10
    Admin --- UC11

    Staff --- UC12
