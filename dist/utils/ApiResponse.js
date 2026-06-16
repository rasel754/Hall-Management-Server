"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    constructor(message, data, meta) {
        this.success = true;
        this.message = message;
        this.data = data;
        if (meta) {
            this.meta = meta;
        }
    }
}
exports.ApiResponse = ApiResponse;
