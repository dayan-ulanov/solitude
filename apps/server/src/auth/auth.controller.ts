import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { Public } from './decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User, UserDocument } from 'src/user/user.schema';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

interface GoogleRequest extends Request {
  user: {
    googleId: string;
    email: string;
    name: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleAuth(@Req() _req: Request) {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: GoogleRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const googleUser: Partial<User> = req.user;

    const user = (await this.userService.findOrCreateGoogleUser(
      googleUser,
    )) as UserDocument;

    const { accessToken } = await this.authService.generateJwtToken(user);

    const cookieMaxAge = 60 * 60 * 1000;

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: cookieMaxAge,
    });

    return res.redirect(process.env.CLIENT_URL || 'http://localhost:3000');
  }

  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.userService.createLocalUser(body);
  }

  @Public()
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    const { accessToken } = await this.authService.generateJwtToken(user);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    return { message: 'Logged in successfully' };
  }
}
