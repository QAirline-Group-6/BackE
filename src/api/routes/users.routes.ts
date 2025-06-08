import express from 'express';
const router = express.Router();
const userController = require('../../controllers/users.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Lấy tất cả người dùng (chỉ admin)
router.get('/', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), userController.getAllUsers);

//Lấy danh sách Admins
router.get('/admins', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), userController.getAdmins);

//Lấy danh sách Customers
router.get('/customers', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), userController.getCustomers);

// Đăng ký (cho khách)
router.post('/register', userController.registerUser);

// Tạo admin (chỉ dành cho admin)
router.post('/create-admin', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), userController.createAdmin);

// Dăng nhập (cho khách)
router.post('/login', userController.loginUser);

// Lấy thông tin user hiện tại
router.get('/me', authMiddleware.authenticateToken, userController.getCurrentUser);

// Đổi mật khẩu (cho người dùng đã đăng nhập)
router.post('/resetPassword', authMiddleware.authenticateToken, userController.resetPassword);

// Cập nhật người dùng (chỉ định ID)
router.put('/put/:id', authMiddleware.authenticateToken, userController.updateUser);

// Xoá người dùng (chỉ admin)
router.delete('/del/:id', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), userController.deleteUser);

// Lấy lịch sử booking của user (chính họ hoặc admin)
router.get('/:id/bookings/detail', authMiddleware.authenticateToken, userController.getUserBookings);

// Admin xem lịch sử booking của bất kỳ user
router.get('/:id/bookings', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), userController.getUserBookings);

// Lấy người dùng theo ID (chính họ hoặc admin)
router.get('/:id', authMiddleware.authenticateToken, userController.getUserById);

export default router;
