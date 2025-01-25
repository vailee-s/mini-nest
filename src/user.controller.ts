import { Controller, Get, Req, Request } from "./@nestjs/common";
import { Request as ExpressRequest } from "express";

/**
 * @Controller 也是一个装饰器，用于定义控制器
 * 控制器是处理传入HTTP请求的核心组件，每个控制器负责处理特定的请求路径和对应的http方法
 *  在控制器内部会使用路由装饰器@Get @Post @Put @Delete等来定义路由和请求方法
 * */

@Controller("user")
export class UserController {
  @Get("req")
  handleRequest(
    @Req() req: ExpressRequest,
    age: number,
    @Request() request: ExpressRequest
  ): string {
    console.log(req.url);
    console.log("age", age);
    console.log(req.path);

    return "Hello World!";
  }
}
