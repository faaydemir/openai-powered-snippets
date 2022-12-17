function createFunctionFromString(fnString) {
    const match = fnString.match(/function\s+(\w+)\(([^)]*)\)\s*\{([\s\S]*)\}/);
    const name = match[1];
    const args = match[2].split(',').map(arg => arg.trim());
    const body = match[3];
    const fn = new Function(...args, body);
    return { name, fn };
}

export default class Fn {
    constructor(name, fn) {
        this._fn = fn;
        this.name = name;
    }
    run(...args) {
        return this._fn(...args);
    }

    /**
     * @param  {Function} fn
     */
    static fromString(fnString) {
        const { name, fn } = createFunctionFromString(fnString);
        return new Fn(name, fn);
    }
    /**
     * @param  {Function} fn
     */
    static fromFunction(fn) {
        return new Fn(fn.name, fn);
    }
}