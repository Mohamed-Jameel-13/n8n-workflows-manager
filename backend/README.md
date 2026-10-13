# AutoFlow - Spring Boot 3 & MySQL Backend

Backend REST API service for **AutoFlow (n8n Workflow Manager)** built with Spring Boot 3 and MySQL 8.0.

---

## 🚀 Features

- **Automations Management**: Full CRUD, status toggle (`enabled`/`disabled`), live/simulated run trigger with automatic execution logging.
- **n8n Workflow Orchestration**: Integration client supporting n8n REST endpoints, webhooks, and automatic fallback simulation for standalone development.
- **Workflow Sequences**: Multi-step workflow sequencing with active/paused lifecycle management.
- **Unified Activity & Audit Logging**: Real-time execution tracking, durations, triggers (`WhatsApp`, `n8n Webhook`, `Cron`, `Shopify`, `Typeform`), and CSV report export.
- **Dashboard Analytics**: Real-time KPI metrics (`totalAutomations`, `enabledAutomations`, `runs24h`, `failedRuns`) and 7-day run frequency charts.
- **Settings & API Credentials**: User profile management, workspace settings, API key generation and revocation.
- **High-Fidelity Automated Seeding**: On first boot, seeds the database with the mock dataset identically matching the AutoFlow frontend.
- **CORS Configured**: Ready to connect with the frontend running on `http://localhost:5173` or any origin.

---

## 🛠️ Tech Stack

- **Java**: 21 / 25
- **Framework**: Spring Boot 3.4.3
- **ORM / Persistence**: Spring Data JPA & Hibernate 6
- **Database**: MySQL 8.0 (with H2 in-memory profile for testing)
- **HTTP Client**: Spring `RestTemplate` with connection pooling
- **Build System**: Maven (via included Maven Wrapper `mvnw` / `mvnw.cmd`)

---

## 📁 Directory Structure

```
backend/
├── pom.xml                               # Maven project dependencies & build plugins
├── mvnw & mvnw.cmd                       # Maven wrapper executables
├── src/
│   ├── main/
│   │   ├── java/com/autoflow/
│   │   │   ├── AutoflowBackendApplication.java # Spring Boot main entrypoint
│   │   │   ├── config/
│   │   │   │   ├── CorsConfig.java           # Cross-Origin Resource Sharing configuration
│   │   │   │   └── RestTemplateConfig.java   # HTTP client configuration for n8n API
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java       # Login & signup endpoints
│   │   │   │   ├── AutomationController.java # Automation CRUD, run & toggle status
│   │   │   │   ├── WorkflowController.java   # Workflow management endpoints
│   │   │   │   ├── ActivityController.java   # Execution logs & CSV export
│   │   │   │   ├── DashboardController.java  # KPI cards & 7-day chart stats
│   │   │   │   ├── SettingsController.java   # Profile, workspace & API keys
│   │   │   │   └── N8nIntegrationController.java # n8n health & webhook handler
│   │   │   ├── dto/                          # Clean request & response DTOs
│   │   │   ├── entity/                       # JPA database entities
│   │   │   ├── repository/                   # Spring Data JPA repositories
│   │   │   └── service/                      # Business logic & data seeding
│   │   └── resources/
│   │       ├── application.properties        # App & database configuration
│   │       └── schema-mysql.sql              # Raw MySQL schema reference script
│   └── test/                                 # Spring Boot & MockMvc integration tests
```

---

## ⚙️ Database Configuration (Zero-Config Dev vs. MySQL)

The backend supports two database profiles:

### 1. `dev` Profile (Default — Zero Setup Required!)
- **Active by default**: Uses the built-in H2 in-memory engine.
- **No MySQL install or password needed**: Just run `.\mvnw.cmd spring-boot:run` and the backend starts immediately!
- Automatically seeds all 6 automations, 19 execution logs, 3 workflows, 2 API keys, and demo user.
- Built-in Web Console available at: **`http://localhost:8080/h2-console`** (JDBC URL: `jdbc:h2:mem:autoflow_db`, User: `sa`, Password: *(empty)*).

