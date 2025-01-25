import "reflect-metadata";
export function Get(path: string = ""): MethodDecorator {
  /**
   * target 类原型 AppController.prototype
   * properKey 类的属性名【方法名】 index
   * descriptor 方法的描述符【方法属性】
   * */
  return (target: any, properKey: string, descriptor: PropertyDescriptor) => {
    // 给方法添加元数据 path，元数据的名字叫path，值是path【/】
    Reflect.defineMetadata("path", path, descriptor.value);
    Reflect.defineMetadata("method", "GET", descriptor.value);
  };
}
