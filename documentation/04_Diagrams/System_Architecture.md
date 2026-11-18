
# SYSTEM ARCHITECTURE DIAGRAM

## Waste Collection Management System

The system follows a three-tier architecture consisting of the Presentation Layer, Application Layer, and Data Layer. A separate Python Data Analysis Module reads information from the SQLite database and generates analytical charts.

```mermaid
flowchart TD

    A["CITIZEN"]
    B["ADMINISTRATOR"]

    subgraph P["PRESENTATION LAYER"]
        C["HTML"]
        D["CSS"]
        E["JavaScript"]
        F["Web User Interface"]
        C --> F
        D --> F
        E --> F
    end

    subgraph APP["APPLICATION LAYER"]
        G["Spring Boot Backend"]
        H["REST APIs"]
        I["Business Logic"]
        J["JDBC Database Connectivity"]
        G --> H
        H --> I
        I --> J
    end

    subgraph DB["DATA LAYER"]
        K[("SQLite Database")]
        L["Users"]
        M["Waste Categories"]
        N["Waste Reports"]
        O["Collection Staff"]
        Q["Collection Requests"]
        R["Collection Records"]
        K --- L
        K --- M
        K --- N
        K --- O
        K --- Q
        K --- R
    end

    subgraph ANALYSIS["PYTHON DATA ANALYSIS MODULE"]
        S["Python"]
        T["Pandas"]
        U["Matplotlib"]
        V["Analytical Charts"]
        S --> T
        T --> U
        U --> V
    end

    A --> F
    B --> F
    F --> G
    J --> K
    K --> S
```

## Architecture Description

1. Citizens and administrators interact with the web interface.
2. The presentation layer is developed using HTML, CSS, and JavaScript.
3. The Spring Boot backend processes application requests.
4. REST APIs handle communication between the frontend and backend.
5. JDBC connects the backend to the SQLite database.
6. SQLite stores user, waste, staff, request, and collection information.
7. The Python analysis module reads data from SQLite.
8. Pandas processes the data and Matplotlib generates analytical charts.
```

Save using `Ctrl + S`.

Tell me `done` when saved. We'll continue with the remaining project documentation updates.