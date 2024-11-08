export interface Option {
  Id: number;
  AnswerId: number;
  Answer: string;
  Action: 'GoToQuestion' | 'GoToUrl';
  GoToQuestionId?: number;
  FilterQueryStringKey?: string;
  FilterQueryStringValue?: string;
  [key: string]: any;
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
  QuestionSelectType: number;
  IsOptional: boolean;
  Options: Option[];
}
