export type MineRenderTarget = { param: 'block' | 'item' | 'model' | 'structure', id: string };
export type BlockStateProperty = { name: string, values: string[], optional: boolean };

export const mineRenderTarget = (path: string[]): MineRenderTarget | null => {
    const file = path[path.length - 1];
    if (path[0] === 'data' && (path[2] === 'structure' || path[2] === 'structures') && path.length >= 4 && file?.endsWith('.nbt')) {
        return {param: 'structure', id: `${path[1]}:${path.slice(3).join('/').slice(0, -4)}`};
    }
    if (path[0] !== 'assets' || !file?.endsWith('.json') || file.startsWith('_')) return null;
    const ns = path[1];
    const rest = path.slice(2);
    const name = file.slice(0, -5);
    if (rest.length === 2 && rest[0] === 'blockstates') return {param: 'block', id: `${ns}:${name}`};
    if (rest.length === 2 && rest[0] === 'items') return {param: 'item', id: `${ns}:${name}`};
    if (rest[0] === 'models' && (rest[1] === 'block' || rest[1] === 'item') && rest.length >= 3) {
        return {param: 'model', id: `${ns}:${rest.slice(1).join('/').slice(0, -5)}`};
    }
    return null;
};

export const blockStateProperties = (json: unknown): { properties: BlockStateProperty[], defaults: Record<string, string> } => {
    const properties: BlockStateProperty[] = [];
    let defaults: Record<string, string> = {};
    if (!json || typeof json !== 'object' || Array.isArray(json)) return {properties, defaults};
    const data = json as Record<string, unknown>;
    const add = (name: string, value: string, optional: boolean) => {
        if (!/^[a-z0-9_]+$/.test(name) || !/^[a-z0-9_-]+$/.test(value)) return false;
        let property = properties.find(property => property.name === name);
        if (!property) {
            property = {name, values: [], optional};
            properties.push(property);
        }
        if (!property.values.includes(value)) property.values.push(value);
        return true;
    };
    if (data.variants && typeof data.variants === 'object' && !Array.isArray(data.variants)) {
        let hasDefaults = false;
        for (const key of Object.keys(data.variants)) {
            const pairs: [string, string][] = [];
            for (const pair of key.split(',')) {
                const parts = pair.split('=');
                if (parts.length === 2 && add(parts[0], parts[1], false)) pairs.push([parts[0], parts[1]]);
            }
            if (!hasDefaults && pairs.length) {
                defaults = Object.fromEntries(pairs);
                hasDefaults = true;
            }
        }
    } else if (Array.isArray(data.multipart)) {
        const walk = (when: unknown) => {
            if (!when || typeof when !== 'object' || Array.isArray(when)) return;
            const conditions = when as Record<string, unknown>;
            if (Array.isArray(conditions.OR) || Array.isArray(conditions.AND)) {
                if (Array.isArray(conditions.OR)) conditions.OR.forEach(walk);
                if (Array.isArray(conditions.AND)) conditions.AND.forEach(walk);
            } else {
                for (const [name, value] of Object.entries(conditions)) {
                    for (const option of String(value).split('|')) add(name, option, true);
                }
            }
        };
        for (const part of data.multipart) {
            if (part && typeof part === 'object') walk(part.when);
        }
        defaults = Object.fromEntries(properties.map(property => [property.name, property.values[0]]));
    }
    return {properties, defaults};
};
