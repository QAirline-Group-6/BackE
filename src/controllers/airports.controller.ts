import { Request, Response } from 'express';
import { Airport } from '../models/airports.model';
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