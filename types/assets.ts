export interface AssetEntry {
    type:'file'|'dir';
    name:string;
}

export interface AssetIndex {
    directories:string[];
    files:string[];
}