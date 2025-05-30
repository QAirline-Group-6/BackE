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

// tìm chuyến bay thời gian đi và về
export const searchFlights = async (req: Request, res: Response) => {
  try {
    const from = req.query.from as string;
    const to = req.query.to as string;

    if (!from || !to) {
      return res.status(400).json({ message: 'Missing departure or destination' });
    }

    const flights = await Flight.findAll({
      where: {
        departure_airport_id: from,
        destination_airport_id: to,
      },
    });

    res.status(200).json(flights);
  } catch (error) {
    console.error('Error searching flights:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const searchFlightsByPrice = async (req: Request, res: Response) => {
  try {
    const { minPrice, maxPrice } = req.query;

    // Parse giá trị từ query (có thể là string nên cần ép kiểu số)
    const min = minPrice ? parseFloat(minPrice as string) : undefined;
    const max = maxPrice ? parseFloat(maxPrice as string) : undefined;

    if (min !== undefined && isNaN(min)) {
      return res.status(400).json({ message: 'minPrice must be a number' });
    }

    if (max !== undefined && isNaN(max)) {
      return res.status(400).json({ message: 'maxPrice must be a number' });
    }

    const whereClause: any = {
      status: 'scheduled', // Chỉ tìm chuyến chưa bay hoặc chưa hủy
    };

    // Thêm điều kiện lọc theo giá economy
    if (min !== undefined && max !== undefined) {
      whereClause.price_economy = { [Op.between]: [min, max] };
    } else if (min !== undefined) {
      whereClause.price_economy = { [Op.gte]: min };
    } else if (max !== undefined) {
      whereClause.price_economy = { [Op.lte]: max };
    }

    const flights = await Flight.findAll({ where: whereClause });

    return res.status(200).json({ flights });
  } catch (error: any) {
    console.error('Error searching flights:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
