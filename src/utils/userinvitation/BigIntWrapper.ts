// src/utils/userinvitation/BigIntWrapper.ts

export default class BigIntWrapper {
    private value: BigInt;
  
    constructor(value: BigInt) {
      this.value = value;
    }
  
    toBigInt(): BigInt {
      return this.value;
    }
  
    toNumber(): number {
      return Number(this.value);
    }
  
    toString(): string {
      return this.value.toString();
    }
  
    static fromNumber(value: number): BigIntWrapper {
      return new BigIntWrapper(BigInt(value));
    }
  
    static fromString(value: string): BigIntWrapper {
      return new BigIntWrapper(BigInt(value));
    }
  }
  