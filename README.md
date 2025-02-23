# Vaultix - Advanced Expense Management Platform

![Vaultix Banner](src/assets/images/a1.jpg)

Vaultix is a comprehensive financial management solution designed to revolutionize how individuals and businesses track, analyze, and optimize their expenses. With cutting-edge features and robust security, Vaultix provides a complete ecosystem for financial management.

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Installation Guide](#installation-guide)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contact](#contact)

## Project Overview

Vaultix is more than just an expense tracker - it's a complete financial management platform that combines robust expense tracking with advanced features like AI-powered recommendations, real-time monitoring, and secure authentication. Designed for both individuals and businesses, Vaultix offers:

- Comprehensive expense and income tracking
- Advanced financial analytics
- Secure authentication and role-based access
- AI-powered expense recommendations
- Integrated payment processing
- Real-time notifications and alerts

## Key Features

### Core Functionality
- **Expense Tracking**: Log and categorize expenses with detailed metadata
- **Income Management**: Track multiple income sources with categorization
- **Financial Analytics**: Interactive dashboards with real-time data visualization
- **Multi-user Support**: Manage multiple users with role-based access

### Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **OTP Verification**: Two-factor authentication via email/SMS
- **Password Hashing**: Bcrypt encryption for user credentials
- **Role-based Access**: Admin and user roles with different permissions

### Advanced Features
- **AI-Powered Insights**: Machine learning-based expense recommendations
- **Expense Approval Workflow**: Create and manage approval processes
- **Payment Integration**: Seamless Razorpay integration for payments
- **Email Notifications**: Real-time alerts and reminders
- **Admin Dashboard**: Comprehensive monitoring and management tools

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Recharts | Data Visualization |
| React Hot Toast | Notifications |

### Backend
| Technology | Purpose |
|------------|---------|
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Nodemailer | Email Notifications |
| Razorpay | Payment Processing |
| Multer | File Uploads |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| GitHub Actions | CI/CD |
| AWS EC2 | Hosting |
| Nginx | Reverse Proxy |

## System Architecture

Vaultix follows a microservices architecture with the following components:

1. **Authentication Service**: Handles user authentication and authorization
2. **Expense Service**: Manages expense tracking and categorization
3. **Income Service**: Handles income tracking and management
4. **Analytics Service**: Provides financial insights and visualizations
5. **Notification Service**: Manages email and SMS notifications
6. **Payment Service**: Handles payment processing and integration

## Database Schema

### User
- `_id`: ObjectId
- `name`: String
- `email`: String
- `password`: String (hashed)
- `isVerified`: Boolean
- `role`: String (enum: ['admin', 'user'])

### Expense
- `_id`: ObjectId
- `userId`: ObjectId (reference to User)
- `category`: String
- `amount`: Number
- `date`: Date
- `description`: String
- `status`: String (enum: ['pending', 'approved', 'rejected'])

### Income
- `_id`: ObjectId
- `userId`: ObjectId (reference to User)
- `source`: String
- `amount`: Number
- `date`: Date
- `description`: String

### Notification
- `_id`: ObjectId
- `userId`: ObjectId (reference to User)
- `type`: String (enum: ['email', 'sms'])
- `content`: String
- `status`: String (enum: ['pending', 'sent', 'failed'])

### Payment
- `_id`: ObjectId
- `userId`: ObjectId (reference to User)
- `amount`: Number
- `status`: String (enum: ['pending', 'completed', 'failed'])
- `transactionId`: String

## API Documentation

### Authentication
| Endpoint | Method | Description | Example Request |
|----------|--------|-------------|-----------------|
| `/api/auth/register` | POST | User registration | ```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
``` |
| `/api/auth/login` | POST | User login | ```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
``` |
| `/api/auth/verify-otp` | POST | OTP verification | ```json
{
  "email": "user@example.com",
  "otp": "123456"
}
``` |

### Expenses
| Endpoint | Method | Description | Example Response |
|----------|--------|-------------|------------------|
| `/api/expenses` | GET | Get all expenses | ```json
[
  {
    "id": "1",
    "category": "Food",
    "amount": 25.50,
    "date": "2023-10-01"
  }
]
``` |
| `/api/expenses` | POST | Create new expense | ```json
{
  "category": "Transport",
  "amount": 15.00,
  "date": "2023-10-02"
}
``` |

### Incomes
| Endpoint | Method | Description | Example Response |
|----------|--------|-------------|------------------|
| `/api/incomes` | GET | Get all incomes | ```json
[
  {
    "id": "1",
    "source": "Salary",
    "amount": 2500.00,
    "date": "2023-10-01"
  }
]
``` |
| `/api/incomes` | POST | Create new income | ```json
{
  "source": "Freelance",
  "amount": 500.00,
    "date": "2023-10-02"
}
``` |

## Installation Guide

1. Clone the repository:
   ```
   git clone https://github.com/Yashmittal4/Vaultix
   ```
2. Navigate to the project directory:
   ```
   cd vaultix
   ```
3. Install dependencies:
   ```
   npm install
   cd backend
   npm install
   ```
4. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Then, fill in the necessary environment variables in the `.env` file.

5. Start the development server:
   ```
   npm run dev
   ```

## Usage

Visit `http://localhost:5173` in your browser to access the application.

## Development

We follow Git Flow for our development process. Please create a feature branch and submit a pull request for any new features or bug fixes.

## Testing

Run unit tests:
```
npm run test
```

Run E2E tests:
```
npm run test:e2e
```

## Deployment

We use Docker for containerization and AWS EC2 for hosting. The main branch is automatically deployed to our production environment.

## Contact

For any queries, please reach out to us at yashmittal4949@gmail.com

---

Made with ❤️ by the Vaultix Team
