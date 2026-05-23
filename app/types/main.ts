export interface CompareData {
    [x: number]: [Result, ...Result[]]
}

export interface DownloadResponse {
    download: string
}

export interface SearchData {
    name: string;
    id: string;
    data: Result[];
}

export interface Result {
    title?: string | undefined,
    cover?: string | undefined,
    link?: string | undefined,
    tag?: string | undefined,
    volume?: string | number | undefined,
    type?: string | undefined,
    size?: string,
    source?: string,
    cropped?: boolean
}
