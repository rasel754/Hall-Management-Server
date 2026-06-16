"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationMeta = exports.getPaginationParams = void 0;
const getPaginationParams = (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    let limit = Math.max(1, parseInt(query.limit) || 10);
    if (limit > 100)
        limit = 100;
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};
exports.getPaginationParams = getPaginationParams;
const getPaginationMeta = (total, page, limit) => {
    const totalPages = Math.ceil(total / limit);
    return { total, page, limit, totalPages };
};
exports.getPaginationMeta = getPaginationMeta;
