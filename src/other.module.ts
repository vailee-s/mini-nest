import { Module, Global } from "./@nestjs/common";
import { OtherService } from "./other.service";
import { CommonModule } from "./common.module";
@Global()
@Module({
  providers: [OtherService],
  exports: [OtherService],
})
export class OtherModule {}
