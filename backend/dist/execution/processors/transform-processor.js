"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TransformProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformProcessor = void 0;
const common_1 = require("@nestjs/common");
const base_processor_1 = require("./base-processor");
let TransformProcessor = TransformProcessor_1 = class TransformProcessor extends base_processor_1.BaseProcessor {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger(TransformProcessor_1.name);
    }
    async process(node, context) {
        const { transformType, mapping, script, sourceNodeId } = node.data;
        let sourceData = sourceNodeId
            ? this.getVariable(context, `${sourceNodeId}.response`)
            : this.getVariable(context, 'input');
        if (!sourceData) {
            this.logger.warn('No source data available for transformation');
            return null;
        }
        let result;
        switch (transformType) {
            case 'map':
                result = this.mapTransform(sourceData, mapping);
                break;
            case 'filter':
                result = this.filterTransform(sourceData, script);
                break;
            case 'reduce':
                result = this.reduceTransform(sourceData, script);
                break;
            case 'custom':
                result = this.customTransform(sourceData, script);
                break;
            default:
                throw new Error(`Unknown transform type: ${transformType}`);
        }
        this.setVariable(context, `${node.id}.result`, result);
        return result;
    }
    mapTransform(data, mapping) {
        if (!mapping)
            return data;
        if (Array.isArray(data)) {
            return data.map(item => this.mapObject(item, mapping));
        }
        return this.mapObject(data, mapping);
    }
    mapObject(obj, mapping) {
        const result = {};
        for (const [newKey, oldKey] of Object.entries(mapping)) {
            const value = this.getNestedValue(obj, oldKey);
            if (value !== undefined) {
                result[newKey] = value;
            }
        }
        return result;
    }
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    filterTransform(data, filterExpression) {
        if (!Array.isArray(data)) {
            throw new Error('Filter transform requires array input');
        }
        try {
            const filterFn = new Function('item', `return ${filterExpression}`);
            return data.filter(filterFn);
        }
        catch (error) {
            this.logger.error(`Filter evaluation failed: ${error.message}`);
            return data;
        }
    }
    reduceTransform(data, reduceExpression) {
        if (!Array.isArray(data)) {
            throw new Error('Reduce transform requires array input');
        }
        return {
            count: data.length,
            items: data,
        };
    }
    customTransform(data, script) {
        if (!script)
            return data;
        try {
            const transformFn = new Function('data', script);
            return transformFn(data);
        }
        catch (error) {
            this.logger.error(`Custom transform failed: ${error.message}`);
            throw new Error(`Transform execution failed: ${error.message}`);
        }
    }
};
exports.TransformProcessor = TransformProcessor;
exports.TransformProcessor = TransformProcessor = TransformProcessor_1 = __decorate([
    (0, common_1.Injectable)()
], TransformProcessor);
//# sourceMappingURL=transform-processor.js.map