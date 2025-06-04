const yup = require('yup');

const createBookingSchema = yup.object({
  user_id: yup.number().required(),
  flight_id: yup.number().required(),
  seat_id: yup.number().required(),
  total_amount: yup.number().required(),
  price: yup.number().required(),
  status: yup.string().oneOf(['confirmed', 'pending', 'cancelled']).required(),
  customer: yup.object({
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    address: yup.string().required(),
    gender: yup.string().oneOf(['male', 'female', 'other']).required(),
    date_of_birth: yup.date().required(),
    id_card_number: yup.string().required()
  }).required()
});

module.exports = {
  createBookingSchema
}; 