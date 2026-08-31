"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSeederFiles = void 0;
const multer_1 = __importDefault(require("multer"));
const custom_error_1 = require("../errors/custom.error");
const allowedSeederFiles = new Set([
    "roles.json",
    "users.json",
    "clinics.json",
    "warehouses.json",
    "medications.json",
    "inventory.json",
]);
const fileFilter = (_request, file, callback) => {
    const isJson = file.mimetype === "application/json" || file.originalname.toLowerCase().endsWith(".json");
    if (!isJson || !allowedSeederFiles.has(file.originalname.toLowerCase())) {
        callback(new Error("Only the allowed JSON seeder files can be uploaded"));
        return;
    }
    callback(null, true);
};
const multerSeederUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { files: 6, fileSize: 1024 * 1024 },
    fileFilter,
}).array("files", 6);
const uploadSeederFiles = (request, response, next) => {
    multerSeederUpload(request, response, error => {
        if (error) {
            next(new custom_error_1.BadRequestError(error.message));
            return;
        }
        next();
    });
};
exports.uploadSeederFiles = uploadSeederFiles;
