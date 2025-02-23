# 🚀 Vaultix - The Ultimate Expense Management Solution

![Vaultix Banner](src/assets/images/115773440.jpeg)
![GitHub](https://img.shields.io/github/license/your-repo/vaultix)
![Node Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![React Version](https://img.shields.io/badge/react-18-blue)

Vaultix is not just another expense tracker - it's a comprehensive financial management platform that combines cutting-edge technology with user-friendly design to revolutionize how you manage your finances.

## 🌟 Key Features

### 💼 Core Functionality
- **Expense Tracking**: Log and categorize expenses with ease
- **Income Management**: Track all income sources in one place
- **Real-time Analytics**: Visualize your financial data with interactive charts
- **Multi-device Sync**: Access your data from anywhere, anytime

### 🔐 Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **OTP Verification**: Two-factor authentication via email/SMS
- **Password Hashing**: Bcrypt encryption for user credentials
- **Role-based Access**: Admin and user roles with different permissions

### 🚀 Advanced Features
- **AI-Powered Insights**: Get smart expense recommendations
- **Expense Approval Workflow**: Create and manage approval processes
- **Payment Integration**: Seamless Razorpay integration for payments
- **Email Notifications**: Real-time alerts and reminders
- **Admin Dashboard**: Comprehensive monitoring and management tools

## 🛠 Tech Stack

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

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5.0 or higher)
- NPM/Yarn/PNPM

### Installation
1. Clone the repository
```bash
git clone https://github.com/your-repo/vaultix.git
cd vaultix
```
2. Install dependencies
```bash
npm install
cd backend
npm install
```
3. Configure environment variables
```bash
# Create .env files in both root and backend directories
# Add required configurations
```

### Running the Application
1. Start the backend server
```bash
cd backend
npm run dev
```
2. Start the frontend development server
```bash
cd ..
npm run dev
```

## 📚 API Documentation

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

## 📸 Screenshots

![Dashboard](src/assets/images/a1.avif)
*Interactive Dashboard with Real-time Analytics*

![Expense Form](src/assets/images/a1.jpg)
*Intuitive Expense Entry Form*

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Pull Request Template
```markdown
## Description
Explain the changes you've made

## Related Issues
Fixes # (issue)

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have added tests
- [ ] Documentation has been updated
```

## 📜 License

MIT License - See [LICENSE](LICENSE) for details

## 📞 Support

For support, please open an issue or contact us at support@vaultix.com

## 🚀 Roadmap

- [x] Core Expense Tracking
- [x] Authentication System
- [x] Admin Dashboard
- [ ] Mobile App Development
- [ ] Multi-language Support
- [ ] Budget Planning Tools

## ❓ FAQ

**Q: How secure is Vaultix?**
A: Vaultix uses industry-standard security practices including JWT authentication, bcrypt password hashing, and OTP verification.

**Q: Can I use Vaultix for business purposes?**
A: Yes, Vaultix is designed to handle both personal and business finances with features like expense approval workflows and role-based access control.

**Q: Is there a mobile app?**
A: Currently, Vaultix is web-based, but we're working on mobile apps for iOS and Android.
