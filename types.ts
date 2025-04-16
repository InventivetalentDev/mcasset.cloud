export interface VersionManifest {
    latest: {
        release: string;
        snapshot: string;
    };
    versions: {
        id: string;
        type: string;
        url: string;
        time: string;
        releaseTime: string;
        sha1: string;
        complianceLevel: number;
    }[];
}