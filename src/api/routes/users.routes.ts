import express from 'express'
const router = express.Router();
const userController = require('../../controllers/users.controller');

// Lấy tất cả người dùng
router.get('/', userController.getAllUsers);

// Lấy người dùng theo ID
router.get('/:id', userController.getUserById);

// Cập nhật người dùng
router.put('/:id', userController.updateUser);

// Xoá người dùng
router.delete('/:id', userController.deleteUser);

// Đăng ký
router.post('/register', userController.registerUser);

// Đăng nhập
router.post('/login', userController.loginUser);



export default router
