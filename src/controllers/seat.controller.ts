import { Request, Response } from 'express';
import { Seat } from '../models/seat.model';
import { Flight } from '../models/flight.model';
import db from '../models';

const seatController = {
  getAllSeats: async (req: Request, res: Response) => {
    try {
      const seats = await Seat.findAll();
      res.status(200).json(seats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  createSeat: async (req: Request, res: Response) => {
    try {
      const { aircraft_id, seat_number, seat_class } = req.body;
      const seat = await Seat.create({ aircraft_id, seat_number, seat_class });
      res.status(201).json({ message: 'Seat created successfully', seat });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getSeatsByAircraft: async (req: Request, res: Response) => {
    try {
      const { aircraft_id } = req.params;
      const seats = await Seat.findAll({ where: { aircraft_id } });
      res.status(200).json(seats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getSeatsByFlightNumber: async (req: Request, res: Response) => {
    try {
      const { flightNumber } = req.params;

      // Tìm chuyến bay theo mã
      const flight = await Flight.findOne({
        where: { flight_number: flightNumber },
        include: [{ model: db.Aircraft, as: 'aircraft' }]
      });

      if (!flight) {
        return res.status(404).json({ message: 'Flight not found' });
      }

      // Lấy danh sách ghế của máy bay
      const seats = await Seat.findAll({
        where: { aircraft_id: flight.aircraft_id }
      });

      // Lấy danh sách ghế đã được đặt
      const bookedSeats = await db.Ticket.findAll({
        where: { flight_id: flight.flight_id },
        attributes: ['seat_id']
      });

      const bookedSeatIds = bookedSeats.map(ticket => ticket.seat_id);

      // Map trạng thái ghế
      const seatsWithStatus = seats.map(seat => ({
        seat_id: seat.seat_id,
        seat_number: seat.seat_number,
        seat_class: seat.seat_class,
        status: bookedSeatIds.includes(seat.seat_id) ? 'booked' : 'available'
      }));

      res.status(200).json(seatsWithStatus);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getSeatStatus: async (req: Request, res: Response) => {
    try {
      const { flightNumber, seatId } = req.params;

      // Tìm chuyến bay theo mã
      const flight = await Flight.findOne({
        where: { flight_number: flightNumber }
      });

      if (!flight) {
        return res.status(404).json({ message: 'Flight not found' });
      }

      // Kiểm tra trạng thái ghế
      const ticket = await db.Ticket.findOne({
        where: {
          flight_id: flight.flight_id,
          seat_id: parseInt(seatId)
        }
      });

      res.status(200).json({
        status: ticket ? 'booked' : 'available'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  lockSeat: async (req: Request, res: Response) => {
    try {
      const { flightNumber, seatId } = req.params;

      console.log('Checking seat availability:', { flightNumber, seatId });

      // Tìm chuyến bay theo mã
      const flight = await Flight.findOne({
        where: { flight_number: flightNumber }
      });

      if (!flight) {
        console.log('Flight not found:', flightNumber);
        return res.status(404).json({ message: 'Flight not found' });
      }

      // Kiểm tra xem ghế đã được đặt chưa
      const existingTicket = await db.Ticket.findOne({
        where: {
          flight_id: flight.flight_id,
          seat_id: parseInt(seatId)
        }
      });

      if (existingTicket) {
        console.log('Seat already booked:', seatId);
        return res.status(400).json({ message: 'Seat is already booked' });
      }

      // Nếu ghế còn trống, trả về thông tin ghế
      const seat = await Seat.findOne({
        where: { seat_id: parseInt(seatId) }
      });

      if (!seat) {
        return res.status(404).json({ message: 'Seat not found' });
      }

      console.log('Seat is available:', seat);
      res.status(200).json({
        message: 'Seat is available',
        seat: {
          seat_id: seat.seat_id,
          seat_number: seat.seat_number,
          seat_class: seat.seat_class
        }
      });
    } catch (error) {
      console.error('Error in lockSeat:', error);
      res.status(500).json({
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};

module.exports = seatController;
