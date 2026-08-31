# 🏥 RiwiMediCare Plus — Transactional Supply API

A REST API developed with Node.js, Express, TypeScript, Sequelize, and PostgreSQL to manage the lifecycle of medication supply requests between clinics and warehouses. It implements a strictly controlled flow through **ACID transactions** and a **Role-Based Access Control (RBAC)** system.

---

## 👤 Developer Information

- **Coder Name:** Alejandro [Your Last Name]
- **Clan:** [Your Clan Name]
- **GitHub Repository (Public):** [🔗 https://github.com/Alejandroesbr/prueba-nodejs](https://github.com/Alejandroesbr/prueba-nodejs)

---

## 🛠️ Technologies Used

The solution is built on a modern, strongly-typed technology stack:

- **Runtime:** Node.js (v18+)
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL 16
- **ORM:** Sequelize (Relational and transactional modeling)
- **Security:** JSON Web Tokens (JWT), bcrypt (Hashing), and Joi (Schema validation)
- **Documentation:** Swagger (swagger-jsdoc + swagger-ui-express)
- **Infrastructure:** Docker & Docker Compose

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the project based on the following configuration.

> **Note for the evaluator:** If running the project with Docker, keep `DB_HOST=db`. If running locally without Docker, change it to `DB_HOST=localhost`.

```env
# Environment
NODE_ENV=development
PORT=3002

# Database
DB_HOST=db
DB_PORT=5432
DB_NAME=test_db
DB_USER=db_admin
DB_PASSWORD=SecurePassword123!

# Security (JWT)
JWT_SECRET=RiwiSecureSignature2026
JWT_EXPIRES_IN=24h
```
