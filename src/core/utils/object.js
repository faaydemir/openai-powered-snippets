export function getValueWithKey(key, variables) {
    const keys = key.split('.');
    let value = variables;
    for (const k of keys) {
        value = value[k];
    }
    return value;
}