import { NestMiddleware } from './middleware.interface';
import { RequestMethod } from './request.method.enum';

export interface MiddlewareConsumer {
  apply(...middleware): MiddlewareConsumer;
  forRoutes(...routes: (string | RouteInfo)[]): MiddlewareConsumer;
}
export interface RouteInfo {
  path: string;
  method: RequestMethod;
}

export interface MiddlewareFunction {
  resolve(...args: any[]): void;
}
