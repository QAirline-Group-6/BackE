import { Request, Response } from 'express';
import { Booking } from '../models/booking.model';
import { Flight } from '../models/flight.model';
import { Ticket } from '../models/ticket.model';
import { Seat } from '../models/seat.model';
import { Customer } from '../models/customer.model';


export const createBooking = async (req: Request, res: Response) => {
  try {
    console.log('Body:', req.body);
    const { 
      booking_code,
      user_id, 
      total_amount, 
      status = 'confirmed', 
      bookings } 
    = req.body;
    const booking = await Booking.create({
      booking_code,
      user_id,
      status,
      total_amount,
      booking_time: new Date()
    });
    const createdTickets = [];
    for (const bookingItem of bookings) {
      const flight = await Flight.findByPk(bookingItem.flight_id);
      if (!flight) {
        return res.status(404).json({ message: `Không tìm thấy chuyến bay ${bookingItem.flight_id}` });
      }
      const numTickets = bookingItem.tickets.length;
      if (flight.available_seats < numTickets) {
        return res.status(400).json({ message: `Không đủ ghế cho chuyến bay ${flight.flight_id}` });
      }
      for (const ticketData of bookingItem.tickets) {
        const customer = await Customer.create({ ...ticketData.customer, user_id });
        const ticket = await Ticket.create({
          booking_id: booking.booking_id,
          flight_id: flight.flight_id,
          seat_id: ticketData.seat_id,
          customer_id: customer.customer_id,
          price: ticketData.price,
          status: 'booked'
        });
        createdTickets.push({ ticket, customer });
      }
      flight.available_seats -= numTickets;
      await flight.save();
    }
    res.status(201).json({
      message: 'Đặt vé thành công',
      booking,
      tickets: createdTickets
    });
  } catch (err: any) {
    console.error('Lỗi khi tạo booking:', err);
    res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
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

export const getAllTicket = async (req: Request, res: Response) => {
  try {
    const tickets = await Ticket.findAll();
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Không có được thông tin vé:', error);
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

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    const tickets = await Ticket.findAll({ where: { booking_id: booking.booking_id } });
    for(const ticket of tickets){
      ticket.status = 'cancelled';
      const flight = await Flight.findByPk(ticket.flight_id);
        if (flight) {
          flight.available_seats += 1;  
          await flight.save();
        }
      await ticket.destroy();
    } 
    booking.status = 'cancelled';
    await booking.save();
    res.status(200).json({ message: 'Booking is cancelled' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUserBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await Booking.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không thấy người dùng' });
    }

    const bookings = await Booking.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Ticket,
        }
      ],
      order: [['booking_time', 'DESC']]
    });

    res.json({
      user_id: user.user_id,
      bookings
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};