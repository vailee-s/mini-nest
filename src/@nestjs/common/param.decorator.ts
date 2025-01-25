import "reflect-metadata";

export const createParamDecorator = (key: String) => {
  return () => (target: any, propertyKey: string, paramIndex: number) => {
    const existingParams =
      Reflect.getMetadata(`params`, target, propertyKey) || []; // 获取元数据【元数据就是键值对】
    existingParams[paramIndex] = { paramIndex, key };
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
// export const Req = Request;
