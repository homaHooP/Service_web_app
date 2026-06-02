import { authHandlers } from "./authHandlers.js";
import { requestHandlers } from "./reqestHandlers.js";

export const handlers = [
    ...authHandlers,
    ...requestHandlers
];