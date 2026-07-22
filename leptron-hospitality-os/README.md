# Leptron HospitalityOS

Enterprise-grade cloud-native Hotel Property Management System (PMS) comparable to Oracle Opera Cloud, Cloudbeds, Mews, Hotelogix, IDS Next and StayNTouch.

## 🏗 Architecture

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS, ShadCN
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Cache**: Redis
- **Infrastructure**: Docker, Docker Compose, Nginx

## 📦 Modules

### Core Modules
- Authentication & Authorization (JWT, MFA, RBAC)
- Organization & Property Management
- User & Role Management
- Property Structure (Buildings, Wings, Floors, Rooms)

### Operations Modules
- Reservation Engine
- Front Desk Operations
- Guest Management
- Housekeeping
- Maintenance
- Restaurant POS
- Banquet & Events

### Business Modules
- Inventory Management
- Finance & Accounting
- Revenue Management
- Channel Manager
- CRM & Marketing

### AI Modules
- AI Concierge
- AI Front Desk
- AI Reservation Assistant
- AI Revenue Manager
- AI Analytics

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16+
- Redis 7+

### Installation

```bash
# Clone the repository
cd leptron-hospitality-os

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start infrastructure (PostgreSQL, Redis)
npm run docker:up

# Run database migrations
npm run db:migrate

# Start development servers
npm run dev
```

### Access Points
- API: http://localhost:3001
- Web: http://localhost:80
- Health Check: http://localhost:3001/health

## 📁 Project Structure

```
leptron-hospitality-os/
├── apps/
│   ├── api/                 # Backend API
│   └── web/                 # Frontend Web App
├── packages/
│   ├── database/            # Database schema & migrations
│   ├── ui/                  # Shared UI components
│   └── shared/              # Shared utilities & types
├── infra/                   # Infrastructure configs
├── docker-compose.yml       # Docker orchestration
└── package.json            # Root package.json
```

## 🔐 Security Features

- JWT Authentication with Refresh Tokens
- Multi-Factor Authentication (MFA)
- Role-Based Access Control (RBAC)
- Password Policy Enforcement
- Account Lockout Protection
- Rate Limiting
- CORS Protection
- Helmet Security Headers
- SQL Injection Prevention
- XSS Protection
- CSRF Protection
- Audit Logging

## 📊 Multi-Tenancy

- Organization-level isolation
- Property-level data segregation
- Tenant-aware queries
- Shared nothing architecture option

## 🛠 Development

```bash
# Run API in development
npm run dev:api

# Run Web in development
npm run dev:web

# Build all packages
npm run build

# Run tests
npm run test

# Lint code
npm run lint
```

## 📝 API Documentation

API documentation will be available at `/api/v1/docs` once Swagger/OpenAPI is configured.

## 📄 License

Proprietary - All rights reserved.

## 👥 Contributors

Leptron Technologies
