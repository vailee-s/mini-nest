import { Injectable, Inject } from "@nestjs/common";
import { CommonService } from "./common.service";
@Injectable()
export class OtherService {
  /**
   * Creates an instance of OtherService
   * @param commonService - The injected CommonService instance
   */
  constructor(private commonService: CommonService) {}

  /**
   * Logs a message with the service identifier
   * @param message - The message to be logged
   */
  log(message: string) {
    this.commonService.log("CommonService");
    console.log("OtherService", message);
  }
}
