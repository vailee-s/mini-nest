import {
  Controller,
  Get,
  Req,
  Request,
  Query,
  Headers,
  Session,
  Ip,
  Param,
} from "./@nestjs/common";
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
  @Get("query")
  handleQuery(@Request() request: any, @Query("id") id: string): string {
    console.log("🚀 ~ UserController ~ handleQuery ~ id:", id);
    console.log(request.query);

    return "Hello World!";
  }
  @Get("headers")
  handleHeader(
    @Headers() headers: any,
    @Headers("accept") accept: string
  ): string {
    console.log("🚀 ~ UserController ~ handleQuery ~ accept:", accept);
    console.log("headers", headers);

    return "Hello World!";
  }
  @Get("session")
  handleSession(
    @Session() session: any,
    @Session("pageView") pageView: string
  ): string {
    console.log("🚀 ~ UserController ~ handleQuery ~ accept:", pageView);
    console.log("session", session);
    if (session.pageView) {
      session.pageView++;
    } else {
      session.pageView = 1;
    }

    return "Hello World!" + session.pageView;
  }
  @Get("ip")
  handleIP(@Ip() ip: any): string {
    console.log("🚀 ~ UserController ~ handleQuery ~ ip:", ip);
    return "Hello World!" + ip;
  }
  @Get(":username/info/:age")
  getUseNameInfo(
    @Param() param: any,
    @Param("username") username: string,
    @Param("age") age: number
  ): string {
    console.log("🚀 ~ UserController ~ handleQuery ~ param:", param);
    console.log("🚀 ~ UserController ~ handleQuery ~ username:", username);
    console.log("🚀 ~ UserController ~ handleQuery ~ age:", age);
    return "Hello World!" + username + age;
  }
}
