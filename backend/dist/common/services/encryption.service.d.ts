import { ConfigService } from '@nestjs/config';
export declare class EncryptionService {
    private configService;
    private readonly algorithm;
    private readonly keyLength;
    private readonly ivLength;
    private readonly saltLength;
    private readonly tagLength;
    private readonly encryptionKey;
    constructor(configService: ConfigService);
    encrypt(plainText: string): string;
    decrypt(encryptedText: string): string;
    encryptObject(data: Record<string, any>): string;
    decryptObject<T = Record<string, any>>(encryptedText: string): T;
    hashPassword(password: string): string;
    verifyPassword(password: string, hashedPassword: string): boolean;
}
