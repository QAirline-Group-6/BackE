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
      user_id,
      status,
      total_amount,
      booking_time: new Date()
    });
    flight.available_seats -= 1;
    await flight.save();
    res.status(201).json({ message: 'Đặt vé thanh công', booking });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.findAll();
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Không có được thông tin đặt vé:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm được thông tin đặt vé' });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error('Không có được thông tin đặt vé:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
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

// export const cancelBooking = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const booking = await Booking.findByPk(id);
//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }
//     const flight = await Flight.findByPk(booking.flight_id);
//     if (flight) {
//       flight.available_seats += 1;
//       booking.status = 'cancelled'
//       await flight.save();
//     }
//     res.status(200).json({ message: 'Booking is cancelled' });
//   } catch (error) {
//     console.error('Error deleting booking:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


