import { Module, Global } from '@nestjs/common';
import { EncryptionService } from './services/encryption.service';
import { HttpClientService } from './services/http-client.service';

@Global()
@Module({
  providers: [EncryptionService, HttpClientService],
  exports: [EncryptionService, HttpClientService],
})
export class CommonModule {}
