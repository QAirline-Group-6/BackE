import express from 'express';
const router = express.Router();
const customerController = require('../../controllers/customer.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Tạo customer
router.post('/', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), customerController.createCustomer);

// Lấy tất cả customer
router.get('/', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), customerController.getAllCustomers);

// Lấy customer theo id
router.get('/:id', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'),customerController.getCustomerById);

// Cập nhật customer
router.put('/:id', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), customerController.updateCustomer);

// Xóa customer
router.delete('/:id', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), customerController.deleteCustomer);

export default router;