export interface Media {
    file: string;
    path: string;
    description: string;
}

export interface Size {
    label: string;
    surface: number;
    pathPrefix: string;
    pathSuffix: string;
    default: boolean;
}
export interface MediaList {
    sizes: Size[];
    media: Media[];
}
