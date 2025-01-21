// 创建nestjs应用实例
import { NestFactory } from "./@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // 使用NestFactory.create() 创建应用实例,并传入AppModule
  await app.listen(3000);
}
bootstrap();
