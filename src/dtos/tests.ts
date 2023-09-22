export interface ChoiceInput {
  content: string;
  score: number;
}

export interface QuestionInput {
  title: string;
  image?: string;
  Choices: {
    create: ChoiceInput[];
  };
}

export interface TagInput {
  content: string;
}

export interface ResultInput {
  image?: string;
  content: string;
  score: number;
}

export interface TestInput {
  title: string;
  content: string;
  category: string;
  image?: string;
  Tags?: {
    create: TagInput[];
  };
  questions: QuestionInput[];
  results: ResultInput[];
}
