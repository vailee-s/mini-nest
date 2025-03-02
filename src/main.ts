// 创建nestjs应用实例
import { NestFactory } from "./@nestjs/core";
import { AppModule } from "./app.module";
import session from "express-session";

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // 使用NestFactory.create() 创建应用实例,并传入AppModule
  app.use(
    session({
      secret: "keyboard-cat",
      resave: false, // 在每次请求结束后是否强制保存会话，即使它没有改变
      saveUninitialized: true, // 是否在未初始化（即未设置任何会话属性）的会话上保存会话
      cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
    })
  );
  await app.listen(3000);
}
bootstrap();
