import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth/login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
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
}
