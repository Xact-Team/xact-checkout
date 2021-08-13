import { Module } from '@nestjs/common'
import { SdkController } from './sdk.controller';

@Module({
  controllers: [SdkController],
  providers: [],
  exports: [],
})
export class ApiSdkModule {}
