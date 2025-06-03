import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginDto, CreateUserDto, UpdateProfileDto } from './user.dto';
import { Request, Response } from 'express';
import { TokenService } from 'src/shared/modules/token/token.service';
import { UserService } from './user.service';
import { User } from 'src/shared/decorators/user.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@Controller()
export class UserController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  async signup(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.createUser(dto);

    const access_token = this.tokenService.createAccessToken(
      user.email,
      user.id,
    );
    const refresh_token = this.tokenService.createRefreshToken(
      user.email,
      user.id,
    );

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none', // change to 'strict' on production
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none', // change to 'strict' on production
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    user.refresh_token = refresh_token;
    const result = await this.userService.saveUser(user);
    result.password = '';

    return result;
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.loginUser(dto);

    const access_token = this.tokenService.createAccessToken(
      user.email,
      user.id,
    );
    const refresh_token = this.tokenService.createRefreshToken(
      user.email,
      user.id,
    );

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none', // change to 'strict' on production
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none', // change to 'strict' on production
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    user.refresh_token = refresh_token;
    const result = await this.userService.saveUser(user);
    result.password = '';

    return result;
  }

  @Get('access_token')
  async newAccessToken(
    @Req() req: Request,
    @Query('refresh_token') refresh_token: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!refresh_token) {
      refresh_token = req.cookies['refresh_token'];
    }
    if (!refresh_token) {
      throw new BadRequestException('refresh_token is required');
    }

    const { result, error } = this.tokenService.validateToken(refresh_token);
    if (error) {
      throw new BadRequestException('refresh_token failed');
    }

    const user = await this.userService.getUserByEmail(result.email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const access_token = this.tokenService.createAccessToken(
      user.email,
      user.id,
    );
    const new_refresh_token = this.tokenService.createRefreshToken(
      user.email,
      user.id,
    );

    user.refresh_token = new_refresh_token;
    await this.userService.saveUser(user);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none', // change to 'strict' on production
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.cookie('refresh_token', new_refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none', // change to 'strict' on production
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return { access_token, refresh_token: new_refresh_token };
  }

  @UseGuards(new AuthGuard())
  @Get('profile')
  async GetProfile(@User('email') email: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    user.password = '';
    return user;
  }

  @UseGuards(new AuthGuard())
  @Patch('profile')
  async updateProfile(
    @User('email') email: string,
    @Body() body: UpdateProfileDto,
  ) {
    const result = await this.userService.updateUserProfile(email, body);
    result.password = '';
    return result;
  }

  @UseGuards(new AuthGuard())
  @Post('logout')
  @HttpCode(200)
  async logout(
    @User('email') email: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    user.refresh_token = '';
    this.userService.saveUser(user);
    res.cookie('access_token', '', {
      maxAge: -1,
    });
    res.cookie('refresh_token', '', {
      maxAge: -1,
    });
    return { result: 'Success' };
  }
}
