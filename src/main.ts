import * as dotenv from "dotenv";
dotenv.config();
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import { join } from "path";
import { swaggerConfigInit } from "./config/swagger.config";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useStaticAssets(join(__dirname, "..", "public"));
  app.use(cookieParser());
  swaggerConfigInit(app);

  const { PORT } = process.env;
  await app.listen(PORT ?? 4000, () => {
    console.log(`🚀 Server is up and running at localhost:${PORT ?? 4000}`);
    console.log(`🚀 Swagger Documents: http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
