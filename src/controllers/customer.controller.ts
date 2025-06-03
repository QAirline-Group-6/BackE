import { Request, Response } from 'express';
import { Customer } from '../models/customer.model';
import { Booking } from '../models/booking.model';
import { Flight } from '../models/flight.model';
import { Seat } from '../models/seat.model';

// Tạo customer
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json({ message: 'Customer created successfully', customer });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Lấy tất cả customer
export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await Customer.findAll();
    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Lấy customer theo ID
export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Cập nhật
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await Customer.update(req.body, {
      where: { customer_id: id },
    });

    if (updated === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const updatedCustomer = await Customer.findByPk(id);
    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Xóa customer
export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Customer.destroy({ where: { customer_id: id } });

    if (deleted === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Lấy lịch sử booking của Customers
// exports.getCustomerBookings = async (req: Request, res: Response) => {
//   try {
//     const customerId = req.params.id;

//     const customer = await Customer.findByPk(customerId);
//     if (!customer) {
//       return res.status(404).json({ message: 'Customer not found' });
//     }

//     const bookings = await Booking.findAll({
//       where: { customer_id: customerId },
//       include: [
//         {
//           model: Flight,
//           attributes: ['flight_id', 'departure', 'destination', 'departure_time', 'arrival_time']
//         },
//         {
//           model: Seat,
//           attributes: ['seat_number', 'seat_class']
//         }
//       ],
//       order: [['booking_time', 'DESC']]
//     });

//     res.json({
//       customer_id: customer.customer_id,
//       full_name: `${customer.last_name} ${customer.first_name}`,
//       bookings
//     });

//   } catch (error) {
//     console.error('Error fetching bookings:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };