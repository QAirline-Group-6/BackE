import { findAllUsers } from '../repositories/user.repository';

export const getUsers = async () => {
  return await findAllUsers();
};
