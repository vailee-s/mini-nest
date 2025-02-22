import "reflect-metadata";
import { INJECTE_TOKENS } from "./constants";

// @Injectable() // 将类标记为可注入的

export function Inject(token: string): ParameterDecorator {
  return (
    target: Object, // 原型
    propertyKey: string | symbol, // 方法名
    parameterIndex: number // 参数索引
  ) => {
    // 获取类的构造函数
    const existingInjectedTokens =
      Reflect.getMetadata(INJECTE_TOKENS, target) ?? [];
    existingInjectedTokens[parameterIndex] = token;
    // 将类的构造函数标记为可注入的
    Reflect.defineMetadata(INJECTE_TOKENS, existingInjectedTokens, target);
  };
}
