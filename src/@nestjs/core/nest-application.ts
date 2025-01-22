import "reflect-metadata";
import express, { Express } from "express";

import { Logger } from "./logger";

export class NestApplication {
  // 在内部私有化一个Express实例
  private readonly app: Express = express();
  constructor(protected readonly module) {}

  async init() {
    // 取出模块的控制器，然后做好路由的映射
    const controllers = Reflect.getMetadata("controllers", this.module) || [];
    // console.log("🚀 ~ NestApplication ~ init ~ controllers:", controllers);
    Logger.log(`AppModule dependencies initialized`, "InstanceLoader");
    for (const Controller of controllers) {
      // 创建每个控制器的实例
      const controller = new Controller();
      // 获取控制器的路径前缀
      const prefix = Reflect.getMetadata("prefix", Controller) || "/";
      Logger.log(`${Controller.name} {${prefix}}`, "RoutesResolver");
    }
  }
  async listen(port: number): Promise<void> {
    await this.init();
    this.app.listen(port, () => {
      Logger.log(
        `Nest application successfully started on port ${port}`,
        "NestApplication"
      );
    });
  }
}
