"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("../config/env");
exports.requestLogger = (0, morgan_1.default)(env_1.env.NODE_ENV === "production" ? "combined" : "dev");
