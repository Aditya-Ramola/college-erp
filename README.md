# SGRRU-ERP | Modern College Management System

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white" alt="Redux" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" />
</div>

<br />

A comprehensive Enterprise Resource Planning system built for educational institutions using the MERN stack (MongoDB, Express.js, React, Node.js). This application streamlines administrative tasks, enhances faculty productivity, and improves the student experience.

## ✨ Key Features

### 🔐 Robust Authentication & Authorization
- Secure role-based access control for Admins, Faculty, and Students
- JWT-based authentication
- Protected routes and navigation

### 👨‍💼 Administrative Dashboard
- Comprehensive user management (add, update, delete users)
- Department and subject creation
- Campus-wide notice board management
- Profile management with secure password updates

### 👩‍🏫 Faculty Portal
- Test creation and management
- Student attendance tracking
- Mark uploading for assessments
- Profile customization

### 👨‍🎓 Student Experience
- Attendance monitoring
- Academic performance tracking
- Subject enrollment overview
- Profile personalization

### 🛠️ Technical Enhancements
- Smart navigation handling
- Browser history management
- Cache control implementation
- Form validation with error handling
- Modern, intuitive UI

## 🚀 Quick Start

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/College-Erp.git
   cd College-Erp
   ```

2. Set up environment variables
   ```bash
   # Create a .env file in the server directory
   cp server/.env.example server/.env
   # Update MongoDB URI in .env file
   ```

3. Install dependencies & start development servers
   ```bash
   # Client setup
   cd client
   npm install
   npm start
   
   # Server setup (in a new terminal)
   cd server
   npm install
   npm start
   ```

4. Access the application
   ```
   Navigate to: http://localhost:3000/login/adminlogin
   
   # Demo Admin Credentials
   Username: ADMDUMMY
   Password: 123
   ```

## 🌐 Deployment

The application is deployed on Vercel for easy access:
- [Visit Live Demo]([https://college-erp-lovat.vercel.app/](https://college-erp-4dle.vercel.app/))

## 🔮 Future Enhancements

- Mobile responsiveness
- Expanded modules (Finance, Library, Hostel management)
- Analytics dashboard with performance metrics
- Student feedback system
- Messaging and collaboration tools
- Calendar integration

## 🤝 Contributing

Contributions are welcome! Feel free to open issues and submit pull requests.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
