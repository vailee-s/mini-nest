import { Injectable } from './@nestjs/common';
@Injectable()
export class LoggerService {
  log(message: string) {
    console.log(message);
  }
}

@Injectable()
export class UseValueService {
  log(message: string) {
    console.log(message);
  }
}
