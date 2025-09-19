export const mockUsers = [
  {
    id: 1,
    name: "Admin Principal",
    email: "admin@cashflow.com",
    role: "admin",
    branchId: null
  },
  {
    id: 2,
    name: "Gerente Sucursal Norte",
    email: "norte@cashflow.com",
    role: "branch_admin",
    branchId: 1
  }
];

export const mockBranches = [
  { id: 1, name: "Sucursal Norte", address: "Av. Principal 123", cashBalance: 50000 },
  { id: 2, name: "Sucursal Sur", address: "Calle Secundaria 456", cashBalance: 75000 }
];

export const mockClients = [
  { id: 1, name: "Cliente Corporativo A", contact: "Juan Pérez", phone: "555-0123", deliveryAddress: "Av. Reforma 100", defaultSalePercentage: 1.0 },
  { id: 2, name: "Empresa XYZ", contact: "María García", phone: "555-0456", deliveryAddress: "Calle Falsa 200", defaultSalePercentage: 1.5 },
  { id: 3, name: "Cliente CDMX", contact: "Carlos Ruiz", phone: "555-9999", deliveryAddress: "Av. Reforma 100, CDMX", defaultSalePercentage: 1.0 }
];

export const mockSuppliers = [
  { id: 1, name: "Proveedor Confiable S.A.", contact: "Roberto Sánchez", phone: "555-0789", accountName: "Firsbel" },
  { id: 2, name: "Suministros Rápidos", contact: "Laura Martínez", phone: "555-0901", accountName: "Cuenta SR" },
  { id: 3, name: "Cliente CDMX", contact: "Carlos Ruiz", phone: "555-9999", accountName: "Firsbel" }
];

export const mockBrokers = [
  { id: 1, name: "Intermediario López", commissionRate: 0.03, phone: "555-1122" },
  { id: 2, name: "Gestor de Negocios", commissionRate: 0.025, phone: "555-3344" }
];

export const mockTransactions = [
  {
    id: 1,
    date: "2025-01-15",
    type: "sale",
    clientId: 1,
    supplierId: null,
    brokerId: 1,
    branchId: 1,
    amount: 10000000,
    depositAmount: 10100000,
    depositAccount: "Firsbel",
    purchasePrice: 0.95,
    salePrice: 1.01,
    salePercentage: 5,
    brokerPercentage: 3,
    profit: 500000,
    fundSource: 'own'
  },
  {
    id: 2,
    date: "2025-01-14",
    type: "order",
    clientId: null,
    supplierId: 1,
    brokerId: null,
    branchId: 1,
    amount: 15000000,
    purchasePrice: 0.93,
    salePrice: null,
    salePercentage: null,
    brokerPercentage: null,
    profit: null,
    fundSource: 'own',
    status: 'pending',
    deposits: [],
    usedFromAccount: "Firsbel", // Cuenta de la que se usó saldo
    usedAmount: 15000000
  },
  {
    id: 3,
    date: "2025-01-13",
    type: "sale",
    clientId: 2,
    supplierId: null,
    brokerId: 2,
    branchId: 2,
    amount: 5000000,
    depositAmount: 5050000,
    depositAccount: "Firsbel",
    purchasePrice: 0.96,
    salePrice: 1.01,
    salePercentage: 6,
    brokerPercentage: 2.5,
    profit: 300000,
    fundSource: 'client'
  },
  {
    id: 4,
    date: "2025-01-12",
    type: "sale",
    clientId: 3,
    supplierId: null,
    brokerId: null,
    branchId: 1,
    amount: 8000000,
    depositAmount: 8080000,
    depositAccount: "Firsbel",
    purchasePrice: 0.94,
    salePrice: 1.01,
    salePercentage: 1,
    brokerPercentage: 0,
    profit: 80000,
    fundSource: 'client'
  }
];

export const OWN_FUNDS_LIMIT = 10000000;
export const MIN_ORDER_AMOUNT = 8000000;
export const FIRSBEL_ACCOUNT = "Firsbel";