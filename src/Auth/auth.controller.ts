import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    const userLog = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    return {
      status: 'success',
      message: 'Login efetuado com sucesso',
      userLog,
    };
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    // Passa o token que vem no corpo da requisição para o service
    const tokens = await this.authService.refreshToken(
      refreshTokenDto.refresh_token,
    );

    return {
      status: 'success',
      message: 'Token atualizado com sucesso',
      ...tokens,
    };
  }
}
