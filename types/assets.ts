export interface AssetEntry {
    type: 'file' | 'dir';
    name: string;
}

export interface AssetList {
    directories: string[];
    files: string[];
}

export interface AssetIndex {
    tree: AssetIndexEntry[];
}

export interface AssetIndexEntry {
    path: string;
    size: number;
    type: string;
}