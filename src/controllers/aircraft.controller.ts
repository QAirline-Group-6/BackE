import { Request, Response } from 'express';
import { Aircraft } from '../models/aircraft.model'; // sửa đúng path nếu khác nhé

export const createAircraft = async (req: Request, res: Response) => {
  try {
    const { manufacturer, model, total_seats } = req.body;

    if (!manufacturer || !model || !total_seats) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newAircraft = await Aircraft.create({
      manufacturer,
      model,
      total_seats,
    });

    return res.status(201).json(newAircraft);
  } catch (error) {
    console.error('Error creating aircraft:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
