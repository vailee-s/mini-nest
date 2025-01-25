import "reflect-metadata";
import express, {
  Express,
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";

import { Logger } from "./logger";
import path from "path";

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
      // 遍历类的原型上的方法名
      const controllerPrototype = Controller.prototype;
      for (const methodName of Object.getOwnPropertyNames(
        controllerPrototype
      )) {
        // 获取原型上的方法 index
        const method = controllerPrototype[methodName];
        // 获取方法名
        const httpMethod = Reflect.getMetadata("method", method);
        // 取得此函数上绑定的路径的元数据
        const pathMetadata = Reflect.getMetadata("path", method);

        if (!httpMethod) continue;
        // 拼接路径
        const routePath = path.posix.join("/", prefix, pathMetadata);
        // 配置路由 当客户端以httpMethod请求routePath时，执行此函数
        this.app[httpMethod.toLowerCase()](
          routePath,
          (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
            const args = this.resolveParams(
              controller,
              methodName,
              req,
              res,
              next
            );
            const result = method.call(controller, ...args);
            res.send(result);
          }
        );
        // console.log(
        //   "🚀 ~ NestApplication ~ init ~ metadata:",
        //   metadata,
        //   methodName
        // );
      }
    }
  }
  private resolveParams(
    instance: any,
    methodName: string,
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    const paramsMetaData = Reflect.getMetadata("params", instance, methodName);
    console.log("🚀 ~ NestApplication ~ paramsMetaData:", paramsMetaData);
    return paramsMetaData.map((paramsMetaDataItem) => {
      const { key } = paramsMetaDataItem;

      switch (key) {
        case "Req":
        case "Request":
          return req;

        default:
          return null;
      }
    });
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
