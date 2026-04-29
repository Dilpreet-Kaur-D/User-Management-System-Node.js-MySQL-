# 🗄️ User Management System (Node.js + MySQL)

A simple backend project built using **Node.js**, **Express**, and **MySQL** that performs full CRUD operations (Create, Read, Update, Delete) on users.

---

## 🚀 Features

- 📊 View total number of users
- 📄 Display all users
- ✏️ Edit username (with password verification)
- ➕ Add new users
- ❌ Delete users (with email + password verification)
- 🔐 Environment variables using `.env`

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MySQL (mysql2)
- EJS (templating)
- Faker.js (for dummy data)
- Method-Override
- Dotenv

---


---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository


git clone <your-repo-link>
cd project-folder

2️⃣ Install dependencies
npm install

3️⃣ Create .env file

Create a .env file in the root directory and add:

DB_PASSWORD=your_mysql_password


🗄️ Database Setup
1️⃣ Create Database

Login to MySQL and run:

CREATE DATABASE dil;
USE dil;
2️⃣ Import Schema

Run this command in terminal:

mysql -u root -p dil < schema.sql

Or open schema.sql and run queries manually in MySQL.

▶️ Run the Project
nodemon index.js

Open in browser:

http://localhost:8080

🌱 Future Improvements
🔐 Authentication (login/signup)
🔑 Password hashing (bcrypt)
🌐 Convert to REST API
🚀 Deployment (Render / Railway)


👩‍💻 Author
Dilpreet Kaur

⭐ Support

If you like this project, give it a ⭐ on GitHub!