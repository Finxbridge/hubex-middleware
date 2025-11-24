"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto = require("crypto");
let EncryptionService = class EncryptionService {
    constructor(configService) {
        this.configService = configService;
        this.algorithm = 'aes-256-gcm';
        this.keyLength = 32;
        this.ivLength = 16;
        this.saltLength = 64;
        this.tagLength = 16;
        const key = this.configService.get('ENCRYPTION_KEY');
        if (!key || key.length < 32) {
            throw new Error('ENCRYPTION_KEY must be at least 32 characters long');
        }
        this.encryptionKey = crypto.scryptSync(key, 'salt', this.keyLength);
    }
    encrypt(plainText) {
        const iv = crypto.randomBytes(this.ivLength);
        const cipher = crypto.createCipheriv(this.algorithm, this.encryptionKey, iv);
        let encrypted = cipher.update(plainText, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();
        return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
    }
    decrypt(encryptedText) {
        const parts = encryptedText.split(':');
        if (parts.length !== 3) {
            throw new Error('Invalid encrypted text format');
        }
        const iv = Buffer.from(parts[0], 'hex');
        const encrypted = parts[1];
        const authTag = Buffer.from(parts[2], 'hex');
        const decipher = crypto.createDecipheriv(this.algorithm, this.encryptionKey, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    encryptObject(data) {
        return this.encrypt(JSON.stringify(data));
    }
    decryptObject(encryptedText) {
        const decrypted = this.decrypt(encryptedText);
        return JSON.parse(decrypted);
    }
    hashPassword(password) {
        const salt = crypto.randomBytes(this.saltLength).toString('hex');
        const hash = crypto
            .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
            .toString('hex');
        return `${salt}:${hash}`;
    }
    verifyPassword(password, hashedPassword) {
        const [salt, originalHash] = hashedPassword.split(':');
        const hash = crypto
            .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
            .toString('hex');
        return hash === originalHash;
    }
};
exports.EncryptionService = EncryptionService;
exports.EncryptionService = EncryptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EncryptionService);
//# sourceMappingURL=encryption.service.js.map