import { Injectable, Inject } from "./@nestjs/common";
@Injectable()
export class LoggerService {
  log(message: string) {
    console.log("LoggerService", message);
  }
}

@Injectable()
export class UseValueService {
  constructor(@Inject("SUFFIX") public str: string) {}
  log(message: string) {
    console.log("UseValueService", message, this.str);
  }
}
@Injectable()
export class UseFactoryService {
  constructor(public a: string, public b: string) {}
  log(message: string) {
    console.log("UseFactoryService", message, this.a, this.b);
  }
}
