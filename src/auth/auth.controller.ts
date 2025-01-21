import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto';
import { LocalAuthGuard } from './local.guard';
import { SessionAuthGuard } from './session.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.authService.register(createUserDto);
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Registration failed');
    }
  }

  @Post('login/local')
  @UseGuards(LocalAuthGuard)
  async localAuth(@Session() session: Record<string, any>, @Req() req) {
    console.log('Session:', req.session); // Log the session details
    console.log('theSession:', session); // Log the session details
    console.log('User:', req.user); // Log the authenticated user
    return 'logged in';
  }

  // logout the session
  @Get('/logout')
  @UseGuards(SessionAuthGuard)
  logout(@Session() session: Record<string, any>, @Res() res): any {
    console.log(session);
    
    session.destroy();
    //res.clearCookie('connect.sid'); // Default cookie name
    res.clearCookie('connect.sid'); // Adjust name if different in your configuration
    return res.status(200).send('Logged out successfully');
    
  }

  @Get('login/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Guard redirects
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request) {
    // For now, we'll just show the user object

    return req.user;
  }

  @Get('login/github')
  @UseGuards(AuthGuard('github'))
  async login() {
    //
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async authCallback(@Req() req) {
    const user = req.user;
    const payload = { sub: user.id, username: user.username };
    return { accessToken: this.jwtService.sign(payload) };
  }

  @Get('login/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req: Request): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      data: req.user,
    };
  }
}
