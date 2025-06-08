import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { Booking } from '../models/booking.model';
import { Ticket } from '../models/ticket.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

// Lấy tất cả người dùng
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy danh sách Admins
export const getAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await User.findAll({
      where: { role: 'admin' },
      attributes: { exclude: ['password'] }
    });
    res.json(admins);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy danh sách Customers
export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await User.findAll({
      where: { role: 'customer' },
      attributes: { exclude: ['password'] }
    });
    res.json(customers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy user theo ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng.' });

    await user.update(req.body);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

//Xoá user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng.' });

    await user.destroy();
    res.status(204).end();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Đăng ký
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phone }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email hoặc số điện thoại đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      phone,
      password: hashedPassword,
      role: role || 'customer'
    });

    res.status(201).json({ message: 'Đăng ký thành công', user });
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
// Tạo mới Admin
export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { username, email, phone, password } = req.body;

    if (!username || !email || !phone || !password) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin.' });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phone }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email hoặc số điện thoại đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      username,
      email,
      phone,
      password: hashedPassword,
      role: 'admin'
    });

    res.status(201).json({ message: 'Tạo admin thành công', admin });
  } catch (err: any) {
    console.error('Lỗi khi tạo admin:', err);
    res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
  }
};

// Đăng nhập
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Mật khẩu không đúng' });

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '72h' }
    );

    const userResponse = {
      id: user.user_id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      user: userResponse
    });
  } catch (err) {
    console.error('Lỗi khi đăng nhập:', err);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// Đổi mật khẩu
export const resetPassword = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Lỗi email và mật khẩu' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Không thấy người dùng' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({ message: 'Đổi mật khẩu thành công' });
  } catch (err: any) {
    console.error('Reset password error:', err);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// Lấy thông tin user từ token
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.user_id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng'
      });
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err: any) {
    console.error('Error in getCurrentUser:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ',
      error: err.message
    });
  }
};

// Lịch sử đặt vé của user
export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không thấy người dùng' });
    }

    const bookings = await Booking.findAll({
      where: { user_id: userId },
      include: [{ model: Ticket }],
      order: [['booking_time', 'DESC']]
    });

    res.json({
      user_id: user.user_id,
      bookings
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
