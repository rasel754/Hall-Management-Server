"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            req.body = parsed.body;
            if (parsed.query) {
                Object.defineProperty(req, "query", {
                    value: parsed.query,
                    writable: true,
                    configurable: true,
                    enumerable: true,
                });
            }
            if (parsed.params) {
                Object.defineProperty(req, "params", {
                    value: parsed.params,
                    writable: true,
                    configurable: true,
                    enumerable: true,
                });
            }
            next();
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: error.format ? error.format() : error.errors || error.message,
            });
        }
    };
};
exports.validateRequest = validateRequest;
