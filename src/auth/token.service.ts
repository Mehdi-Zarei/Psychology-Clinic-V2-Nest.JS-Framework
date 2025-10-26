import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  createAccessToken(payload: any) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: "30d", //TODO 15m
    });
    return token;
  }

  createRefreshToken(payload: any) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: "30d",
    });
    return token;
  }

  verifyToken(token: any, secret: string | undefined) {
    try {
      return this.jwtService.verify(token, { secret });
    } catch (error) {
      return null;
    }
  }
}
