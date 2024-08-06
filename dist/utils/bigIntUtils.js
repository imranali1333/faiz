"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertBigIntsToStrings = convertBigIntsToStrings;
function convertBigIntsToStrings(obj) {
    if (obj === null || obj === undefined)
        return obj;
    if (typeof obj === 'bigint')
        return obj.toString();
    if (Array.isArray(obj)) {
        return obj.map(convertBigIntsToStrings);
    }
    if (typeof obj === 'object') {
        return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, convertBigIntsToStrings(value)]));
    }
    return obj;
}
