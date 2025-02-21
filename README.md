# PetroFlow Web

## 🚀 Overview

PetroFlow is a modern, full-stack web application designed to streamline the management of petroleum stations. It provides a robust dashboard for monitoring sales, employees, and facilities, offering real-time insights and an intuitive user experience.

## 🛠 Tech Stack

### **Frontend:**

- **React** – Component-based UI development
- **Vite** – Fast build tool for optimized performance
- **TypeScript** – Strongly typed JavaScript for better maintainability
- **Tailwind CSS** – Utility-first CSS framework for rapid styling

### **Backend:**

- **Spring Boot** – Java-based backend framework
- **PostgreSQL** – Relational database for data persistence
- **Docker** – Containerization for seamless deployment

### **Communication:**

- **REST APIs** – Enables communication between frontend and backend

## ✨ Features

- **User Authentication & Role-Based Access** – Secure login and permissions
- **Organization & Facility Management** – Manage stations, employees, and departments
- **Employee Tracking** – Monitor and assign roles to employees
- **Real-time Sales Dashboard** – View insights with dynamic charts and tables
- **Data Import & Export** – Bulk uploads and data exports for reporting
- **Theming Support** – Light & dark themes for better user experience

## 📦 Installation

### **1. Clone the Repository**

```sh
git clone https://github.com/Angera-Silas/petroflow-web.git
cd petroflow-web
```

### **2. Setup the Frontend**

```sh
cd frontend
npm install  # Install dependencies
npm run dev  # Start development server
```

### **3. Setup the Backend**

Clone the backend codebase:

```sh
git clone https://github.com/Angera-Silas/petroflow-backend.git
cd petroflow-backend
```

Ensure Docker is installed and running.

```sh
cd backend
docker-compose up --build  # Start PostgreSQL and backend services
docker-compose up -d
```

Run Spring Boot:

```sh
./mvnw clean install
./mvnw spring-boot:run
```

## 🚀 Running the Application

- **Frontend:** Runs on `http://localhost:5173`
- **Backend:** Runs on `http://localhost:8081`

## 📖 API Documentation

The backend exposes REST APIs for data exchange. View API documentation via Swagger:

```sh
http://localhost:8080/swagger-ui/
```

## 🤝 Contributing

1. Fork the repository  
2. Create a new feature branch (`git checkout -b feature-branch`)  
3. Commit your changes (`git commit -m "Added new feature"`)  
4. Push to the branch (`git push origin feature-branch`)  
5. Create a Pull Request  

## 📝 License

This project is licensed under **MIT** – see the `LICENSE.md` file for details.
