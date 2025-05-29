import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

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

// Đăng ký người dùng
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

    const hashedPassword = await bcrypt.hash(password, 10); // mã hóa mật khẩu

    const user = await User.create({
      username,
      email,
      phone,
      password: hashedPassword,
      role: role || 'customer'
    }); // Thêm người dùng vào csdl

    res.status(201).json({ message: 'Đăng ký thành công', user }); // Gửi phản hồi
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Đăng nhập người dùng
export const loginUser = async (req: Request, res: Response) => {
  console.log("BODY:", req.body);
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' }); //Kiểm tra có người dùng hay không

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Mật khẩu không đúng' });

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '72h' }
    );

    // Tạo user object không bao gồm password và fullName
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