import { Injectable, Inject } from "./@nestjs/common";
import { CommonService } from "./common.service";
@Injectable()
export class OtherService {
  constructor(private commonService: CommonService) {}

  log(message: string) {
    this.commonService.log("CommonService");
    console.log("OtherService", message);
  }
}
