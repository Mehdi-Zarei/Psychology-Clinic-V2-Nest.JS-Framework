import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { BulkSmsService } from "./bulk-sms.service";
import { SendBulkSmsDto } from "./dto/create-bulk-sm.dto";
import { ApiBearerAuth, ApiConsumes } from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { CustomAuthGuard } from "src/common/guards/auth.guard";
import { SwaggerConsumes } from "src/common/enums/SwaggerConsumes.enum";

@Controller("bulk-sms")
export class BulkSmsController {
  constructor(private readonly bulkSmsService: BulkSmsService) {}

  @ApiBearerAuth("accessToken")
  @ApiConsumes(SwaggerConsumes.JSON)
  @UseGuards(CustomAuthGuard)
  @Roles("ADMIN")
  @Post("send")
  sendBulk(@Body() dto: SendBulkSmsDto) {
    return this.bulkSmsService.sendMultiSMS(dto);
  }
}
