import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string | null => {
          if (request && request.cookies) {
            return (request.cookies['access_token'] as string) || null;
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    };

    super(options);
  }

  validate(payload: JwtPayload) {
    if (!payload.sub) {
      throw new UnauthorizedException();
    }

    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
