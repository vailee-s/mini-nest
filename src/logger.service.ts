import { Injectable } from "./@nestjs/common";
@Injectable()
export class LoggerService {
  log(message: string) {
    console.log("LoggerService", message);
  }
}

@Injectable()
export class UseValueService {
  log(message: string) {
    console.log("UseValueService", message);
  }
}
