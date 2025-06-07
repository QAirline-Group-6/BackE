import { Request, Response, NextFunction } from 'express';
import { Ticket, Booking, Customer, Flight, Seat, Airport, User } from '../models';
import { Op } from 'sequelize';

interface TicketWithRelations extends Ticket {
    Booking: Booking & {
        User: User;
    };
    Customer: Customer;
    Flight: Flight & {
        departureAirport: Airport;
        destinationAirport: Airport;
    };
    Seat: Seat;
}

export const searchTicketByBookingAndEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { booking_code, email } = req.query;

        if (!booking_code || !email) {
            res.status(400).json({
                success: false,
                message: 'Booking code and email are required'
            });
            return;
        }

        const tickets = await Ticket.findAll({
            include: [
                {
                    model: Booking,
                    required: true,
                    where: {
                        booking_code: booking_code
                    },
                    include: [
                        {
                            model: User,
                            required: true,
                            where: {
                                email: email
                            },
                            attributes: ['email']
                        }
                    ],
                    attributes: ['booking_code', 'booking_time', 'status', 'total_amount']
                },
                {
                    model: Customer,
                    required: true,
                    attributes: ['first_name', 'last_name', 'id_card_number']
                },
                {
                    model: Flight,
                    required: true,
                    attributes: ['flight_number', 'departure_time', 'arrival_time'],
                    include: [
                        {
                            model: Airport,
                            as: 'departureAirport',
                            foreignKey: 'departure_airport_id',
                            required: true,
                            attributes: ['name', 'city']
                        },
                        {
                            model: Airport,
                            as: 'destinationAirport',
                            foreignKey: 'destination_airport_id',
                            required: true,
                            attributes: ['name', 'city']
                        }
                    ]
                },
                {
                    model: Seat,
                    required: true,
                    attributes: ['seat_number', 'seat_class']
                }
            ],
            order: [
                [{ model: Flight, as: 'Flight' }, 'departure_time', 'ASC']
            ]
        }) as TicketWithRelations[];

        if (!tickets || tickets.length === 0) {
            res.status(404).json({
                success: false,
                message: 'No tickets found with the provided booking code and email'
            });
            return;
        }

        // Group tickets by direction (outbound/return)
        const bookingInfo = {
            booking_code: tickets[0].Booking.booking_code,
            booking_time: tickets[0].Booking.booking_time,
            status: tickets[0].Booking.status,
            total_amount: tickets[0].Booking.total_amount,
            customer: {
                first_name: tickets[0].Customer.first_name,
                last_name: tickets[0].Customer.last_name,
                id_card_number: tickets[0].Customer.id_card_number
            },
            tickets: tickets.map(ticket => ({
                ticket_id: ticket.ticket_id,
                status: ticket.status,
                price: ticket.price,
                flight: {
                    flight_number: ticket.Flight.flight_number,
                    departure_time: ticket.Flight.departure_time,
                    arrival_time: ticket.Flight.arrival_time,
                    departure_airport: {
                        name: ticket.Flight.departureAirport.name,
                        city: ticket.Flight.departureAirport.city
                    },
                    destination_airport: {
                        name: ticket.Flight.destinationAirport.name,
                        city: ticket.Flight.destinationAirport.city
                    }
                },
                seat: {
                    seat_number: ticket.Seat.seat_number,
                    seat_class: ticket.Seat.seat_class
                }
            }))
        };

        res.status(200).json({
            success: true,
            data: bookingInfo
        });

    } catch (error) {
        console.error('Error searching ticket:', error);
        next(error);
    }
};

export const cancelTicket = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { ticket_id } = req.params;

        if (!ticket_id) {
            res.status(400).json({
                success: false,
                message: 'Ticket ID is required'
            });
            return;
        }

        const ticket = await Ticket.findByPk(ticket_id);

        if (!ticket) {
            res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
            return;
        }

        if (ticket.status !== 'booked') {
            res.status(400).json({
                success: false,
                message: 'Only booked tickets can be cancelled'
            });
            return;
        }

        // Update ticket status to cancelled
        await ticket.update({ status: 'cancelled' });

        res.status(200).json({
            success: true,
            message: 'Ticket cancelled successfully',
            data: {
                ticket_id: ticket.ticket_id,
                status: ticket.status
            }
        });

    } catch (error) {
        console.error('Error cancelling ticket:', error);
        next(error);
    }
}; 