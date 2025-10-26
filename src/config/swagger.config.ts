import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function swaggerConfigInit(app: INestApplication) {
  const document = new DocumentBuilder()
    .setVersion("1.0.0")
    .setTitle("A website's Back-End For Psychology Clinic. ")
    .setDescription(
      "Welcome to the Psychology Clinic backend! This API powers a full-featured platform where users can book appointments with psychologists, read and write reviews, and consume educational articles. Built with Node.js, Nest.js, Redis, and more – it’s designed for performance, security, and a seamless experience.",
    )

    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        in: "header",
      },
      "accessToken",
    )
    .build();

  const swaggerDocuments = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup("/swagger", app, swaggerDocuments);
}
