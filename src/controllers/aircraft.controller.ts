import { Request, Response } from 'express';
import { Aircraft } from '../models/aircraft.model'; 

export const createAircraft = async (req: Request, res: Response) => {
  try {
    const { manufacturer, model, total_seats } = req.body;

    if (
      !manufacturer ||
      !model ||
      typeof total_seats !== 'number' ||
      total_seats <= 0
    ) {
      return res.status(400).json({ error: 'Missing or invalid required fields' });
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

export const getAllAircrafts = async (req: Request, res: Response) => {
  try {
    const aircrafts = await Aircraft.findAll();
    res.json(aircrafts);
  } catch (err: any) {
    console.error('Error fetching aircrafts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAircraft = async (req: Request, res: Response): Promise<void> => {
  try {
    const aircraft = await Aircraft.findByPk(req.params.id);
    if (!aircraft) {
      res.status(404).json({ message: 'Không tìm thấy tàu bay.' });
      return;
    }

    const { manufacturer, model, total_seats } = req.body;

    await aircraft.update({ manufacturer, model, total_seats });
    res.json(aircraft);
  } catch (err: any) {
    console.error('Error updating aircraft:', err);
    res.status(400).json({ error: err.message });
  }
};

export const deleteAircraft = async (req: Request, res: Response): Promise<void> => {
  try {
    const aircraft = await Aircraft.findByPk(req.params.id);
    if (!aircraft) {
      res.status(404).json({ message: 'Không tìm thấy tàu bay.' });
      return;
    }

    await aircraft.destroy();
    res.status(204).end();
  } catch (err: any) {
    console.error('Error deleting aircraft:', err);
    res.status(500).json({ error: err.message });
  }
};
