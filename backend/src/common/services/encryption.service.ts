import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly ivLength = 16;
  private readonly saltLength = 64;
  private readonly tagLength = 16;
  private readonly encryptionKey: Buffer;

  constructor(private configService: ConfigService) {
    const key = this.configService.get<string>('ENCRYPTION_KEY');
    if (!key || key.length < 32) {
      throw new Error('ENCRYPTION_KEY must be at least 32 characters long');
    }
    this.encryptionKey = crypto.scryptSync(key, 'salt', this.keyLength);
  }

  /**
   * Encrypts a plain text string
   * @param plainText - The text to encrypt
   * @returns Encrypted string in format: iv:encrypted:authTag
   */
  encrypt(plainText: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, this.encryptionKey, iv);

    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
  }

  /**
   * Decrypts an encrypted string
   * @param encryptedText - The encrypted text in format: iv:encrypted:authTag
   * @returns Decrypted plain text
   */
  decrypt(encryptedText: string): string {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted text format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const authTag = Buffer.from(parts[2], 'hex');

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.encryptionKey,
      iv,
    );
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Encrypts a JSON object
   * @param data - Object to encrypt
   * @returns Encrypted string
   */
  encryptObject(data: Record<string, any>): string {
    return this.encrypt(JSON.stringify(data));
  }

  /**
   * Decrypts and parses JSON object
   * @param encryptedText - Encrypted JSON string
   * @returns Parsed object
   */
  decryptObject<T = Record<string, any>>(encryptedText: string): T {
    const decrypted = this.decrypt(encryptedText);
    return JSON.parse(decrypted) as T;
  }

  /**
   * Hashes a password using bcrypt-like approach
   * @param password - Plain password
   * @returns Hashed password
   */
  hashPassword(password: string): string {
    const salt = crypto.randomBytes(this.saltLength).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
      .toString('hex');
    return `${salt}:${hash}`;
  }

  /**
   * Verifies a password against a hash
   * @param password - Plain password
   * @param hashedPassword - Hashed password
   * @returns true if password matches
   */
  verifyPassword(password: string, hashedPassword: string): boolean {
    const [salt, originalHash] = hashedPassword.split(':');
    const hash = crypto
      .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
      .toString('hex');
    return hash === originalHash;
  }
}
