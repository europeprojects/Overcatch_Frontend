import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createApi } from 'app/components/ApiClient';
import Config from 'app/services/Config';

const apiUrl=createApi(Config.AUTH_API_URL);

export const getUserData = createAsyncThunk('chatPanel/user/getUserData', async () => {
	const response = await apiUrl.get('/api/chat/user');
	const data = await response.data;
	return data;
});

export const updateUserData = createAsyncThunk('chatPanel/user/updateUserData', async newData => {
	const response = await axios.post('/api/chat/user/data', newData);
	const data = await response.data;

	return data;
});

const userSlice = createSlice({
	name: 'chatPanel/user',
	initialState: null,
	reducers: {
		updateUserChatList: (state, action) => {
			state.chatList = action.payload;
		}
	},
	extraReducers: {
		[getUserData.fulfilled]: (state, action) => action.payload,
		[updateUserData.fulfilled]: (state, action) => action.payload
	}
});

export const { updateUserChatList } = userSlice.actions;

export default userSlice.reducer;
