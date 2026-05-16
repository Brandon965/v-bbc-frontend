export interface CompareData {
    [x: number]: [
        [x: Result[]]
    ]
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
    tag?: string | undefined , 
    volume?: string | number | undefined,
    type?: string | undefined,
    size?: string
}