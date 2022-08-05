import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

// export const getDocuments = createAsyncThunk('ducumentsApp/getDocuments', async () => {
// 	const response = await axios.get('/api/document/documents');
// 	const data = await response.data;
//
// 	return data;
// });

// const documentsAdapter = createEntityAdapter({});
//
// export const { selectAll: selectDocuments, selectById: selectDocumentsById } = documentsAdapter.getSelectors(
// 	state => state.documentsApp.documents
// );
//
// const documentsSlice = createSlice({
// 	name: 'documentsApp/documents',
// 	initialState: documentsAdapter.getInitialState({
// 		searchText: ''
// 	}),
// 	reducers: {
// 		setDocumentsSearchText: {
// 			reducer: (state, action) => {
// 				state.searchText = action.payload;
// 			},
// 			prepare: event => ({ payload: event.target.value || '' })
// 		}
// 	},
// 	extraReducers: {
// 		[getDocuments().fulfilled]: documentsAdapter.setAll
// 	}
// });
//
// export const { setDocumentsSearchText } = documentsSlice.actions;
//
// export default documentsSlice.reducer;
