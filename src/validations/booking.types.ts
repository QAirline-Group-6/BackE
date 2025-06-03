const yup = require('yup');

const createBookingSchema = yup.object({
  user_id: yup.number().required(),
  status: yup.string().oneOf(['confirmed', 'pending', 'cancelled']).required(),
  total_amount: yup.number().required()
});

module.exports = {
  createBookingSchema
};
