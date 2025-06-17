import { AnyAction, Reducer } from 'redux';

declare module './documentReducerSlice' {
  interface Document {
    id: string;
    documentName: string;
    email: string;
    createdAt: string;
  }

  interface DocumentState {
    documents: Document[];
  }

  export const addDocument: (payload: { documentName: string, email: string }) => AnyAction;
  export const deleteDocument: (payload: string) => AnyAction;

  const documentReducer: Reducer<DocumentState, AnyAction>;
  export default documentReducer;
}
