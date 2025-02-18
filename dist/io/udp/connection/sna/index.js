"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SerialNumber {
    /**
    * SerialNumber constructor
    *
    * @param value - The little endian encoded number
    * @param size - The size of the serial number space in bits
    **/
    constructor(value, size) {
        if (!(this instanceof SerialNumber)) {
            return new SerialNumber(value, size);
        }
        value = typeof value !== "undefined" ? value : 0;
        size = typeof size !== "undefined" ? size : 32;
        this.serialBits = size;
        this.serialBytes = size / 8;
        this._value = value;
        this._modulo = Math.pow(2, this.serialBits);
        this._half = Math.pow(2, this.serialBits - 1);
        this._maxAdd = this._half - 1;
        this.number = this._value % this._modulo;
    }
    /**
    * Equality comparison with another SerialNumber
    *
    * @param that - SerialNumber to make comparison with
    * @return comparison
    **/
    eq(that) {
        return this.number === that.number;
    }
    ;
    /**
    * Not equal comparison with another SerialNumber
    *
    * @param that - SerialNumber to make comparison with
    * @return {comparison
    **/
    ne(that) {
        return this.number !== that.number;
    }
    ;
    /**
    * Less than comparison with another SerialNumber
    *
    * @param that - SerialNumber to make comparison with
    * @return comparison
    **/
    lt(that) {
        return (this.number < that.number && (that.number - this.number < this._half)) ||
            (this.number > that.number && (this.number - that.number > this._half));
    }
    ;
    /**
    * Greater than comparison with another SerialNumber
    *
    * @param that - SerialNumber to make comparison with
    * @return comparison
    **/
    gt(that) {
        return (this.number < that.number && (that.number - this.number > this._half)) ||
            (this.number > that.number && (this.number - that.number < this._half));
    }
    ;
    /**
    * Less than or equal comparison with another SerialNumber
    *
    * @param that - SerialNumber to make comparison with
    * @return comparison
    **/
    le(that) {
        return this.eq(that) || this.lt(that);
    }
    ;
    /**
    * Greater than or equal comparison with another SerialNumber
    *
    * @param that - SerialNumber to make comparison with
    * @return comparison
    **/
    ge(that) {
        return this.eq(that) || this.gt(that);
    }
    ;
    /**
    * Addition operation on two SerialNumbers
    *
    * @param that - Add this SerialNumber to the receiver
    * @return value of addition
    **/
    add(that) {
        if (!this.additionOpValid.call(that)) {
            throw Error("Addition of this value outside [0 .. maxAdd] range");
        }
        else {
            this.number = (this.number + that.number) % this._modulo;
            return this.number;
        }
    }
    ;
    /**
    * Return the number
    *
    * @param options - Optional {radix: 10, string: true, encoding:}
    * @returns number
    **/
    getNumber(options) {
        options = typeof options !== "undefined" ? options : {};
        options.radix = options.radix ? options.radix : 10;
        options.string = options.string !== undefined ? options.string : true;
        var number = this.number.toString(options.radix);
        if (options.encoding === "BE") {
            var buf = Buffer.alloc(this.serialBytes);
            buf.writeUIntLE(this.number, 0, this.serialBytes);
            number = buf.readUIntBE(0, this.serialBytes).toString(options.radix);
        }
        if (options.string) {
            return number;
        }
        else {
            return parseInt(number, options.radix);
        }
    }
    ;
    /**
    * Return the serial space
    *
    * @params bytes - Return serial space as bytes instead of bits
    * @return bits|bytes as integer
    **/
    getSpace(bytes) {
        if (bytes) {
            return this.serialBytes;
        }
        else {
            return this.serialBits;
        }
    }
    ;
    /*
    * Override default toString method
    */
    toString() {
        return "<number=" + this.number + ", bits=" + this.serialBits + ">";
    }
    ;
    /**
    * Test if addition op valid for two SerialNumbers
    *
    * @param that - Test if addition possible with receiver
    * @return result of test
    **/
    additionOpValid(that) {
        return that.number > 0 && that.number <= this._maxAdd;
    }
}
exports.default = SerialNumber;
