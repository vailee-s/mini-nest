import { Module } from "@nestjs/common";
import { CommonModule } from "./common.module";

@Module({
  imports: [CommonModule],
  exports: [CommonModule], // 导入的 CommonModule重新导出
})
export class CoreModule {}
