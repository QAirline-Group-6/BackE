const yup = require('yup');

const createBookingSchema = yup.object({
  customer_id: yup.number().required(),
  user_id: yup.number().required(),
  flight_id: yup.number().required(),
  seat_id: yup.number().required(),
  booking_time: yup.date().required(),
  status: yup.string().oneOf(['confirmed', 'pending', 'cancelled']).required(),
  total_amount: yup.number().required()
});

module.exports = {
  createBookingSchema
};
