export default class Variable {
    constructor(name, value) {
        this.name = name;
        if (value instanceof Function) {
            this.getter = value;
        }
        else {
            this._value = value;
        }
    }
    get(params) {
        if (this._value) {
            return this._value;
        }
        if (this.getter) {
            return this.getter(params);
        }
    }
}
