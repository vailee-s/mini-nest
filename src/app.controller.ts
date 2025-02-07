import { Controller, Get } from './@nestjs/common';
import { LoggerService } from './logger.service';

/**
 * @Controller 也是一个装饰器，用于定义控制器
 * 控制器是处理传入HTTP请求的核心组件，每个控制器负责处理特定的请求路径和对应的http方法
 *  在控制器内部会使用路由装饰器@Get @Post @Put @Delete等来定义路由和请求方法
 * */

@Controller()
export class AppController {
  constructor(private loggerService: LoggerService) {}
  @Get()
  getHello(): string {
    this.loggerService.log('hello world');
    return 'Hello World!';
  }
}
