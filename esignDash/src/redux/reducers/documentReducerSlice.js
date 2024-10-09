// reducers/documentReducer.js
import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  documents: [],
};

const documentSlice = createSlice({
  name: 'esign_document',
  initialState,
  reducers: {
    addDocument(state, action) {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')} (${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')})`;
      
      const newDocument = {
        id: uuidv4(), 
        createdAt: formattedDate, 
        ...action.payload 
      };
      state.documents.push(newDocument);
    },
    deleteDocument(state, action) {
      state.documents = state.documents.filter(document => document.id !== action.payload);
    },
    // Add other document-related reducers here
  },
});

export const { addDocument, deleteDocument } = documentSlice.actions;

export default documentSlice.reducer;
