import { Request, Response } from 'express';
import db from '../models';
import { Sequelize, Op } from 'sequelize';

const Flight = db.Flight;

export const getAllFlights = async (req: Request, res: Response): Promise<void> => {
  try {
    const flights = await Flight.findAll({
      include: [
        { model: db.Airport, as: 'departureAirport', attributes: ['airport_id', 'name', 'code'] },
        { model: db.Airport, as: 'destinationAirport', attributes: ['airport_id', 'name', 'code'] }
      ]
    });
    res.json(flights);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getPopularFlights = async (req: Request, res: Response): Promise<void> => {
  try {
    const flights = await Flight.findAll({
      include: [
        { model: db.Airport, as: 'departureAirport', attributes: ['airport_id', 'name', 'code'] },
        { model: db.Airport, as: 'destinationAirport', attributes: ['airport_id', 'name', 'code'] }
      ],
      order: [['bookings', 'DESC']],
      limit: 5
    });
    res.json(flights);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getFlightById = async (req: Request, res: Response): Promise<void> => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) {
      res.status(404).json({ message: 'Không tìm thấy chuyến bay.' });
      return;
    }
    res.json(flight);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createFlight = async (req: Request, res: Response): Promise<void> => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json(flight);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateFlight = async (req: Request, res: Response): Promise<void> => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) {
      res.status(404).json({ message: 'Không tìm thấy chuyến bay.' });
      return;
    }

    await flight.update(req.body);
    res.json(flight);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteFlight = async (req: Request, res: Response): Promise<void> => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) {
      res.status(404).json({ message: 'Không tìm thấy chuyến bay.' });
      return;
    }

    await flight.destroy();
    res.status(204).end();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const searchFlightsByDes = async (req: Request, res: Response): Promise<void> => {
  try {
    const from = req.query.from as string;
    const to = req.query.to as string;
    const departureDate = req.query.departureDate as string;

    // Validate required parameters
    if (!from || !to || !departureDate) {
      res.status(400).json({
        message: 'Thiếu thông tin điểm đi, điểm đến hoặc ngày đi',
        required: 'from, to, departureDate (format: YYYY-MM-DD)'
      });
      return;
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(departureDate)) {
      res.status(400).json({
        message: 'Định dạng ngày không hợp lệ. Sử dụng YYYY-MM-DD',
        example: '2025-06-11'
      });
      return;
    }

    // Validate airport IDs
    const fromId = parseInt(from);
    const toId = parseInt(to);

    if (isNaN(fromId) || isNaN(toId)) {
      res.status(400).json({
        message: 'ID sân bay không hợp lệ'
      });
      return;
    }

    // Create date range for the entire day
    const startDateTime = `${departureDate} 00:00:00`;
    const endDateTime = `${departureDate} 23:59:59`;

    let whereConditions: any = {
      departure_airport_id: fromId,
      destination_airport_id: toId,
      departure_time: {
        [Op.between]: [startDateTime, endDateTime]
      },
      status: 'scheduled' // Chỉ lấy chuyến bay đang được lên lịch
    };

    const flights = await Flight.findAll({
      include: [
        { model: db.Airport, as: 'departureAirport', attributes: ['airport_id', 'name', 'code'] },
        { model: db.Airport, as: 'destinationAirport', attributes: ['airport_id', 'name', 'code'] }
      ],
      where: whereConditions,
      order: [['departure_time', 'ASC']], // Sắp xếp theo giờ khởi hành
      attributes: [
        'flight_id',
        'flight_number',
        'departure_time',
        'arrival_time',
        'available_seats',
        'status',
        'price_economy',
        'price_business',
        'departure_airport_id',
        'destination_airport_id'
      ]
    });

    // Format response
    const formattedFlights = flights.map((flight: any) => ({
        flight_id: flight.flight_id,
        flight_number: flight.flight_number,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        available_seats: flight.available_seats,
        status: flight.status,
        prices: {
          economy: flight.price_economy,
          business: flight.price_business
        },
        route: {
          from: {
            id: flight.departure_airport_id,
            name: flight.departureAirport?.name,
            code: flight.departureAirport?.code
          },
        to: {
            id: flight.destination_airport_id,
            name: flight.destinationAirport?.name,
            code: flight.destinationAirport?.code
    }
  }
}));

    res.status(200).json({
      success: true,
      count: formattedFlights.length,
      searchCriteria: {
        from: fromId,
        to: toId,
        departureDate: departureDate
      },
      flights: formattedFlights
    });

  } catch (error: any) {
    console.error('Error searching flights:', error);
    res.status(500).json({
      message: 'Lỗi máy chủ',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Alternative method using Sequelize's date functions
export const searchFlightsByDesAlternative = async (req: Request, res: Response): Promise<void> => {
  try {
    const from = req.query.from as string;
    const to = req.query.to as string;
    const departureDate = req.query.departureDate as string;

    if (!from || !to || !departureDate) {
      res.status(400).json({ message: 'Thiếu thông tin cần thiết' });
      return;
    }

    // Sử dụng Sequelize.fn để so sánh chỉ phần DATE
    const flights = await Flight.findAll({
      include: [
        { model: db.Airport, as: 'departureAirport', attributes: ['airport_id', 'name', 'code'] },
        { model: db.Airport, as: 'destinationAirport', attributes: ['airport_id', 'name', 'code'] }
      ],
      where: {
        departure_airport_id: parseInt(from),
        destination_airport_id: parseInt(to),
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn('DATE', Sequelize.col('departure_time')),
            departureDate
          )
        ],
        status: 'scheduled'
      },
      order: [['departure_time', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: flights.length,
      flights: flights
    });

  } catch (error: any) {
    console.error('Error searching flights (alternative):', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const searchFlightsByPrice = async (req: Request, res: Response): Promise<void> => {
  try {
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;

    if ((minPrice && isNaN(minPrice)) || (maxPrice && isNaN(maxPrice))) {
      res.status(400).json({ message: 'Giá trị không hợp lệ' });
      return;
    }

    const whereClause: any = {
      status: 'scheduled' // Thêm điều kiện status
    };

    if (minPrice !== undefined && maxPrice !== undefined) {
      whereClause.price_economy = { [Op.between]: [minPrice, maxPrice] };
    } else if (minPrice !== undefined) {
      whereClause.price_economy = { [Op.gte]: minPrice };
    } else if (maxPrice !== undefined) {
      whereClause.price_economy = { [Op.lte]: maxPrice };
    }

    const flights = await Flight.findAll({
      where: whereClause,
      order: [['price_economy', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: flights.length,
      priceRange: {
        min: minPrice,
        max: maxPrice
      },
      flights: flights
    });
  } catch (error: any) {
    console.error('Lỗi tìm chuyến bay theo giá:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};