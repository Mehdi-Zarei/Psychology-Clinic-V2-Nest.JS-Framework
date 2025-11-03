import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from "class-validator";

export class CreateReviewDto {
  @ApiProperty({
    example: "بسیار جلسه مفیدی بود با تشکر از خانم دکتر ویسی. ",
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 200)
  content: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(5)
  rating: number;
}
