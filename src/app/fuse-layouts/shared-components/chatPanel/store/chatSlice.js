import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setSelectedContactId } from './contactsSlice';
import { closeChatPanel } from './stateSlice';
import { updateUserChatList } from './userSlice';
import { createApi } from 'app/components/ApiClient';
import Config from 'app/services/Config';

const apiUrl=createApi(Config.AUTH_API_URL);

export const getChat = createAsyncThunk('chatPanel/chat/getChat', async ({ contactId }, { dispatch, getState }) => {
	const { id: userId } = getState().chatPanel.user;

	const response = await apiUrl.get('/api/chat/get-chat', {
		params: {
			contactId,
			userId
		}
	});
	console.log(response.data);
	const { id, chat, userChatList } = await response.data;


	dispatch(setSelectedContactId(contactId));
	dispatch(updateUserChatList(chat));

	return await response.data;
});

export const sendMessage = createAsyncThunk(
	'chatPanel/chat/sendMessage',
	async ({ messageText, chatId, contactId }, { dispatch, getState }) => {
		const response = await apiUrl.post('/api/chat/send-message', { chatId, messageText, contactId });

		const { message, chat } = await response.data;
        
		dispatch(updateUserChatList(chat));

		return message;
	}
);

const chatSlice = createSlice({
	name: 'chatPanel/chat',
	initialState: null,
	reducers: {
		removeChat: (state, action) => null
	},
	extraReducers: {
		[getChat.fulfilled]: (state, action) => action.payload,
		//[sendMessage.fulfilled]: (state, action) => {
		//	state.dialog = [...state.dialog,  action.payload];
		//},
		[sendMessage.fulfilled]: (state, action) => {
			state.chat = [...state.chat,  {id:null, user: {}, message: action.payload, time: ""}];
		},
		//[sendMessage.fulfilled]: (state, action) => action.payload,  
		[closeChatPanel]: (state, action) => null
	}
});

export const { removeChat } = chatSlice.actions;

export default chatSlice.reducer;
