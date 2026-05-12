# Food Order Backend (Hexagonal Microservice)

Backend for a **high-load food ordering system** following **Hexagonal Architecture (Ports & Adapters)**. The core business logic is fully decoupled from frameworks, DB, cache, and message brokers, making it easy to test and swap adapters (HTTP/DB/Redis/RabbitMQ) without affecting the domain.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Hexagonal Architecture](#hexagonal-architecture)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Local Setup](#local-setup)
- [Docker Setup](#docker-setup)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Main Modules](#main-modules)
- [Sample Endpoints](#sample-endpoints)
- [Folder Structure](#folder-structure)
- [CI/CD & DevOps](#cicd--devops)
- [Contributing](#contributing)
- [License](#license)

## Overview

- **Base URL**: `http://localhost:3000`
- **API prefix**: `/v1`
- **Database**: MySQL (Sequelize)
- **Cache & Distributed Lock**: Redis
- **Message Broker**: RabbitMQ
- **Real-time**: Socket.io

## Key Features

- **Absolute Overselling Protection:** Uses **Redis Distributed Lock** to lock inventory when deducting stock, ensuring no two users can buy the last item at the same time.
- **Async Processing:** **RabbitMQ** as Message Broker offloads heavy tasks (e.g., order DB writes) to background workers, making APIs instantly responsive.
- **Real-time Notification:** **Socket.io** pushes real-time order status updates to clients.
- **Fully Containerized:** The entire system (API, Worker, MySQL, Redis, RabbitMQ) is cleanly containerized with Docker.

## Hexagonal Architecture

Goal: Business logic "lives" at the center, while frameworks/DB/cache/queue are just replaceable adapters.

- **Domain / Use case**: Core business logic (create order, add to cart, deduct inventory, etc.)
- **Ports**: Interfaces for domain input/output (repo, service, message publisher)
- **Adapters**: Implementations of ports (HTTP controller/router, Sequelize repo, Redis repo, RabbitMQ publisher, etc.)
- **Infrastructure / Components**: Setup for DB, Redis, RabbitMQ, config, and wiring

## Tech Stack

- **Node.js + TypeScript**
- **Express** (HTTP)
- **Sequelize** + **mysql2**
- **Redis** (Caching & Locking)
- **RabbitMQ** (Message Queue)
- **Socket.io** (WebSockets)
- **JWT** (Auth) & **Zod** (Validation)
- Tooling: **ESLint**, **Prettier**, **Jest**, **Nodemon**
- DevOps: **Docker**, **Docker Compose**, **GitHub Actions**

## Requirements

- Node.js (recommended **>= 18**)
- MySQL
- Redis
- RabbitMQ
- Docker & Docker Compose (for containerized setup)

## Local Setup

```bash
# Install dependencies
cd api
npm install

# Start development server
npm run start:dev
```

## Docker Setup

The fastest way to spin up the entire ecosystem without installing databases locally.

```bash
# Make sure you are in the project root (where docker-compose.yml is located)
docker-compose up -d --build
```

## Environment Variables

Copy `.env.example` to `.env` and adjust values as needed:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=foodorder
DB_PASS=yourpassword
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost
JWT_SECRET=your_jwt_secret
```

## Scripts

```bash
# Lint code
npm run lint

# Run tests
npm run test

# Build for production
npm run build
```

## Main Modules

- **Brand**: Manage brands
- **Cart**: Shopping cart operations
- **Category**: Food categories
- **Inventory**: Stock management, distributed lock
- **Menu**: Menu items
- **Order**: Order creation, history, async processing
- **Users**: User management & authentication

## Sample Endpoints

```http
# Create new order
POST /v1/order

# Add item to cart
POST /v1/cart/add

# Get menu list
GET /v1/menu
```


## Folder Structure

```text
api/
	src/
		modules/
			brand/
				interface/         # TypeScript interfaces for brand domain
				model/             # Brand models, DTOs, error definitions
				usecase/           # Business logic (create, update, delete, etc.)
				innfras/           # Infrastructure (repository, transport)
				index.ts           # Module entry point
			cart/
				interface/
				model/
				usecase/
				innfras/
				index.ts
			category/
				interface/
				model/
				usecase/
				infas/             # Infrastructure (repository, rpc, transport)
				index.ts
			inventory/
				interface/
				model/
				usecase/
				innfras/
				index.ts
			menu/
				interface/
				model/
				usecase/
				innfras/
				index.ts
			order/
				interface/
				model/
				usecase/
				innfras/
				workers/           # Background workers (e.g., order processing)
				index.ts
			users/
				interface/
				model/
				usecase/
				infras/
				index.ts
		share/
			component/
				sequelize.ts       # Sequelize setup
				redis/             # Redis connection/config
			infrastructure/
				rabbitmq/          # RabbitMQ setup
				socket/            # Socket.io setup
			interface/
				index.ts           # Shared interfaces
				message-queue.ts   # Message queue interfaces
			model/
				base-error.ts      # Base error class
				base-model.ts      # Base model class
				paging.ts          # Pagination utilities
			repository/
				repo-sequelize.ts  # Shared Sequelize repository logic
			utils/
				encryption.ts      # Encryption utilities
		test/
			app.e2e-spec.ts      # End-to-end tests
			jest-e2e.json        # Jest config for e2e
	docker-compose.yml       # Docker Compose orchestration
	Dockerfile               # API Dockerfile
	package.json             # Project dependencies and scripts
	tsconfig.json            # TypeScript config
	...
```

## CI/CD & DevOps

- **Docker**: All services containerized for local/dev/prod
- **Docker Compose**: Orchestrates API, DB, Redis, RabbitMQ
- **GitHub Actions**: Automated lint, test, build, deploy

## Contributing

Pull requests are welcome! Please open issues for bugs or feature requests.

## License

MIT

Mục tiêu: nghiệp vụ “sống” ở trung tâm, còn framework/DB/cache/queue chỉ là adapter thay thế được.

- **Domain / Use case**: nghiệp vụ cốt lõi (create order, add to cart, deduct inventory…)
- **Ports**: interface “cổng” vào/ra của domain (repo, service, message publisher)
- **Adapters**: hiện thực ports (HTTP controller/router, Sequelize repo, Redis repo, RabbitMQ publisher…)
- **Infrastructure / Components**: setup kết nối DB, Redis, RabbitMQ, config, wiring

## Công nghệ

- **Node.js + TypeScript**
- **Express** (HTTP)
- **Sequelize** + **mysql2**
- **Redis** (Caching & Locking)
- **RabbitMQ** (Message Queue)
- **Socket.io** (WebSockets)
- **JWT** (Auth) & **Zod** (Validate)
- Tooling: **ESLint**, **Prettier**, **Jest**, **Nodemon**
- DevOps: **Docker**, **Docker Compose**, **GitHub Actions**

## Yêu cầu

- Node.js (khuyến nghị **>= 18**)
- MySQL
- Redis
- RabbitMQ
- Docker & Docker Compose (Nếu muốn chạy container)

## Cài đặt & chạy bằng Docker

Cách nhanh nhất để dựng toàn bộ hệ sinh thái mà không cần cài đặt các Database rườm rà lên máy thật.

```bash
# Đảm bảo bạn đang ở thư mục gốc của dự án (nơi có file docker-compose.yml)
docker-compose up -d --build