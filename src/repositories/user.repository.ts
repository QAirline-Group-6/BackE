import { User } from '../models/user.model';

export const findAllUsers = async () => {
  return await User.findAll();
};
