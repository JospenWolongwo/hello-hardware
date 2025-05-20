import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('config')
export class ConfigController {
  private readonly picturesStorageUrl: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.picturesStorageUrl = this.configService.get<string>('AZURE_BLOB_STORAGE_URL');
  }

  @Get()
  getAzureBlobConfig() {
    return {
      azureBlobStorageUrl: this.picturesStorageUrl,
    };
  }
}
