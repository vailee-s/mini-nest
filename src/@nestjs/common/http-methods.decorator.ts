import "reflect-metadata";
export function Get(): MethodDecorator {
  return (target: any, properKey: string, descriptor: PropertyDescriptor) => {};
}
