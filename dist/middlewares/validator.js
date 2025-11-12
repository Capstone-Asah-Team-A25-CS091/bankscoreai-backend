"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => async (request, h) => {
    try {
        schema.parse({
            body: request.payload,
            query: request.query,
            params: request.params,
        });
        return h.continue;
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return h.response({ errors: error.issues }).code(400).takeover();
        }
        return h.response({ message: 'Internal Server Error' }).code(500).takeover();
    }
};
exports.validate = validate;
//# sourceMappingURL=validator.js.map