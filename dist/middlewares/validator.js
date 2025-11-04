"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
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
        return h.response({ errors: error.errors }).code(400).takeover();
    }
};
exports.validate = validate;
//# sourceMappingURL=validator.js.map