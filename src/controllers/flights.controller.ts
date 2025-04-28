import { Request, Response } from 'express';
import db from '../models';

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
