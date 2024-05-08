export interface Idiom {
  id: string;
  idiom: string;
  meaningBrief: string;
  meaningFull: string;
  createdAt: Date;
  thumbnail?: string;
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
  idiom: string;
  meaning: string;
}

export interface ThumbnailResponse {
  idiomId: string;
  thumbnail: string;
}
