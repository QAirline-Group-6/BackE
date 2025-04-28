import { Request, Response } from 'express';
import { Booking } from '../models/booking.model';

export const createBooking = async (req: Request, res: Response) => {
  try {
    console.log('Body:', req.body);
    const { customer_id, user_id, flight_id, seat_id, status, total_amount } = req.body;

    const booking = await Booking.create({
      customer_id,
      user_id,
      flight_id,
      seat_id,
      status,
      total_amount,
      booking_time: new Date()
    });

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.findAll();
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await Booking.update(req.body, { where: { booking_id: id } });
    if (updated === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    const updatedBooking = await Booking.findByPk(id);
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Booking.destroy({ where: { booking_id: id } });
    if (deleted === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
