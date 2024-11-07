export interface Option {
  Id: number;
  AnswerId: number;
  Answer: string;
  Action: 'GoToQuestion' | 'GoToUrl';
  GoToQuestionId?: number;
  FilterQueryStringKey?: string;
  FilterQueryStringValue?: string;
}

export interface QuestionsResponse {
  Data: Question[]; 
  HtmlResult: any; 
  Message: any; 
  Success: any; 
}

export interface Question {
  Id: number;
  Question: string;
  QuestionSelectType: number; // 0 for checkbox, 1 for radio button
  IsOptional: boolean;
  Options: Option[];
}

export interface State {
  questions: Question[];
  currentQuestionId: number | null;
  userAnswers: Option[];
  loading: boolean;
  error: string | null;
}