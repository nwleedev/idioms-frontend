export interface Idiom {
  id: string;
  idiom: string;
  meaningBrief: string;
  meaningFull: string;
  createdAt: Date;
  publishedAt: Date;
  thumbnail?: string;
  thumbnails?: string[];
  description: string;
  examples: string[];
}

export interface IdiomExample {
  index: number;
  content: string;

  idiomId: string;
}

export interface IdiomResponse {
  idioms: Idiom[];
  cursor: {
    next: string;
    previous: string;
  };
}

export interface IdiomPage {
  idioms: Idiom[];
  count: number;
  nextToken: string;
  previousToken: string;
}

export interface IdiomsPageParam {
  cursor: {
    key: string;
    token: string;
  };
}

export interface IdiomInput {
  id: string;
  idiom: string;
  meaning: string;
  createdAt: Date;
}

export interface IdiomInputResponse {
  inputs: IdiomInput[];
}

export interface ThumbnailResponse {
  idiomId: string;
  thumbnail: string;
}
