import { Module } from "@nestjs/common";
import {
  LoggerClassService,
  LoggerService,
  UseFactoryService,
  UseValueService,
} from "./logger.service";

@Module({
  providers: [
    {
      provide: "SUFFIX",
      useValue: "Hello World!!",
    },
    LoggerClassService, // 等价于useClass
    {
      provide: LoggerService,
      useClass: LoggerService,
    },
    {
      provide: "String_Token",
      useValue: new UseValueService("prefix"),
    },
    {
      provide: "Factory_Token",
      // inject: ["Factory_Token1", "SUFFIX"],
      useFactory: (a, b) => {
        return new UseFactoryService(a, b);
      },
    },
  ],
  // exports是providers的子集，它定义了哪些provider可以被其他模块使用
  exports: ["SUFFIX", LoggerService, "String_Token", "Factory_Token"],
})
export class LoggerModule {}
