import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { RegisterDto, SendOtpDto, VerifyOtpDto } from "./dto/auth.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { RedisService } from "src/redis/redis.service";
import { randomInt } from "node:crypto";
import { SmsService } from "src/sms/sms.service";
import { TokenService } from "./token.service";
import { HashService } from "./bcrypt.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly redisService: RedisService,

    private readonly smsService: SmsService,

    private readonly tokenService: TokenService,

    private readonly hashService: HashService,
  ) {}

  async send(sendOtpDto: SendOtpDto) {
    const { phone } = sendOtpDto;

    const user = await this.userRepository.findOne({ where: { phone } });
    if (user?.isRestrict) {
      throw new ForbiddenException("Your Phone Number Already Baned !!");
    }

    const storedOtp = await this.redisService.getKey(`otp:${phone}`);
    if (storedOtp) {
      throw new BadRequestException(
        "Otp Code Was Already Sended To Your Phone Number.",
      );
    }

    const otpCode = randomInt(10000, 99999);

    await this.redisService.setKey(`otp:${phone}`, otpCode, 120);

    const sms = await this.smsService.sendSms(
      phone,
      process.env.OTP_PATTERN!,
      process.env.OTP_VARIABLE!,
      otpCode,
    );

    if (sms.success) {
      return { message: "Otp Code Sended Successfully." };
    } else {
      throw new InternalServerErrorException(
        "Error sending Otp code! Please try again later.",
      );
    }
  }

  async verify(verifyOtpDto: VerifyOtpDto) {
    const { phone, code } = verifyOtpDto;

    const storedCode = await this.redisService.getKey(`otp:${phone}`);
    if (!storedCode || storedCode !== code) {
      throw new UnauthorizedException(
        "The code entered is incorrect or has expired.",
      );
    }

    const isUserExist = await this.userRepository.findOneBy({ phone });
    if (isUserExist) {
      const accessToken = this.tokenService.createAccessToken({
        id: isUserExist.id,
        role: isUserExist.role,
      });

      const refreshToken = this.tokenService.createRefreshToken({
        id: isUserExist.id,
        role: isUserExist.role,
      });

      const hashedRefreshToken = await this.hashService.hashData(refreshToken);

      await this.redisService.removeKey(`otp:${phone}`);
      await this.redisService.setKey(
        `refreshToken:${isUserExist.id}`,
        hashedRefreshToken,
        2592000,
      );

      return {
        message: "You have successfully logged into your account.",
        accessToken,
        refreshToken,
      };
    } else {
      await this.redisService.removeKey(`otp:${phone}`);
      return {
        status: "NOT_REGISTERED",
        redirect: "/auth/register",
        message:
          "User does not have an account. Redirect to the registration page.",
      };
    }
  }

  async register(registerDto: RegisterDto) {
    const { name, phone, email, password } = registerDto;

    const isUserAlReadyExist = await this.userRepository.findOne({
      where: { phone },
    });

    if (isUserAlReadyExist) {
      if (isUserAlReadyExist.isRestrict) {
        throw new ForbiddenException("This Phone Number Already Banned !!");
      }
      throw new ConflictException("This Phone Number Already Exist !!");
    }

    const hashPassword = await this.hashService.hashData(password);

    const isFirstUser = (await this.userRepository.count()) === 0;
    const newUser = this.userRepository.create({
      name,
      phone,
      email,
      password: hashPassword,
      isRestrict: false,
      role: isFirstUser ? "ADMIN" : "USER",
    });

    await this.userRepository.save(newUser);

    const accessToken = this.tokenService.createAccessToken({
      id: newUser.id,
      role: newUser.role,
    });

    const refreshToken = this.tokenService.createRefreshToken({
      id: newUser.id,
      role: newUser.role,
    });

    const hashedRefreshToken = await this.hashService.hashData(refreshToken);

    await this.redisService.setKey(
      `refreshToken:${newUser.id}`,
      hashedRefreshToken,
      2592000,
    );

    return {
      message: "You have successfully registered.",
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(token: string) {
    const payload = await this.tokenService.verifyToken(
      token,
      process.env.REFRESH_TOKEN_SECRET,
    );

    if (!payload) {
      throw new UnauthorizedException("لطفا وارد حساب کاربری خود شوید.");
    }

    const storedHashedToken = await this.redisService.getKey(
      `refreshToken:${payload.id}`,
    );
    if (!storedHashedToken) {
      throw new UnauthorizedException("لطفا وارد حساب کاربری خود شوید.");
    }

    const compareToken = await this.hashService.compareData(
      token,
      storedHashedToken,
    );
    if (!compareToken) {
      throw new UnauthorizedException("لطفا وارد حساب کاربری خود شوید.");
    }

    const newAccessToken = this.tokenService.createAccessToken({
      id: payload.id,
      role: payload.role,
    });

    return { newAccessToken };
  }

  async logout(userId: number) {
    const remove = await this.redisService.removeKey(`refreshToken:${userId}`);
    if (!remove) {
      throw new UnauthorizedException("You are not logged in!");
    }

    return { message: "You have successfully logged out of your account." };
  }
}
