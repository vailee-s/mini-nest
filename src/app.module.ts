import { AppController } from "./app.controller";
import { UserController } from "./user.controller";
import { Module } from "./@nestjs/common";
import { LoggerModule } from "./logger.module";
import { CoreModule } from "./core.module";
import { CommonModule } from "./common.module";
import { OtherModule } from "./other.module";

import { DynamicConfigModule } from "./dynamicConfig.module";

import { AppService } from "./app.service";
/**
 * @Injectable 是一个装饰器，用来定义一个类为可注入的
 * 可注入： 可以被依赖注入器实例化的类
 * 依赖注入器： 一个对象，它可以实例化一个类，并将其依赖项注入到该类中

/**
 * @module 是一个装饰器，用来定义一个模块
 * 模块： 组织代码的基本单元，它将相关组件（控制器，服务器，提供者）封装在一起，并定义其依赖关系
 *
 * */
@Module({
  // imports: [LoggerModule, CoreModule],
  imports: [
    CommonModule,
    OtherModule,
    DynamicConfigModule.forRoot({
      name: "zhangsan",
      age: 18,
    }),
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
