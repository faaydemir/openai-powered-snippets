//TODO: check 
export function getValueWithKey(key, variables) {
    try {
        const keys = key.split('.');
        let value = variables;
        for (const k of keys) {
            value = value[k];
        }
        return value ?? key;
    }
    catch {
        return key;
    }
}