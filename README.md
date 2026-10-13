# n8n Workflow Manager

A modern, high-fidelity full-stack web application designed for orchestrating, triggering, and monitoring n8n workflows and webhooks in real time.

Built with **React 18** and **Vite** on the frontend, and **Spring Boot 3** with **MySQL 8.0** on the backend.

---

## 🚀 Key Features

- **Live n8n Synchronization**: Connects directly to any n8n instance via the n8n REST API (`/api/v1/workflows`). Synchronizes workflows, custom webhook trigger paths, and active execution states.
- **Bi-Directional State Management**: Activate or pause workflows directly from the dashboard. Changes propagate instantly to your live n8n instance and local database.
- **Webhook Trigger Execution**: Trigger production workflows via custom webhook endpoints with genuine execution response logging and latency tracking.
- **Auto-Activation Fallback**: Automatically activates inactive workflows prior to webhook triggering to prevent 404 registration errors.
- **Execution Activity Log**: Track executions with status (`SUCCESS` / `FAILED`), execution time, duration, and export complete audit logs to CSV.
- **Analytics & Dashboard**: Real-time KPI metrics (`Total Automations`, `Enabled Automations`, `24h Runs`, `Failed Runs`) and 7-day execution volume charts.
- **Workspace & API Settings**: Manage user profiles, workspace configuration, developer API keys, and test n8n instance connectivity.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router
- **Icons**: Lucide React
- **Charts**: Recharts
- **Styling**: Vanilla CSS with Glassmorphism Design System

### Backend
- **Language**: Java 21
- **Framework**: Spring Boot 3.4
- **ORM / Persistence**: Spring Data JPA & Hibernate 6
- **Database**: MySQL 8.0 (with optional in-memory H2 profile)
- **HTTP Client**: Spring `RestTemplate` with connection pooling
- **Build Tool**: Maven Wrapper (`mvnw` / `mvnw.cmd`)

---

## 📁 Repository Structure

```
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/     # Reusable UI components (AutomationCard, StatusBadge, TopBar, etc.)
│   │   │   ├── pages/          # Views (Dashboard, AutomationsList, AutomationDetail, Workflows, Activity, Settings)
│   │   │   ├── routes.jsx      # Client-side routing
│   │   │   └── services/api.js # Unified API service layer
│   │   ├── styles/             # Global styles and theme tokens
│   │   └── main.jsx            # Application root entrypoint
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.mjs
│   └── vite.config.ts
├── backend/
│   ├── src/main/java/com/autoflow/
│   │   ├── config/             # CORS and RestTemplate configuration
│   │   ├── controller/         # REST API endpoints (Auth, Automations, Workflows, Activity, Settings)
│   │   ├── dto/                # Request & response data transfer objects
│   │   ├── entity/             # JPA entity models (Automation, Workflow, ExecutionLog, User, etc.)
│   │   ├── repository/         # Spring Data JPA repositories
│   │   └── service/            # Core business logic and n8n API client
│   ├── src/main/resources/     # Configuration files (application.properties, schema-mysql.sql)
│   ├── pom.xml                 # Maven configuration
│   └── mvnw / mvnw.cmd         # Maven wrapper scripts
├── .gitignore
├── LICENSE
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Java Development Kit (JDK)** (v21 or higher)
- **MySQL Server** (v8.0 or higher)
- An active **n8n instance** (Self-hosted or n8n Cloud)

---

### 1. Database Setup

Create a MySQL database named `autoflow_db`:

```sql
CREATE DATABASE IF NOT EXISTS autoflow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### 2. Backend Configuration & Startup

1. Open `backend/src/main/resources/application-mysql.properties` and verify your MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/autoflow_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

2. Run the Spring Boot backend:

```bash
cd backend
./mvnw spring-boot:run
```

*(On Windows PowerShell: `.\mvnw.cmd spring-boot:run`)*

The backend server starts on **`http://localhost:8080`**.

---

### 3. Frontend Installation & Startup

1. From the project directory, navigate to `frontend` and install dependencies:

```bash
cd frontend
npm install
```

2. Start the Vite development server:

```bash
npm run dev
```

The frontend application will be accessible at **`http://localhost:5173`**.

---

### 4. Connecting Your n8n Instance

1. Navigate to **Settings** in the dashboard.
2. In the **n8n Instance Configuration** section:
   - **n8n Base URL**: Enter your n8n domain (e.g. `https://n8n.yourdomain.com`).
   - **n8n API Key**: Paste your n8n Public API key (generated under *Settings > API* in n8n).
   - **n8n Webhook URL**: Enter your webhook base URL (e.g. `https://n8n.yourdomain.com/webhook`).
3. Click **Test Connection** to verify connectivity.
4. Click **Sync from n8n** to import and map all workflows into your dashboard.

---

## 📡 Core API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/automations` | List all automations with type filtering and search |
| `POST` | `/api/automations/{id}/run` | Trigger workflow webhook with real latency logging |
| `PATCH` | `/api/automations/{id}/toggle-status` | Toggle enabled/disabled and sync to n8n |
| `GET` | `/api/workflows` | List all workflows |
| `PATCH` | `/api/workflows/{id}/toggle-status` | Activate or pause workflow on n8n |
| `POST` | `/api/n8n/sync-workflows` | Synchronize workflows and trigger nodes from n8n |
| `POST` | `/api/n8n/test-connection` | Validate connection to n8n instance |
| `GET` | `/api/dashboard/kpi` | Real-time dashboard KPI metrics |
| `GET` | `/api/dashboard/chart` | 7-day execution frequency chart |
| `GET` | `/api/activity` | Execution audit log history |
| `GET` | `/api/activity/export-csv` | Download execution log as CSV |

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).