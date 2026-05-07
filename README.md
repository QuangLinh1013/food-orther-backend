# Hexagon Food Order Backend

Backend cho hệ thống **đặt đồ ăn** theo kiến trúc **Hexagonal (Ports & Adapters)**: tách nghiệp vụ khỏi framework/DB/cache để dễ test, dễ thay adapter (HTTP/DB/Redis) mà không ảnh hưởng domain.

## Mục lục

- [Tổng quan](#tổng-quan)
- [Kiến trúc Hexagonal (Ports & Adapters)](#kiến-trúc-hexagonal-ports--adapters)
- [Công nghệ](#công-nghệ)
- [Yêu cầu](#yêu-cầu)
- [Cài đặt & chạy dự án](#cài-đặt--chạy-dự-án)
- [Biến môi trường (.env)](#biến-môi-trường-env)
- [Scripts](#scripts)
- [Các module chính](#các-module-chính)
- [Một số endpoint](#một-số-endpoint)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Đóng góp](#đóng-góp)
- [License](#license)

## Tổng quan

- **Base URL**: `http://localhost:3000`
- **API prefix**: `/v1`
- **Database**: MySQL (Sequelize)
- **Cache**: Redis (Cart)

## Kiến trúc Hexagonal (Ports & Adapters)

Mục tiêu: nghiệp vụ “sống” ở trung tâm, còn framework/DB/cache chỉ là adapter thay thế được.

- **Domain / Use case**: nghiệp vụ cốt lõi (create order, add to cart, deduct inventory…)
- **Ports**: interface “cổng” vào/ra của domain (repo, service)
- **Adapters**: hiện thực ports (HTTP controller/router, Sequelize repo, Redis repo…)
- **Infrastructure / Components**: setup kết nối DB, Redis, config, wiring

## Công nghệ

- **Node.js + TypeScript**
- **Express** (HTTP)
- **Sequelize** + **mysql2**
- **Redis**
- **JWT** (Auth)
- **Zod** (Validate)
- Tooling: **ESLint**, **Prettier**, **Jest**, **Nodemon**

## Yêu cầu

- Node.js (khuyến nghị **>= 18**)
- MySQL
- Redis

## Cài đặt & chạy dự án

Chạy trong thư mục `api/`:

```bash
cd api
npm install
```

Tạo file `.env` (xem mục bên dưới), sau đó chạy dev:

```bash
npm run start:dev
```

Mặc định server chạy:

- `http://localhost:3000`

> Lưu ý: dự án hiện đang `sequelize.sync({ alter: true })` khi khởi động. Ở môi trường production nên thay bằng migration để tránh thay đổi schema ngoài ý muốn.

## Biến môi trường (.env)

Tạo `api/.env` với các biến tối thiểu sau:

```env
PORT=3000

DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=food_order
DB_USERNAME=root
DB_PASSWORD=your_password
```

Nếu bạn dùng Redis host riêng, khuyến nghị cấu hình qua biến môi trường (ví dụ `REDIS_URL`) và **không commit secrets** lên git.

## Scripts

Chạy trong `api/`:

```bash
npm run start:dev    # chạy dev (nodemon + ts-node)
npm run build        # build typescript -> dist
npm run start:prod   # chạy production từ dist
npm run lint         # eslint --fix
npm run format       # prettier
npm test             # unit tests
```

## Các module chính

- **Category**: quản lý danh mục món ăn (CRUD)
- **Brand**: quản lý thương hiệu (CRUD)
- **User**: đăng ký / đăng nhập
- **Menu**: quản lý thực đơn (CRUD)
- **Cart**: giỏ hàng (Redis)
- **Inventory**: tồn kho, trừ kho khi đặt hàng
- **Order**: tạo đơn, xử lý luồng đặt hàng

## Một số endpoint

Prefix: `/v1`

- `GET /categories` — danh sách danh mục
- `POST /brands` — tạo thương hiệu
- `POST /users/register` — đăng ký
- `POST /users/login` — đăng nhập
- `GET /menus` — danh sách menu
- `POST /cart` — thêm vào giỏ hàng
- `POST /inventory/deduct` — trừ tồn kho
- `POST /order` — tạo đơn hàng

## Cấu trúc thư mục

```text
api/
  src/
    modules/            # các bounded-context / module nghiệp vụ
    share/              # component dùng chung (db/redis/config/...)
  test/                 # tests
```

## Đóng góp

- Chạy `npm run lint` và `npm run format` trước khi commit.
- Không commit `.env`, credentials, hoặc dữ liệu nhạy cảm.

## License

UNLICENSED
