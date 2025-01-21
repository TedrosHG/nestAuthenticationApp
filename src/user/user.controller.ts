import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SessionAuthGuard } from 'src/auth/session.guard';

@Controller('user')
export class UserController {

    
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Get('protected') //for session
  @UseGuards(SessionAuthGuard)
  async protected(@Req() req) {
    
    return { message: 'This is a protected route', user: req.user };
  }
}
