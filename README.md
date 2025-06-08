# QAirline - Backend API

## Giới thiệu
Backend cho hệ thống đặt vé máy bay QAirline, cung cấp các endpoints để quản lý người dùng, chuyến bay, đặt vé và thanh toán.

## Công nghệ sử dụng
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MySQL**: Database
- **Dotenv**: Quản lý biến môi trường

## Cài đặt và Chạy

### Yêu cầu
- Node.js (version 18.0.0 trở lên)
- MySQL Server
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
```

### Cấu hình Database
1. Tạo database MySQL mới
2. Import file `database.sql` vào MySQL
3. Cấu hình thông tin kết nối trong file `.env`

### Chạy development server
```bash
npm run dev
# hoặc
yarn dev
```

Server sẽ chạy tại `http://localhost:4000`

