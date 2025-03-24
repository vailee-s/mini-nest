import { Inject, Injectable } from "./@nestjs/common";

@Injectable()
export class AppService {
  constructor(@Inject("CONFIG") private readonly config: any) {}
  getConfig(): string {
    return this.config;
  }
}
