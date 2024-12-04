# E-commerce API Project

A robust RESTful API for an e-commerce platform implementing clean architecture, proper error handling, and database optimization. This project was developed as part of an internship assignment for Imagined.

## 🌐 Live API

Base URL: https://ecommerce-api-6jmm.onrender.com

## 🛠 Technology Stack

- **Runtime**: Bun
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Deployment**: Render
- **Version Control**: Git
- **Development Tools**: Docker (for local PostgreSQL)

## 🧪 Testing with Postman

### Quick Start

1. Download and import the [Postman Collection](./postman_collection.json)
2. Set up your environment in Postman:
   - Base URL: `https://ecommerce-api-6jmm.onrender.com`

### Testing Flow

1. Create a user and save the returned `id`
2. Create a product and save the returned `id`
3. Create orders using both approaches:
   - Transaction-based: `/api/orders`
   - Optimistic locking: `/api/orders/optimistic`

### Alternative: Ready-to-Use Collection

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://god.gw.postman.com/run-collection/32163632-3698eb96-f87d-4d5a-96a7-9e32aeb2a8a0?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D32163632-3698eb96-f87d-4d5a-96a7-9e32aeb2a8a0%26entityType%3Dcollection%26workspaceId%3D6dba05e0-8c32-490c-b214-47e361ec64b0)

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

- Create new orders with two stock management approaches:
  - Transaction-based (default)
  - Optimistic locking (for high concurrency)
- Update order details
- Get order information
- View orders from last 7 days
- Get all orders for a specific user
- Get all users who bought a specific product

## 🚀 Getting Started

### Prerequisites

- Bun installed
- Docker installed (for local PostgreSQL)
- Git

### Local Development Setup

1. Clone the repository:

```bash
git clone https://github.com/itsOmSarraf/ecommerce-api.git
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

5. Start the development server:

```bash
bun dev
```

## 📝 API Documentation

### User Endpoints

```bash
# Create User
curl -X POST https://ecommerce-api-6jmm.onrender.com/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890"
  }'

# Get User
curl https://ecommerce-api-6jmm.onrender.com/api/users/:id

# Update User
curl -X PUT https://ecommerce-api-6jmm.onrender.com/api/users/:id \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated"
  }'
```

### Product Endpoints

```bash
# Create Product
curl -X POST https://ecommerce-api-6jmm.onrender.com/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15",
    "category": "Electronics",
    "price": 999.99,
    "stock": 50
  }'

# Get Product
curl https://ecommerce-api-6jmm.onrender.com/api/products/:id

# Update Product
curl -X PUT https://ecommerce-api-6jmm.onrender.com/api/products/:id \
  -H "Content-Type: application/json" \
  -d '{
    "price": 899.99
  }'

# Get Total Stock
curl https://ecommerce-api-6jmm.onrender.com/api/products/stock/total
```

### Order Endpoints

```bash
# Create Order (Transaction-based)
curl -X POST https://ecommerce-api-6jmm.onrender.com/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id",
    "productId": "product_id",
    "quantity": 2
  }'

# Create Order (Optimistic Locking)
curl -X POST https://ecommerce-api-6jmm.onrender.com/api/orders/optimistic \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id",
    "productId": "product_id",
    "quantity": 2
  }'

# Get Order
curl https://ecommerce-api-6jmm.onrender.com/api/orders/:id

# Update Order
curl -X PUT https://ecommerce-api-6jmm.onrender.com/api/orders/:id \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 3
  }'

# Get Recent Orders (Last 7 Days)
curl https://ecommerce-api-6jmm.onrender.com/api/orders/recent/last7days

# Get User's Orders
curl https://ecommerce-api-6jmm.onrender.com/api/orders/user/:userId

# Get Product Buyers
curl https://ecommerce-api-6jmm.onrender.com/api/orders/product/:productId/buyers
```

## 💡 Technical Highlights

### 1. Stock Management Approaches

#### Transaction-based Approach (Default)

- Uses Prisma transactions for atomicity
- Locks relevant rows during operation
- Guarantees data consistency
- Best for typical e-commerce loads
- Implemented at `/api/orders`

```typescript
const order = await prisma.$transaction(async (prisma) => {
  const newOrder = await prisma.order.create({...});
  await prisma.product.update({...});
  return newOrder;
});
```

#### Optimistic Locking Approach

- No database locks
- Retries on conflicts (up to 3 times)
- Better performance in high-concurrency situations
- Implemented at `/api/orders/optimistic`

```typescript
while (retries > 0) {
  try {
    return await prisma.product.update({
      where: {
        id: productId,
        stock: currentStock // Ensures stock hasn't changed
      },
      data: {...}
    });
  } catch (error) {
    retries--;
  }
}
```

### 2. Database Optimization

- Proper indexing on foreign keys
- Efficient queries using Prisma's features
- Transaction management for data consistency
- Relationship management between entities

### 3. Error Handling

- Comprehensive error handling for all endpoints
- Proper HTTP status codes
- Informative error messages
- Retry mechanism for optimistic locking

## 🔍 Assignment Requirements Fulfilled

- ✅ User CRUD Operations
- ✅ Product CRUD Operations
- ✅ Order Management with two stock update approaches
- ✅ Recent Orders Query
- ✅ User Orders Query
- ✅ Product Buyers Query
- ✅ Total Stock Query
- ✅ Stock Update Handling (Both Transaction & Optimistic)

## 📚 Additional Notes

The project demonstrates:

- Clean code architecture
- RESTful API design principles
- Database relationship management
- Advanced transaction handling
- Optimistic locking implementation
- Proper error handling
- Deployment best practices
