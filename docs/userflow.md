sequenceDiagram
participant C as Customer
participant A as Admin
participant D as Driver
participant S as System/Database

    Note over C: 1. Ordering Phase
    C->>S: Places Order (Cash on Delivery)
    S-->>A: ALERT: New Order Received
    S-->>C: Status: "Pending Approval"

    Note over A: 2. Dispatch Phase
    A->>S: Reviews Order & Assigns Driver(D)
    S-->>D: PUSH NOTIF: "New Job Assigned"
    S-->>C: Status: "Finding Driver..."

    Note over D: 3. Handshake Phase
    D->>S: Opens App & Clicks "ACCEPT"
    S-->>C: PUSH NOTIF: "Driver Accepted! Order Started."
    S-->>A: Update Dashboard: "Driver Accepted"

    Note over D: 4. Fulfillment Phase
    D->>C: Drives to Customer (Navigation)
    D->>C: Collects Cash Payment
    D->>S: Marks "DELIVERED"
    S-->>A: Update Dashboard: "Completed/Paid"
    S-->>C: Status: "Delivered"
