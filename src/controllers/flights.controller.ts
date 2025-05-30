import { Request, Response } from 'express';
import db from '../models';
import { Sequelize, Op } from 'sequelize';

const Flight = db.Flight;

export const getAllFlights = async (req: Request, res: Response): Promise<void> => {
  try {
    const flights = await Flight.findAll();
    res.json(flights);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getPopularFlights = async (req: Request, res: Response): Promise<void> => {
  try {
    const flights = await Flight.findAll({
      order: [['bookings', 'DESC']],
      limit: 5
    });
    res.json(flights);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getFlightById = async (req: Request, res: Response): Promise<void> => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) {
      res.status(404).json({ message: 'Không tìm thấy chuyến bay.' });
      return;
    }
    res.json(flight);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createFlight = async (req: Request, res: Response): Promise<void> => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json(flight);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateFlight = async (req: Request, res: Response): Promise<void> => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) {
      res.status(404).json({ message: 'Không tìm thấy chuyến bay.' });
      return;
    }

    await flight.update(req.body);
    res.json(flight);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteFlight = async (req: Request, res: Response): Promise<void> => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) {
      res.status(404).json({ message: 'Không tìm thấy chuyến bay.' });
      return;
    }

    await flight.destroy();
    res.status(204).end();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const searchFlightsByDes = async (req: Request, res: Response): Promise<void> => {
  try {
    const from = req.query.from as string;
    const to = req.query.to as string;

    if (!from || !to) {
      res.status(400).json({ message: 'Missing departure or destination airport ID' });
      return;
    }

    const flights = await Flight.findAll({
      where: {
        departure_airport_id: parseInt(from),
        destination_airport_id: parseInt(to),
      },
    });

    res.status(200).json(flights);
  } catch (error: any) {
    console.error('Error searching flights:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const searchFlightsByPrice = async (req: Request, res: Response): Promise<void> => {
  try {
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;

    if ((minPrice && isNaN(minPrice)) || (maxPrice && isNaN(maxPrice))) {
      res.status(400).json({ message: 'Giá trị không hợp lệ' });
      return;
    }

    const whereClause: any = {};

    if (minPrice !== undefined && maxPrice !== undefined) {
      whereClause.price_economy = { [Op.between]: [minPrice, maxPrice] };
    } else if (minPrice !== undefined) {
      whereClause.price_economy = { [Op.gte]: minPrice };
    } else if (maxPrice !== undefined) {
      whereClause.price_economy = { [Op.lte]: maxPrice };
    }

    const flights = await Flight.findAll({
      where: whereClause,
    });

    res.status(200).json(flights);
  } catch (error: any) {
    console.error('Lỗi tìm chuyến bay theo giá:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};