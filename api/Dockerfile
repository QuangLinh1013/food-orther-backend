# Sử dụng môi trường Node.js 18 bản nhẹ (alpine)
FROM node:18-alpine

# Cài đặt công cụ cần thiết để build (nếu có các thư viện C++)
RUN apk add --no-cache python3 make g++

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy package.json vào trước để tận dụng cache
COPY package*.json ./

# Cài đặt thư viện
RUN npm install

# Copy toàn bộ source code vào
COPY . .

# Build mã nguồn TypeScript ra JavaScript
RUN npm run build

# Mở cổng 3000
EXPOSE 3000

# Lệnh khởi chạy server (sử dụng file js đã build trong thư mục dist)
CMD ["npm", "start"]