import { Module } from "@nestjs/common";
import { OtherService } from "./other.servive";

@Module({
  providers: [OtherService],
  exports: [OtherService],
})
export class OtherModule {}
