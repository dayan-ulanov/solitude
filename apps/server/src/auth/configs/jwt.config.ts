import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';
import { StringValue } from 'ms';

export default registerAs(
  'jwt',
  (): JwtSignOptions => ({
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN as StringValue,
  }),
);
