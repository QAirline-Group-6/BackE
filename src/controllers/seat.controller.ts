import { Request, Response } from 'express';
import { Seat } from '../models/seat.model';

export const createSeat = async (req: Request, res: Response) => {
  try {
    const { aircraft_id, seat_number, seat_class } = req.body;
    const seat = await Seat.create({ aircraft_id, seat_number, seat_class });
    res.status(201).json({ message: 'Seat created successfully', seat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSeatsByAircraft = async (req: Request, res: Response) => {
  try {
    const { aircraft_id } = req.params;
    const seats = await Seat.findAll({ where: { aircraft_id } });
    res.status(200).json(seats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
