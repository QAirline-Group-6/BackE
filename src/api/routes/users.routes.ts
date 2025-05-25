import express from 'express'
const router = express.Router();
const userController = require('../../controllers/users.controller');
const authMiddleware = require('../middlewares/auth.middleware')

// Lấy tất cả người dùng
router.get('/',authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), userController.getAllUsers);

// Lấy người dùng theo ID
router.get('/:id', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'),  userController.getUserById);

// Cập nhật người dùng(chọn ID)
router.put('/put/:id', authMiddleware.authenticateToken, userController.updateUser);

// Xoá người dùng
router.delete('/del/:id', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), userController.deleteUser);

// Đăng ký (cho khách)
router.post('/register', userController.registerUser);

// Đăng nhập (cho khách)
router.post('/login', userController.loginUser);

// Đổi mật khẩu(cho khách)
router.post('/resetPassword', userController.resetPassword);

export default router
