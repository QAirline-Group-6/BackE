import { Request, Response } from 'express';
import { Airport } from '../models/airport.model';
import { Op } from 'sequelize';

// Lấy tất cả sân bay
export const getAllAirports = async (req: Request, res: Response): Promise<void> => {
    try {
        const airports = await Airport.findAll();
        res.json(airports);
    } catch (error) {
        console.error('Error getting all airports:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// Tìm kiếm sân bay theo từ khóa
export const searchAirports = async (req: Request, res: Response): Promise<void> => {
    try {
        const { q } = req.query;

        if (!q) {
            res.status(400).json({ message: 'Thiếu từ khóa tìm kiếm' });
            return;
        }

        const airports = await Airport.findAll({
            where: {
                [Op.or]: [
                    { city: { [Op.like]: `%${q}%` } },
                    { code: { [Op.like]: `%${q}%` } },
                    { name: { [Op.like]: `%${q}%` } }
                ]
            }
        });

        res.json(airports);
    } catch (error) {
        console.error('Error searching airports:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// Lấy sân bay theo ID
export const getAirportById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const airport = await Airport.findByPk(id);

        if (!airport) {
            res.status(404).json({ message: 'Không tìm thấy sân bay' });
            return;
        }

        res.json(airport);
    } catch (error) {
        console.error('Error getting airport by ID:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// Thêm sân bay mới
export const createAirport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { code, name, city, country } = req.body;

        if (!code || !name || !city || !country) {
            res.status(400).json({ message: 'Thiếu thông tin sân bay' });
            return;
        }

        const airport = await Airport.create({ code, name, city, country });
        res.status(201).json(airport);
    } catch (error) {
        console.error('Error creating airport:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// Cập nhật sân bay
export const updateAirport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { code, name, city } = req.body;

        const airport = await Airport.findByPk(id);

        if (!airport) {
            res.status(404).json({ message: 'Không tìm thấy sân bay' });
            return;
        }

        airport.code = code ?? airport.code;
        airport.name = name ?? airport.name;
        airport.city = city ?? airport.city;

        await airport.save();
        res.json(airport);
    } catch (error) {
        console.error('Error updating airport:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// Xóa sân bay
export const deleteAirport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const airport = await Airport.findByPk(id);

        if (!airport) {
            res.status(404).json({ message: 'Không tìm thấy sân bay' });
            return;
        }

        await airport.destroy();
        res.json({ message: 'Xóa sân bay thành công' });
    } catch (error) {
        console.error('Error deleting airport:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};