---

### 2. `mysql` Profile (Local or Cloud MySQL 8.0)
To use MySQL, ensure your MySQL service is running and configure your credentials:

#### Option A: Edit `src/main/resources/application-mysql.properties`
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/autoflow_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

#### Option B: Set Environment Variables in PowerShell
```powershell
$env:SPRING_PROFILES_ACTIVE="mysql"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_mysql_password"
.\mvnw.cmd spring-boot:run
```

*(Note: Spring Boot Hibernate automatically creates all tables and foreign keys. A raw SQL reference script is also provided at `src/main/resources/schema-mysql.sql` if you prefer manual SQL execution).*

---

## 🏃 Running the Backend

### Prerequisites
- JDK 21 or 25 installed.
- MySQL 8.0 running locally on port 3306 (or configure credentials via environment variables).

### 1. Start the Spring Boot Application
From within the `backend/` directory:

```powershell
# On Windows PowerShell:
.\mvnw.cmd spring-boot:run

# Or with custom MySQL credentials:
$env:DB_USERNAME="root"; $env:DB_PASSWORD="your_password"; .\mvnw.cmd spring-boot:run
```

The application will start on port **`8080`**.

### 2. Run Integration Tests
```powershell
.\mvnw.cmd test
```

### 3. Package as an Executable JAR
```powershell
.\mvnw.cmd clean package -DskipTests
java -jar target/autoflow-backend-0.0.1-SNAPSHOT.jar
```

---

## 📡 REST API Reference

### 1. Authentication (`/api/auth`)
- `POST /api/auth/login`: Authenticate user (`{"username": "admin", "password": "123"}`).
- `POST /api/auth/signup`: Create a new user (`{"username": "...", "password": "..."}`).

### 2. Automations (`/api/automations`)
- `GET /api/automations?type={all|whatsapp|n8n|cron}&query={search}`: List filtered automations.
- `GET /api/automations/{id}`: Get automation details, logs, and success rate.
- `POST /api/automations`: Create new automation.
- `PUT /api/automations/{id}`: Update automation details.
- `PATCH /api/automations/{id}/toggle-status`: Toggle between `enabled` and `disabled`.
- `POST /api/automations/{id}/run`: Run automation now. Triggers n8n instance or smart execution simulator, saves execution log.
- `DELETE /api/automations/{id}`: Delete automation.

### 3. Workflows (`/api/workflows`)
- `GET /api/workflows`: List all workflows.
- `GET /api/workflows/{id}`: Get workflow details.
- `POST /api/workflows`: Create workflow.
- `PATCH /api/workflows/{id}/toggle-status`: Toggle between `Active` and `Paused`.
- `DELETE /api/workflows/{id}`: Delete workflow.

### 4. Activity Logs (`/api/activity`)
- `GET /api/activity`: List all execution history entries across automations.
- `GET /api/activity/export-csv`: Download CSV export of activity log.

### 5. Dashboard (`/api/dashboard`)
- `GET /api/dashboard/kpi`: KPI counters (`totalAutomations`, `enabledAutomations`, `runs24h`, `failedRuns`).
- `GET /api/dashboard/chart`: 7-day weekly run frequency data (`[{"day": "Mon", "runs": 38}, ...]`).
- `GET /api/dashboard/recent`: Top 5 recent execution logs.

### 6. Settings & API Keys (`/api/settings`)
- `GET /api/settings`: Complete workspace, profile, and API key payload.
- `GET /api/settings/profile` & `PUT /api/settings/profile`: Get and update user profile.
- `GET /api/settings/workspace` & `PUT /api/settings/workspace`: Get and update workspace & n8n URLs.
- `GET /api/settings/api-keys`: List active API keys.
- `POST /api/settings/api-keys`: Generate a new API key.
- `DELETE /api/settings/api-keys/{id}`: Revoke API key.

### 7. n8n Integration (`/api/n8n`)
- `GET /api/n8n/health`: Test connection to configured n8n instance.
- `POST /api/n8n/webhook/{slug}`: Inbound webhook receiver for n8n executions.
