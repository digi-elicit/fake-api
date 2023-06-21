import * as bcrypt from 'bcrypt';

export const bcryptCompare = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
