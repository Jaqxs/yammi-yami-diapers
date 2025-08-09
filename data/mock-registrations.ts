export interface Registration {
  id: string
  name: string
  email: string
  phone: string
  region: string
  status: "pending" | "approved" | "rejected"
  registrationDate: string
  paymentReference: string
}

export const mockRegistrations: Registration[] = [
  {
    id: "reg-001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "0712345678",
    region: "Dar es Salaam",
    status: "approved",
    registrationDate: "2023-04-15T10:30:00Z",
    paymentReference: "MPESA123456",
  },
  {
    id: "reg-002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "0723456789",
    region: "Arusha",
    status: "pending",
    registrationDate: "2023-04-18T14:45:00Z",
    paymentReference: "MPESA234567",
  },
  {
    id: "reg-003",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    phone: "0734567890",
    region: "Mwanza",
    status: "rejected",
    registrationDate: "2023-04-10T09:15:00Z",
    paymentReference: "MPESA345678",
  },
  {
    id: "reg-004",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "0745678901",
    region: "Dodoma",
    status: "approved",
    registrationDate: "2023-04-05T11:20:00Z",
    paymentReference: "MPESA456789",
  },
  {
    id: "reg-005",
    name: "David Brown",
    email: "david.brown@example.com",
    phone: "0756789012",
    region: "Tanga",
    status: "pending",
    registrationDate: "2023-04-20T16:10:00Z",
    paymentReference: "MPESA567890",
  },
]
