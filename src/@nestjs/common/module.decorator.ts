import "reflect-metadata";
interface ModuleMetadata {
  controllers?: Function[];
  providers?: any[];
  exports?: any[];
  imports?: any[]; // 别人导出的provider给自己用
}
// 定义模块装饰器
export function Module(metadata: ModuleMetadata): ClassDecorator {
  return (target: Function) => {
    // 当一个类被@Module装饰时，会给这个类添加一个元数据，元数据的名字叫isModule，值是true
    Reflect.defineMetadata("isModule", true, target);
    // 给模块类添加元数据 AppModule ,元数据的名字叫controllers，值是controllers数组【AppController】
    Reflect.defineMetadata("controllers", metadata.controllers, target);
    Reflect.defineMetadata("providers", metadata.providers, target);
    Reflect.defineMetadata("exports", metadata.exports, target);
    Reflect.defineMetadata("imports", metadata.imports, target);
  };
}
