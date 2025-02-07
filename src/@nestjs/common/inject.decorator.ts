import 'reflect-metadata';

// @Injectable() // 将类标记为可注入的

export function Inject(): ParameterDecorator {
  return (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
  ) => {
    // 获取类的构造函数
    const type = Reflect.getMetadata('design:paramtypes', target, propertyKey)[
      parameterIndex
    ];
    // 将类的构造函数标记为可注入的
    Reflect.defineMetadata('injectable', true, type);
  };
}
