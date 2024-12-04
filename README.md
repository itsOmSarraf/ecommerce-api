# E-commerce API Project

This project implements a RESTful API for a small e-commerce platform using TypeScript, Express, PostgreSQL, and Prisma ORM. The implementation focuses on clean architecture, proper error handling, and database optimization.

## 🛠 Technology Stack

- **Runtime**: Bun
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Other Tools**: Docker (for PostgreSQL)

## 📋 Features

### User Management
- Create new users
- Update user information
- Get user details

### Product Management
- Create new products
- Update product information
- Get product details
- Get total stock quantity across all products

### Order Management
- Create new orders with automatic stock updates
- Update order details
- Get order information
- View orders from last 7 days
- Get all orders for a specific user
- Get all users who bought a specific product

## 🏗 Project Structure

```
src/
  ├── controllers/
  │   ├── userController.ts
  │   ├── productController.ts
  │   └── orderController.ts
  ├── routes/
  │   ├── userRoutes.ts
  │   ├── productRoutes.ts
  │   └── orderRoutes.ts
  └── index.ts
prisma/
  └── schema.prisma
```

## 🚀 Getting Started

### Prerequisites
- Bun installed
- Docker installed (for PostgreSQL)
- PostgreSQL running on Docker

### Setup Instructions

1. Clone the repository:
```bash
git clone [repository-url]
cd ecommerce-api
```

2. Install dependencies:
```bash
bun install
```

3. Start PostgreSQL using Docker:
```bash
docker-compose up -d
```

4. Set up the database:
```bash
bunx prisma generate
bunx prisma migrate dev
```

5. Start the server:
```bash
bun dev
```

## 📝 API Documentation

### User Endpoints

```bash
# Create User
POST /api/users
{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890"
}

# Get User
GET /api/users/:id

# Update User
PUT /api/users/:id
{
    "name": "John Updated"
}
```

### Product Endpoints

```bash
# Create Product
POST /api/products
{
    "name": "iPhone 15",
    "category": "Electronics",
    "price": 999.99,
    "stock": 50
}

# Get Product
GET /api/products/:id

# Update Product
PUT /api/products/:id
{
    "price": 899.99
}

# Get Total Stock
GET /api/products/stock/total
```

### Order Endpoints

```bash
# Create Order
POST /api/orders
{
    "userId": "user_id",
    "productId": "product_id",
    "quantity": 2
}

# Get Order
GET /api/orders/:id

# Update Order
PUT /api/orders/:id
{
    "quantity": 3
}

# Get Recent Orders (Last 7 Days)
GET /api/orders/recent/last7days

# Get User's Orders
GET /api/orders/user/:userId

# Get Product Buyers
GET /api/orders/product/:productId/buyers
```

## 💡 Technical Highlights

1. **Transaction Management**: Implemented database transactions for order operations to ensure data consistency when updating product stock.

2. **Stock Management**: Two approaches for handling stock updates:
   - Transaction-based approach for guaranteed consistency
   - Optimistic locking approach for high-concurrency situations

3. **Database Optimization**:
   - Proper indexing on foreign keys
   - Efficient queries using Prisma's features
   - Relationship management between entities

4. **Error Handling**:
   - Comprehensive error handling for all endpoints
   - Proper HTTP status codes
   - Informative error messages

## 🔍 Assignment Requirements Fulfilled

- ✅ User CRUD Operations
- ✅ Product CRUD Operations
- ✅ Order Management
- ✅ Recent Orders Query
- ✅ User Orders Query
- ✅ Product Buyers Query
- ✅ Total Stock Query
- ✅ Stock Update Handling

## 🧪 Testing

Test the API endpoints using cURL commands provided in the API documentation section or use API testing tools like Postman/Thunder Client.

## 📚 Additional Notes

The project demonstrates:
- Clean code architecture
- RESTful API design principles
- Database relationship management
- Proper error handling
- Transaction management
- Stock management strategies
