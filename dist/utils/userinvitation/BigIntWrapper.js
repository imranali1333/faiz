"use strict";
// src/utils/userinvitation/BigIntWrapper.ts
Object.defineProperty(exports, "__esModule", { value: true });
class BigIntWrapper {
    constructor(value) {
        this.value = value;
    }
    toBigInt() {
        return this.value;
    }
    toNumber() {
        return Number(this.value);
    }
    toString() {
        return this.value.toString();
    }
    static fromNumber(value) {
        return new BigIntWrapper(BigInt(value));
    }
    static fromString(value) {
        return new BigIntWrapper(BigInt(value));
    }
}
exports.default = BigIntWrapper;
