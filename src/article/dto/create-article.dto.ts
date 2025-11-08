import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class CreateArticleDto {
  @IsString()
  @Length(5, 50)
  @IsNotEmpty()
  @ApiProperty({ example: "راهکار های مقابله با افسردگی", type: "string" })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "ورزش کردن مداوم یکی از راهکار های مقابله با افسردگی است.",
    type: "string",
  })
  content: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "ورزش کردن مداوم یکی از راهکار های مقابله با افسردگی است.",
    type: "string",
  })
  summary: string;

  @ApiProperty({
    example: ["روانشناسی", "افسردگی"],
    type: "array",
  })
  @IsArray()
  @Transform(({ value }) =>
    typeof value === "string" ? value.split(",") : value,
  )
  tags: string[];

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    type: [String],
    items: { type: "string", format: "binary" },
    required: false,
  })
  @Transform(({ value }) => {
    if (typeof value === "string") {
      return value
        .replace(/[{}]/g, "")
        .split(",")
        .map((item) => item.trim());
    }
    return value;
  })
  images?: string[];

  @ApiProperty({ type: "boolean", default: false })
  @IsBoolean()
  @Transform(({ value }) => value === "true" || value === true)
  isPublished: boolean;

  @ApiProperty({
    type: "number",
    example: 10,
    description: "مدت زمان مطالعه بر حسب دقیقه",
  })
  @IsNumber()
  @Transform(({ value }) => (typeof value === "string" ? Number(value) : value))
  readingTime: number;

  @ApiProperty({ type: "string", example: "راهکار های مقابله با افسردگی" })
  @IsString()
  @Length(5, 60)
  seoTitle: string;

  @IsString()
  @Length(5, 160)
  @ApiProperty({
    type: "string",
    example: "تاثیر ورزش و فعالیت بندی مداوم در مقابله و درمان افسردگی",
  })
  seoDescription: string;
}
