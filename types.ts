export interface VersionManifest {
    latest: {
        release: string;
        snapshot: string;
    };
    versions: ManifestVersion[];
}

export interface ManifestVersion {
    id: string;
    type: string;
    url: string;
    time: string;
    releaseTime: string;
    sha1: string;
    complianceLevel: number;
}

export interface AvailableVersion {
    name: string;
}
export type AvailableVersions = {versions:AvailableVersion[]};

