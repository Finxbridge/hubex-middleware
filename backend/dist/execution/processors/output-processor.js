"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var OutputProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputProcessor = void 0;
const common_1 = require("@nestjs/common");
const base_processor_1 = require("./base-processor");
let OutputProcessor = OutputProcessor_1 = class OutputProcessor extends base_processor_1.BaseProcessor {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger(OutputProcessor_1.name);
    }
    async process(node, context) {
        const { format, sourceNodeId, template } = node.data;
        let outputData = sourceNodeId
            ? this.getVariable(context, `${sourceNodeId}.response`)
            : this.getAllVariables(context);
        let formattedOutput;
        switch (format) {
            case 'json':
                formattedOutput = this.formatJson(outputData);
                break;
            case 'text':
                formattedOutput = this.formatText(outputData, template);
                break;
            case 'xml':
                formattedOutput = this.formatXml(outputData);
                break;
            default:
                formattedOutput = outputData;
        }
        this.logger.debug(`Output formatted as ${format}`);
        return formattedOutput;
    }
    formatJson(data) {
        try {
            JSON.stringify(data);
            return data;
        }
        catch (error) {
            this.logger.error(`JSON serialization failed: ${error.message}`);
            return { error: 'Failed to serialize output' };
        }
    }
    formatText(data, template) {
        if (template) {
            return template.replace(/\$\{([^}]+)\}/g, (match, path) => {
                const value = this.getNestedValue(data, path);
                return value !== undefined ? String(value) : match;
            });
        }
        if (typeof data === 'object') {
            return JSON.stringify(data, null, 2);
        }
        return String(data);
    }
    formatXml(data) {
        return this.objectToXml('root', data);
    }
    objectToXml(tagName, obj) {
        if (obj === null || obj === undefined) {
            return `<${tagName}/>`;
        }
        if (typeof obj !== 'object') {
            return `<${tagName}>${this.escapeXml(String(obj))}</${tagName}>`;
        }
        if (Array.isArray(obj)) {
            return obj.map(item => this.objectToXml('item', item)).join('');
        }
        const children = Object.entries(obj)
            .map(([key, value]) => this.objectToXml(key, value))
            .join('');
        return `<${tagName}>${children}</${tagName}>`;
    }
    escapeXml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
    getNestedValue(obj, path) {
        if (!path)
            return obj;
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    getAllVariables(context) {
        const result = {};
        context.variables.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    }
};
exports.OutputProcessor = OutputProcessor;
exports.OutputProcessor = OutputProcessor = OutputProcessor_1 = __decorate([
    (0, common_1.Injectable)()
], OutputProcessor);
//# sourceMappingURL=output-processor.js.map