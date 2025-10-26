import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto, SendOtpDto, VerifyOtpDto } from "./dto/auth.dto";
import { ApiBearerAuth, ApiConsumes, ApiOperation } from "@nestjs/swagger";
import { SwaggerConsumes } from "src/common/enums/SwaggerConsumes.enum";
import { Request } from "express";
import { CustomAuthGuard } from "src/common/guards/auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Send Otp Code" })
  @ApiConsumes(SwaggerConsumes.FORM)
  @Post("send")
  send(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.send(sendOtpDto);
  }

  @ApiOperation({ summary: "Verify Otp Code" })
  @ApiConsumes(SwaggerConsumes.FORM)
  @Post("verify")
  verify(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verify(verifyOtpDto);
  }

  @ApiOperation({ summary: "Register User" })
  @ApiConsumes(SwaggerConsumes.FORM)
  @Post("register")
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({
    summary: "Get New AccessToken",
    description:
      "In this route, the refresh token must be sent via cookies, not in the headers. The cookie named refreshToken is stored as HttpOnly in the browser and must be included with the request.",
  })
  @Get("refresh-accessToken")
  refreshAccessToken(@Req() req: Request) {
    const token = req.cookies?.refreshToken;
    if (!token) {
      throw new UnauthorizedException("لطفا وارد حساب کاربری خود شوید.");
    }
    return this.authService.refreshAccessToken(token);
  }

  @ApiOperation({ summary: "Logout" })
  @ApiBearerAuth("accessToken")
  @UseGuards(CustomAuthGuard)
  @Post("/logout")
  logout(@Req() req: Request) {
    const userId = req.user?.id;
    return this.authService.logout(userId!);
  }
}
