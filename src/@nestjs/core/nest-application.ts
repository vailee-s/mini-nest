import express, { Express } from "express";
import { Logger } from "./logger";

export class NestApplication {
  // 在内部私有化一个Express实例
  private readonly app: Express = express();
  constructor(protected readonly module) {}

  async init() {}
  async listen(port: number): Promise<void> {
    await this.init();
    this.app.listen(port, () => {
      Logger.log(
        `Nest application successfully started on port ${port}`,
        "NestApplication"
      );
    });
  }
}
