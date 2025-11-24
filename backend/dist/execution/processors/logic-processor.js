"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LogicProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogicProcessor = void 0;
const common_1 = require("@nestjs/common");
const base_processor_1 = require("./base-processor");
let LogicProcessor = LogicProcessor_1 = class LogicProcessor extends base_processor_1.BaseProcessor {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger(LogicProcessor_1.name);
    }
    async process(node, context) {
        const { condition, operator, value, sourceNodeId } = node.data;
        let evalValue = sourceNodeId
            ? this.getVariable(context, `${sourceNodeId}.response`)
            : this.getVariable(context, 'input');
        if (condition && typeof condition === 'string') {
            evalValue = this.getNestedValue(evalValue, condition);
        }
        const resolvedValue = this.resolveVariables(value, context);
        const result = this.evaluateCondition(evalValue, operator, resolvedValue);
        this.logger.debug(`Logic evaluation: ${evalValue} ${operator} ${resolvedValue} = ${result}`);
        this.setVariable(context, `${node.id}.result`, result);
        return {
            conditionMet: result,
            evaluatedValue: evalValue,
            operator,
            comparisonValue: resolvedValue,
        };
    }
    evaluateCondition(left, operator, right) {
        switch (operator) {
            case '==':
            case 'equals':
                return left == right;
            case '!=':
            case 'not_equals':
                return left != right;
            case '>':
            case 'greater_than':
                return left > right;
            case '<':
            case 'less_than':
                return left < right;
            case '>=':
            case 'greater_than_or_equal':
                return left >= right;
            case '<=':
            case 'less_than_or_equal':
                return left <= right;
            case 'contains':
                if (typeof left === 'string' && typeof right === 'string') {
                    return left.includes(right);
                }
                if (Array.isArray(left)) {
                    return left.includes(right);
                }
                return false;
            case 'not_contains':
                if (typeof left === 'string' && typeof right === 'string') {
                    return !left.includes(right);
                }
                if (Array.isArray(left)) {
                    return !left.includes(right);
                }
                return true;
            case 'starts_with':
                if (typeof left === 'string' && typeof right === 'string') {
                    return left.startsWith(right);
                }
                return false;
            case 'ends_with':
                if (typeof left === 'string' && typeof right === 'string') {
                    return left.endsWith(right);
                }
                return false;
            case 'is_empty':
                return !left || left.length === 0;
            case 'is_not_empty':
                return !!left && left.length > 0;
            default:
                this.logger.warn(`Unknown operator: ${operator}`);
                return false;
        }
    }
    getNestedValue(obj, path) {
        if (!path)
            return obj;
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
};
exports.LogicProcessor = LogicProcessor;
exports.LogicProcessor = LogicProcessor = LogicProcessor_1 = __decorate([
    (0, common_1.Injectable)()
], LogicProcessor);
//# sourceMappingURL=logic-processor.js.map