import db from '../models';
import { Request, Response } from 'express';
import { Op } from 'sequelize';

// Tổng quan dashboard
export const getSummary = async (req: Request, res: Response) => {
    try {
        const tongSoMayBay = await db.Aircraft.count();
        const tongSoChuyenBay = await db.Flight.count({
            where: {
                status: 'landed',
                departure_time: {
                    [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 7)),
                },
            },
        });
        const soVeDaDat = await db.Booking.count({
            where: {
                booking_time: {
                    [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 7)),
                },
            },
        });
        const tongDoanhThu = await db.Booking.sum('total_amount', {
            where: {
                booking_time: {
                    [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            },
        });
        res.json({ tongSoMayBay, tongSoChuyenBay, soVeDaDat, tongDoanhThu: tongDoanhThu || 0 });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unknown error' });
        }
    }
};

// Thống kê trạng thái chuyến bay
export const getFlightStatus = async (req: Request, res: Response) => {
    try {
        const chuaCatCanh = await db.Flight.count({ where: { status: 'scheduled' } });
        const dangBay = await db.Flight.count({ where: { status: 'in_air' } });
        const daHaCanh = await db.Flight.count({ where: { status: 'landed' } });
        res.json({ chuaCatCanh, dangBay, daHaCanh });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unknown error' });
        }
    }
};

// Thống kê loại máy bay
export const getAircraftStatistics = async (req: Request, res: Response) => {
    try {
        const aircrafts = await db.Aircraft.findAll({
            attributes: ['model'],
        });
        const stats: Record<string, number> = {};
        aircrafts.forEach((a: any) => {
            stats[a.model] = (stats[a.model] || 0) + 1;
        });
        res.json(stats);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unknown error' });
        }
    }
};
