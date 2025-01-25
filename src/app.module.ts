import { AppController } from "./app.controller";
import { UserController } from "./user.controller";
import { Module } from "./@nestjs/common";

/**
 * @module 是一个装饰器，用来定义一个模块
 * 模块： 组织代码的基本单元，它将相关组件（控制器，服务器，提供者）封装在一起，并定义其依赖关系
 *
 * */
@Module({
  // imports: [],
  controllers: [AppController, UserController],
  // providers: [],
})
export class AppModule {}
