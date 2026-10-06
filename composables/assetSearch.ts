import MiniSearch from 'minisearch';
import type { AssetIndexEntry } from '~/types/assets';

export interface SearchableAsset {
    path: string;
    name: string; // file/folder name, including extension
    stem: string; // name without extension, e.g. "diamond_sword"
    dir: string; // parent directory path, e.g. "assets/minecraft/textures/item"
    ext: string; // lowercase extension without dot, empty for folders
    isDir: boolean;
    size?: number;
}

export interface ParsedQuery {
    text: string;
    ext: string[];
    notExt: string[];
    isDir?: boolean;
    in: string[];
}

// Generated bookkeeping files that exist in every folder and only add noise
const HIDDEN_NAMES = new Set(['_list.json', '_all.json', '.mcassetsroot']);

// Shorthands so people can type e.g. "type:image" instead of listing extensions
const TYPE_ALIASES: Record<string, { ext?: string[], isDir?: boolean }> = {
    dir: {isDir: true},
    folder: {isDir: true},
    file: {isDir: false},
    image: {ext: ['png']},
    texture: {ext: ['png']},
    sound: {ext: ['ogg']},
    audio: {ext: ['ogg']},
    json: {ext: ['json']},
    model: {ext: ['json']},
    shader: {ext: ['vsh', 'fsh', 'glsl', 'json']},
    text: {ext: ['txt', 'json', 'mcmeta', 'lang']},
};

const tokenize = (text: string) => text.toLowerCase().split(/[\s/_.\-:]+/).filter(Boolean);

export function toSearchableAssets(entries: AssetIndexEntry[]): SearchableAsset[] {
    const result: SearchableAsset[] = [];
    for (const entry of entries) {
        const slash = entry.path.lastIndexOf('/');
        const name = entry.path.substring(slash + 1);
        if (HIDDEN_NAMES.has(name)) continue;
        const isDir = entry.type === 'tree';
        const dot = name.lastIndexOf('.');
        const hasExt = !isDir && dot > 0;
        result.push({
            path: entry.path,
            name,
            stem: hasExt ? name.substring(0, dot) : name,
            dir: slash >= 0 ? entry.path.substring(0, slash) : '',
            ext: hasExt ? name.substring(dot + 1).toLowerCase() : '',
            isDir,
            size: entry.size
        });
    }
    return result;
}

export function createAssetSearch(assets: SearchableAsset[]) {
    const search = new MiniSearch<SearchableAsset>({
        idField: 'path',
        fields: ['stem', 'dir', 'ext'],
        storeFields: ['path', 'name', 'stem', 'dir', 'ext', 'isDir', 'size'],
        tokenize,
        searchOptions: {
            tokenize,
            // The file name matters far more than the folders it happens to be in
            boost: {stem: 4, dir: 1, ext: 1},
            combineWith: 'AND',
            prefix: true,
        }
    });
    search.addAll(assets);
    return search;
}

export function parseQuery(raw: string): ParsedQuery {
    const parsed: ParsedQuery = {text: '', ext: [], notExt: [], in: []};
    const text: string[] = [];
    for (const part of raw.trim().split(/\s+/)) {
        const m = part.match(/^(-?)(ext|type|is|in):(.*)$/i);
        if (!m || !m[3]) {
            text.push(part);
            continue;
        }
        const negate = m[1] === '-';
        const key = m[2].toLowerCase();
        const values = m[3].toLowerCase().split(',').filter(Boolean);
        if (key === 'in') {
            parsed.in.push(...values.map(v => v.replace(/^\/+|\/+$/g, '')));
            continue;
        }
        for (const value of values) {
            const alias = key === 'ext' ? {ext: [value.replace(/^\./, '')]} : TYPE_ALIASES[value];
            if (!alias) continue;
            if (alias.ext) (negate ? parsed.notExt : parsed.ext).push(...alias.ext);
            if (alias.isDir !== undefined) parsed.isDir = negate ? !alias.isDir : alias.isDir;
        }
    }
    parsed.text = text.join(' ');
    return parsed;
}

export function hasFilters(q: ParsedQuery) {
    return q.ext.length > 0 || q.notExt.length > 0 || q.isDir !== undefined || q.in.length > 0;
}

export function matchesFilters(asset: SearchableAsset, q: ParsedQuery, pathPrefix = '') {
    if (pathPrefix && !asset.path.startsWith(pathPrefix)) return false;
    if (q.isDir !== undefined && asset.isDir !== q.isDir) return false;
    if (q.ext.length > 0 && !q.ext.includes(asset.ext)) return false;
    if (q.notExt.length > 0 && q.notExt.includes(asset.ext)) return false;
    if (q.in.length > 0 && !q.in.some(p => ('/' + asset.dir + '/').includes('/' + p + '/') || asset.dir.includes(p))) return false;
    return true;
}

export interface AssetSearchResult extends SearchableAsset {
    score: number;
}

export function searchAssets(
    search: MiniSearch<SearchableAsset>,
    assets: SearchableAsset[],
    raw: string,
    pathPrefix = ''
): AssetSearchResult[] {
    const q = parseQuery(raw);
    const filter = (a: SearchableAsset) => matchesFilters(a, q, pathPrefix);

    if (!q.text) {
        // Filter-only query, e.g. "ext:ogg in:music": list everything that matches
        if (!hasFilters(q)) return [];
        return assets.filter(filter)
            .map(a => ({...a, score: 0}))
            .sort((a, b) => a.path.localeCompare(b.path));
    }

    const wanted = tokenize(q.text).join('_');
    const run = (fuzzy: boolean) => search.search(q.text, {
        filter: (r) => filter(r as unknown as SearchableAsset),
        // Typo tolerance only kicks in when nothing matches as typed, otherwise
        // it drags in lots of near-miss words ("stone" -> "stones", "store", ...)
        fuzzy: fuzzy ? (term: string) => term.length >= 4 ? 0.2 : false : false
    }) as unknown as AssetSearchResult[];
    let results = run(false);
    if (results.length === 0) results = run(true);

    for (const r of results) {
        const stem = r.stem.toLowerCase();
        // Exact and prefix name matches beat files that merely share a word,
        // so "stone" ranks stone.png above stone_bricks_from_stone_stonecutting.json
        if (stem === wanted) r.score *= 6;
        else if (stem.startsWith(wanted)) r.score *= 3;
        // Prefer shorter, less nested paths when everything else is equal
        r.score /= 1 + r.path.length / 200;
    }
    return results.sort((a, b) => b.score - a.score);
}
