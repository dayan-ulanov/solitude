import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDocument } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async generateJwtToken(user: UserDocument): Promise<{ accessToken: string }> {
    const payload = { sub: user._id, email: user.email };
    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  async validateUser(email: string, pass: string): Promise<UserDocument> {
    const user = await this.userService.findByEmail(email);
    if (user && user.password) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
