import { NestApplication } from "./nest-application";
import { Logger } from "./logger";
export class NestFactory {
  static async create(module: any) {
    Logger.log("gs-Starting Nest application...", "NestFactory-12");
    const app = new NestApplication(module);
    return app;
  }
}
