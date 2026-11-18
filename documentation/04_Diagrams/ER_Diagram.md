
erDiagram
    USERS {
        INTEGER user_id PK
        TEXT name
        TEXT email
        TEXT phone
        TEXT address
        TEXT role
    }

    WASTE_CATEGORIES {
        INTEGER category_id PK
        TEXT category_name
        TEXT description
    }

    WASTE_REPORTS {
        INTEGER report_id PK
        INTEGER user_id FK
        INTEGER category_id FK
        TEXT location
        TEXT description
        TEXT image_path
        TEXT report_date
        TEXT status
    }

    COLLECTION_STAFF {
        INTEGER staff_id PK
        TEXT staff_name
        TEXT phone
        TEXT assigned_area
        TEXT availability
    }

    COLLECTION_REQUESTS {
        INTEGER request_id PK
        INTEGER user_id FK
        INTEGER category_id FK
        INTEGER staff_id FK
        TEXT pickup_location
        TEXT request_date
        TEXT scheduled_date
        TEXT status
    }

    COLLECTION_RECORDS {
        INTEGER record_id PK
        INTEGER request_id FK
        INTEGER staff_id FK
        REAL collected_quantity
        TEXT quantity_unit
        TEXT collection_date
        TEXT remarks
    }

    USERS ||--o{ WASTE_REPORTS : submits
    WASTE_CATEGORIES ||--o{ WASTE_REPORTS : categorizes
    USERS ||--o{ COLLECTION_REQUESTS : creates
    WASTE_CATEGORIES ||--o{ COLLECTION_REQUESTS : categorizes
    COLLECTION_STAFF o|--o{ COLLECTION_REQUESTS : assigned_to
    COLLECTION_REQUESTS ||--o| COLLECTION_RECORDS : produces
    COLLECTION_STAFF ||--o{ COLLECTION_RECORDS : records
