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
export function Post(path: string = ""): MethodDecorator {
  /**
   * target 类原型 AppController.prototype
   * properKey 类的属性名【方法名】 index
   * descriptor 方法的描述符【方法属性】
   * */
  return (target: any, properKey: string, descriptor: PropertyDescriptor) => {
    // 给方法添加元数据 path，元数据的名字叫path，值是path【/】
    Reflect.defineMetadata("path", path, descriptor.value);
    Reflect.defineMetadata("method", "POST", descriptor.value);
  };
}
export function Redirect(
  url: string = "",
  statusCode: number = 302
): MethodDecorator {
  /**
   * target 类原型 AppController.prototype
   * properKey 类的属性名【方法名】 index
   * descriptor 方法的描述符【方法属性】
   * */
  return (target: any, properKey: string, descriptor: PropertyDescriptor) => {
    // 给方法添加元数据 path，元数据的名字叫path，值是path【/】
    Reflect.defineMetadata("redirectUrl", url, descriptor.value);
    Reflect.defineMetadata("redirectStatusCode", statusCode, descriptor.value);
  };
}
export function HttpCode(statusCode: number = 302): MethodDecorator {
  /**
   * target 类原型 AppController.prototype
   * properKey 类的属性名【方法名】 index
   * descriptor 方法的描述符【方法属性】
   * */
  return (target: any, properKey: string, descriptor: PropertyDescriptor) => {
    // 给方法添加元数据 path，元数据的名字叫path，值是path【/】
    Reflect.defineMetadata("statusCode", statusCode, descriptor.value);
  };
}
export function Header(name: string, value: string): MethodDecorator {
  /**
   * target 类原型 AppController.prototype
   * properKey 类的属性名【方法名】 index
   * descriptor 方法的描述符【方法属性】
   * */
  return (target: any, properKey: string, descriptor: PropertyDescriptor) => {
    const existingHeaders =
      Reflect.getMetadata(`headers`, descriptor.value) ?? [];
    existingHeaders.push({ name, value });
    Reflect.defineMetadata("headers", existingHeaders, descriptor.value);
  };
}
