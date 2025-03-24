import "reflect-metadata";
import express, {
  Express,
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";

import { Logger } from "./logger";
import path from "path";
import { LoggerService, UseValueService } from "../../logger.service";
import { defineModule, DESIGN_PARAMTYPES, INJECTE_TOKENS } from "../common";

export class NestApplication {
  // 在内部私有化一个Express实例
  private readonly app: Express = express();
  // 接收所有的providers
  // private readonly providers = new Map();
  // 去掉之前接收所有的providers，改为接收一个模块，
  // 在此处保存所有的provider的实例key就是token，value就是实例， 存实例
  private readonly providerInstances = new Map();
  private readonly globalProviderInstances = new Set(); // 全局的provider的token集合
  // 记录每个模块中哪些有provider的token,存关系
  private readonly moduleProvider = new Map();

  constructor(protected readonly module) {
    this.app.use(express.json()); //json格式请求体对象放在req.body中
    this.app.use(express.urlencoded({ extended: true })); // form格式请求体对象放在req.body中
    this.app.use((req, res, next) => {
      req.user = { name: "zhangsan", age: 18 };
      next();
    });
  }

  use(middleware: any) {
    this.app.use(middleware);
  }
  async init() {
    // 取出模块的控制器，然后做好路由的映射
    const controllers = Reflect.getMetadata("controllers", this.module) || [];
    Logger.log(`AppModule dependencies initialized`, "InstanceLoader");
    for (const Controller of controllers) {
      // 解析出控制器的依赖
      const dependencies = this.resolveDependencies(Controller);
      // 创建每个控制器的实例
      const controller = new Controller(...dependencies);
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
        const redirectUrlMetadata = Reflect.getMetadata("redirectUrl", method);

        const redirectStatusCodeMetadata = Reflect.getMetadata(
          "redirectStatusCode",
          method
        );
        const statusCodeMetadata = Reflect.getMetadata("statusCode", method);
        const headersMetadata = Reflect.getMetadata("headers", method) ?? [];

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
            if (result?.url) {
              return res.redirect(result.statusCode || 302, result.url);
            }
            // 判断controller里的methodName方法里有没使用@Redirect()， 如果有，则重定向
            if (redirectUrlMetadata) {
              return res.redirect(
                redirectStatusCodeMetadata || 302,
                redirectUrlMetadata
              );
            }
            if (statusCodeMetadata) {
              res.statusCode = statusCodeMetadata;
            } else if (httpMethod === "POST") {
              res.statusCode = 201;
            }

            // 判断controller里的methodName方法里有没使用@Res()， 如果有，则不返回数据需要自己处理返回
            const responseMetadata = this.getRespomseMetadata(
              controller,
              methodName
            );
            if (!responseMetadata || responseMetadata?.data?.passthrough) {
              headersMetadata.forEach(({ name, value }) => {
                res.setHeader(name, value);
              });
              res.send(result);
            }
          }
        );
      }
    }
  }
  private registerProviderFromModule(nestModule: any, ...parentModule) {
    const globalProviders = Reflect.getMetadata("global", nestModule) ?? [];
    const importedProviders =
      Reflect.getMetadata("providers", nestModule) ?? [];
    // 有可能导入的模块只导出了一部分provider，所以需要通过export过滤掉
    const exportedProviders = Reflect.getMetadata("exports", nestModule) ?? [];

    // exportedProviders 可能是一个模块，也可能是一个provider
    exportedProviders.forEach((exportedProvider) => {
      if (this.isModule(exportedProvider)) {
        this.registerProviderFromModule(
          exportedProvider,
          nestModule,
          ...parentModule
        );
      } else {
        const provider = importedProviders.find(
          (importedProvider) =>
            importedProvider === exportedProvider ||
            importedProvider.provide === exportedProvider
        );
        console.log(
          "🚀 ~ NestApplication ~ imports.forEach ~ provider:",
          provider
        );

        if (provider) {
          [module, ...parentModule].forEach((module) => {
            this.addProvider(provider, module, globalProviders);
          });
        }
      }
    });
  }
  private isModule(exportedProvider: any) {
    return (
      exportedProvider &&
      exportedProvider instanceof Function &&
      Reflect.getMetadata("isModule", exportedProvider)
    );
  }
  // provider注册流程
  async initProviders() {
    // 获取模块导入元数据
    const imports = Reflect.getMetadata("imports", this.module) ?? [];
    for (const importModule of imports) {
      let importedModeule = importModule;
      if (importModule instanceof Promise) {
        importedModeule = await importedModeule;
      }

      if ("module" in importedModeule) {
        // 动态模块
        const { module, providers, controllers, exports } = importedModeule;
        // 合并旧的provider和新的provider
        const oldProviders = Reflect.getMetadata("providers", module) ?? [];
        const newProviders = [...oldProviders, ...(providers ?? [])];
        const oldExports = Reflect.getMetadata("exports", module) ?? [];
        const newExports = [...oldExports, ...(exports ?? [])];
        const oldControllers = Reflect.getMetadata("controllers", module) ?? [];
        const newControllers = [...oldControllers, ...(controllers ?? [])];
        defineModule(module, newControllers);
        defineModule(module, newProviders);
        Reflect.defineMetadata("controllers", newControllers, module);
        Reflect.defineMetadata("providers", newProviders, module);
        Reflect.defineMetadata("exports", newExports, module);

        this.registerProviderFromModule(module, this.module);
      } else {
        // 普通模块
        this.registerProviderFromModule(importedModeule, this.module);
      }
    }

    // 获取自身的provider元数据
    const providers = Reflect.getMetadata("providers", this.module) ?? [];
    providers.forEach((provider) => {
      this.addProvider(provider, this.module);
    });

    // const providers = Reflect.getMetadata("providers", this.module) ?? [];
    // providers.forEach((provider) => {
    //   // 如果是useClass，就实例化
    //   if (provider.provide && provider.useClass) {
    //     const dependencies = this.resolveDependencies(provider.useClass);
    //     const classInstance = new provider.useClass(...dependencies);
    //     this.providers.set(provider.provide, classInstance);
    //     return;
    //   } else if (provider.provide && provider.useValue) {
    //     this.providers.set(provider.provide, provider.useValue);
    //   } else if (provider.provide && provider.useFactory) {
    //     const inject = provider.inject ?? [];
    //     this.providers.set(
    //       provider.provide,
    //       provider.useFactory(
    //         ...inject.map((token) => this.getProviderByToken(token))
    //       )
    //     );
    //   } else {
    //     this.providers.set(provider.provide, new provider());
    //   }
    // });
  }
  private addProvider(provider: any, module: any, global = false) {
    // 设置这个module对应的provider的token
    const providers = global
      ? this.globalProviderInstances
      : this.moduleProvider.get(module) ?? new Set();
    if (!this.moduleProvider.has(module)) {
      this.moduleProvider.set(module, providers);
    }
    // 避免重复添加
    // const injectToken = provider.provide ?? provider;
    // if (this.providers.has(injectToken)) {
    //   return;
    // }
    if (provider.provide && provider.useClass) {
      // 实例化
      const Clazz = provider.useClass;
      const dependencies = this.resolveDependencies(Clazz);
      const classInstance = new Clazz(...dependencies);
      this.providerInstances.set(provider.provide, classInstance);
      providers.add(provider.provide);
    } else if (provider.provide && provider.useValue) {
      // 直接赋值
      this.providerInstances.set(provider.provide, provider.useValue);
      providers.add(provider.provide);
    } else if (provider.provide && provider.useFactory) {
      // 工厂函数
      const inject = provider.inject ?? [];
      const injectValue = inject.map((token) =>
        this.getProviderByToken(token, module)
      );
      // 执行工厂函数，获取返回值
      const value = provider.useFactory(...injectValue);
      this.providerInstances.set(provider.provide, value);
      providers.add(provider.provide);
    } else {
      // 普通类
      const dependencies = this.resolveDependencies(provider);
      const value = new provider(...dependencies);
      this.providerInstances.set(provider, value);
      providers.add(provider);
    }
  }
  private resolveDependencies(Controller: any) {
    const injectedTokens =
      Reflect.getMetadata(INJECTE_TOKENS, Controller) ?? [];
    const constructorParams =
      Reflect.getMetadata(DESIGN_PARAMTYPES, Controller) ?? [];

    return constructorParams.map((constructorParam, index) => {
      const module = Reflect.getMetadata("nestModule", Controller);
      // 把每个param中的token换成对应的provider
      return this.getProviderByToken(
        injectedTokens[index] ?? constructorParam,
        module
      );
    });
  }
  private getProviderByToken(injectedToken: any, module: any) {
    // return this.providers.get(injectedToken) ?? injectedToken;
    // 通过token在特定模块下找对应的provider
    if (
      this.moduleProvider.get(module)?.has(injectedToken) ||
      this.globalProviderInstances.has(injectedToken)
    ) {
      return this.providerInstances.get(injectedToken);
    } else {
      return null;
    }
  }
  private getRespomseMetadata(controller: any, methodName: string) {
    const paramsMetaData =
      Reflect.getMetadata("params", controller, methodName) || [];

    // 参数装饰器 existingParams中的data可能是空值，需要过滤掉
    return paramsMetaData.filter(Boolean).find((paramsMetaDataItem) => {
      const { key } = paramsMetaDataItem;
      return key === "Res" || key === "Response" || key === "Next";
    });
  }
  private resolveParams(
    instance: any,
    methodName: string,
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    const paramsMetaData =
      Reflect.getMetadata("params", instance, methodName) ?? [];
    return paramsMetaData.map((paramsMetaDataItem) => {
      const { key, data, factory } = paramsMetaDataItem;
      // 临时实现上下文
      const ctx = {
        switchToHttp: () => {
          return {
            getRequest: () => req,
            getResponse: () => res,
            getNext: () => next,
            getData: () => data,
          };
        },
      };
      switch (key) {
        case "Req":
        case "Request":
          return req;
        case "Query":
          return data ? req.query[data] : req.query;
        case "Headers":
          return data ? req.headers[data] : req.headers;
        case "Session":
          return data ? req.session[data] : req.session;
        case "Ip":
          return req.ip;
        case "Param":
          return data ? req.params[data] : req.params;
        case "Body":
          return data ? req.body[data] : req.body;
        case "Response":
        case "Res":
          return res;
        case "Next":
          return next;
        case "DecoratorFactory":
          return factory(data, ctx);
        default:
          return null;
      }
    });
  }

  async listen(port: number): Promise<void> {
    await this.initProviders();
    await this.init();
    this.app.listen(port, () => {
      Logger.log(
        `Nest application successfully started on port ${port}`,
        "NestApplication"
      );
    });
  }
}
