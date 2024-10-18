"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("./config/redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/submit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const problemId = req.body.problemId;
    const code = req.body.code;
    const language = req.body.language;
    try {
        const redisClient = yield (0, redis_1.createRedisConnection)();
        const result = yield (redisClient === null || redisClient === void 0 ? void 0 : redisClient.lPush("problem", JSON.stringify({ code, language, problemId })));
        res.status(200).json({ message: "Code submitted successfully", result });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}));
const PORT = process.env.PORT || 3000;
(0, redis_1.createRedisConnection)().then(() => {
    console.log("Connected to Redis Server");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
