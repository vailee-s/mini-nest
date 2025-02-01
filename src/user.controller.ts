import {
  Controller,
  Get,
  Post,
  Redirect,
  Req,
  Request,
  Query,
  Headers,
  Session,
  Ip,
  Param,
  Body,
  Response,
  Next,
} from "./@nestjs/common";
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";

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
  @Get("star/ab*de")
  handleWildcard(): string {
    return "Hello World!";
  }
  @Post("create")
  createUser(
    @Body() createUserDto,
    @Body("username") username: string
  ): string {
    console.log("create", createUserDto, username);

    return "Hello World!";
  }
  @Post("response")
  response(@Response() response: ExpressResponse): string {
    console.log("create", response);
    return "Hello World!";
  }
  @Post("passthrough")
  passthrough(
    @Response({ passthrough: true }) response: ExpressResponse
  ): string {
    // 只想在响应头中添加一个自定义的响应头，不影响框架的正常使用
    response.setHeader("X-Custom-Header", "Hello World");
    console.log("create", response);
    return "Hello World!";
  }
  @Get("next")
  next(@Next() next: Function) {
    console.log("next");
    next();
  }
  @Get("/redirect")
  @Redirect("/user/req", 301)
  handleRedirect() {
    // return "Hello World!";
  }
  @Get("/redirect2")
  @Redirect("/user/req", 301)
  handleRedirect2(@Query("id") id: string) {
    return {
      url: `/user/req?id=${id}`,
      statusCode: 301,
      headers: {
        id,
      },
    };
  }
}
