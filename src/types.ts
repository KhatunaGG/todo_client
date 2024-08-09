export type ScreenWidthType = number;

export interface IInitialState {
  id: number;
  name: string;
  completed: boolean;
}

export type ActionType =
  | { type: 'ADD_TASK'; payload: string }
  | { type: 'DELETE_TASK'; payload: number }
  | { type: 'EDIT_TASK'; payload: number }
  | { type: 'SHOW_ALL_TASKS'; payload: IInitialState[] }
  | { type: 'SHOW_ALL_ACTIVE'; payload: IInitialState[] }
  | { type: 'SHOW_ALL_COMPLETED'; payload: IInitialState[] }
  | { type: 'CLEAR_ALL_COMPLETED'; payload: IInitialState[] };