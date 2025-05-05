import { Request, Response } from 'express';
import { Booking } from '../models/booking.model';
import { Flight } from '../models/flight.model';
import { Seat } from '../models/seat.model';
import { Customer } from '../models/customer.model';

export const createBooking = async (req: Request, res: Response) => {
  try {
    console.log('Body:', req.body);
    const { customer_id, user_id, flight_id, seat_id, status, total_amount } = req.body;
     const flight = await Flight.findByPk(flight_id);
     if (!flight) return res.status(404).json({ message: 'Flight not found' });
 
     if (flight.available_seats <= 0) {
       return res.status(400).json({ message: 'No available seats for this flight' });
     }

    const booking = await Booking.create({
      customer_id,
      user_id,
      flight_id,
      seat_id,
      status,
      total_amount,
      booking_time: new Date()
    });
    flight.available_seats -= 1;
    await flight.save();
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
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    const flight = await Flight.findByPk(booking.flight_id);
    if (flight) {
      flight.available_seats += 1;
      await flight.save();
    }
    await booking.destroy();
    res.status(200).json({ message: 'Booking deleted and seat restored successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getBookingDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id, {
      include: [
        { model: Flight },
        { model: Seat },
        { model: Customer }
      ]
    });

    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy booking.' });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết booking:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }
};