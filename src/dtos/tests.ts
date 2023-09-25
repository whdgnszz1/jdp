export interface ChoiceInput {
  content: string;
  isCorrect: boolean;
}

export interface QuestionInput {
  title: string;
  image?: string;
  choices: ChoiceInput[];
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
  Tags?: TagInput[];
  questions: QuestionInput[];
  results: ResultInput[];
}
