import "reflect-metadata";
interface ControllerOptions {
  prefix?: string;
  methods?: string[];
}
// 可以给Controller 添加路径前缀
export function Controller(): ClassDecorator;
export function Controller(prefix: string): ClassDecorator;
export function Controller(options: ControllerOptions): ClassDecorator;
export function Controller(
  prefixOrOptions?: string | ControllerOptions
): ClassDecorator {
  let options: ControllerOptions = {};
  if (typeof prefixOrOptions === "string") {
    options.prefix = prefixOrOptions;
  } else {
    options = prefixOrOptions || {};
  }
  // 这是一个类装饰器
  return (target: Function) => {
    // 给类添加元数据 prefix，元数据的名字叫prefix，值是prefixOrOptions【prefix】
    Reflect.defineMetadata("prefix", options.prefix || "", target);
  };
}
