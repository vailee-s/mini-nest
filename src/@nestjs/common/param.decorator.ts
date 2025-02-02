import "reflect-metadata";

export const createParamDecorator = (keyOrFactory: String | Function) => {
  return (data?: any) =>
    (target: any, propertyKey: string, paramIndex: number) => {
      const existingParams =
        Reflect.getMetadata(`params`, target, propertyKey) || []; // 获取元数据【元数据就是键值对】

      if (keyOrFactory instanceof Function) {
        existingParams[paramIndex] = {
          paramIndex,
          key: "DecoratorFactory",
          factory: keyOrFactory,
          data,
        };
      } else {
        existingParams[paramIndex] = { paramIndex, key: keyOrFactory, data };
      }

      // existingParams.push({ paramIndex, key });
      // existingParams[paramIndex] = key;
      // 给控制器类的原型 propertyKey，也就是handleRequest方法添加元数据【元数据就是键值对】
      // 属性名是 param：handleRequest 值是一个数组，数组的元素是参数的索引【0】
      console.log("---------existingParams", existingParams);

      Reflect.defineMetadata(`params`, existingParams, target, propertyKey);
    };
};

export const Request = createParamDecorator("Request");
export const Req = createParamDecorator("Req");
export const Query = createParamDecorator("Query");
export const Headers = createParamDecorator("Headers");
export const Session = createParamDecorator("Session");
export const Ip = createParamDecorator("Ip");
export const Param = createParamDecorator("Param");
export const Body = createParamDecorator("Body");
export const Response = createParamDecorator("Response");
export const Next = createParamDecorator("Next");
// export const Req = Request;
