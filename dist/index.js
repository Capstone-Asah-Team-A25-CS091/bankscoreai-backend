"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Hapi = __importStar(require("@hapi/hapi"));
const dotenv = __importStar(require("dotenv"));
const hapi_pino_1 = __importDefault(require("hapi-pino"));
dotenv.config();
const auth_1 = __importDefault(require("./api/auth"));
const auth_2 = require("./middlewares/auth");
const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: "localhost",
    });
    await server.register(auth_2.authPlugin);
    await server.register({
        plugin: hapi_pino_1.default,
        options: {
            transport: process.env.NODE_ENV !== "production"
                ? {
                    target: "pino-pretty",
                    options: {
                        colorize: true,
                    },
                }
                : undefined,
            logEvents: ["response", "onPostStart"],
        },
    });
    server.route(auth_1.default);
    await server.start();
};
process.on("unhandledRejection", (err) => {
    console.log(err);
    process.exit(1);
});
init();
//# sourceMappingURL=index.js.map