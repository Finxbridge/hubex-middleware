"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const path_1 = require("path");
(0, dotenv_1.config)();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'hubex',
    entities: [(0, path_1.join)(__dirname, '..', '**', '*.entity{.ts,.js}')],
    migrations: [(0, path_1.join)(__dirname, 'migrations', '*{.ts,.js}')],
    synchronize: false,
    logging: process.env.DATABASE_LOGGING === 'true',
    ssl: process.env.DATABASE_SSL === 'true' ? {
        rejectUnauthorized: false,
    } : false,
});
//# sourceMappingURL=data-source.js.map