import * as yup from 'yup';
import { isValidDDMMYYYY } from '../utils/dateUtils';

export const createBookingSchema = yup.object({
  booking_code: yup.string().required(),
  user_id: yup.number().required(),
  total_amount: yup.number().required(),
  status: yup.string().oneOf(['confirmed', 'pending', 'cancelled']).default('confirmed'),
  bookings: yup.array().of(
    yup.object({
      flight_id: yup.number().required(),
      tickets: yup.array().of(
        yup.object({
          seat_id: yup.number().required(),
          price: yup.number().required(),
          customer: yup.object({
            first_name: yup.string().required(),
            last_name: yup.string().required(),
            address: yup.string().required(),
            gender: yup.string().oneOf(['male', 'female', 'other']).required(),
            date_of_birth: yup.string()
              .required()
              .test('is-valid-date', 'Ngày sinh phải có định dạng dd-MM-yyyy', value =>
                isValidDDMMYYYY(value)
              ),
            id_card_number: yup.string().required()
          }).required()
        })
      ).min(1, 'Mỗi chuyến bay cần ít nhất một vé')
    })
  ).min(1, 'Cần ít nhất một chuyến bay để đặt')
});

export default createBookingSchema;