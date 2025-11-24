"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProcessor = void 0;
class BaseProcessor {
    getVariable(context, key) {
        return context.variables.get(key);
    }
    setVariable(context, key, value) {
        context.variables.set(key, value);
    }
    resolveVariables(text, context) {
        if (typeof text !== 'string')
            return text;
        return text.replace(/\$\{([^}]+)\}/g, (match, varPath) => {
            const value = this.getVariable(context, varPath);
            return value !== undefined ? String(value) : match;
        });
    }
    resolveObjectVariables(obj, context) {
        if (typeof obj === 'string') {
            return this.resolveVariables(obj, context);
        }
        if (Array.isArray(obj)) {
            return obj.map(item => this.resolveObjectVariables(item, context));
        }
        if (obj !== null && typeof obj === 'object') {
            const resolved = {};
            for (const [key, value] of Object.entries(obj)) {
                resolved[key] = this.resolveObjectVariables(value, context);
            }
            return resolved;
        }
        return obj;
    }
}
exports.BaseProcessor = BaseProcessor;
//# sourceMappingURL=base-processor.js.map