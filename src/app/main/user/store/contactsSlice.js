import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { createApi } from 'app/components/ApiClient';
import Config from 'app/services/Config';
import axios from 'axios';
import { getUserData } from './userSlice';

const apiUrl=createApi(Config.AUTH_API_URL);

export const getContacts = createAsyncThunk('contactsApp/contacts/getContacts', async (routeParams, { getState }) => {
	routeParams = routeParams || getState().contactsApp.contacts.routeParams;
	const response = await apiUrl.get('/api/user/allUsers');
	const data = await response.data;
	 data.map(item => {
			if (item.userType  == "CUSTOMER")
				item.userType = "CLIENT";
	 })

	//console.log(data)
	return { data, routeParams };
});

export const addContact = createAsyncThunk(
	'contactsApp/contacts/addContact',
	async (contact, { dispatch, getState }) => {
		const response = await apiUrl.post('/api/user/addPersonel',  contact );
		const data = await response.data;

		dispatch(getContacts());

		return data;
	}
);

export const updateContact = createAsyncThunk(
	'contactsApp/contacts/updateContact',
	async (contact, { dispatch, getState }) => { 
		const response = await apiUrl.post('/api/user/updateUser', contact);
		const data = await response.data;

		dispatch(getContacts());

		return data;
	}
);

export const removeContact = createAsyncThunk(
	'contactsApp/contacts/removeContact',
	async (contactId, { dispatch, getState }) => {
		const response = await apiUrl.get('/api/user/deleteUser?id='+ contactId );
		const data = await response.data;
		dispatch(getContacts());

		return data;
	}
);

export const removeContacts = createAsyncThunk(
	'contactsApp/contacts/removeContacts',
	async (contactIds, { dispatch, getState }) => {
		const response = await apiUrl.post('/api/contacts-app/remove-contacts', { contactIds });
		const data = await response.data;

		dispatch(getContacts());

		return data;
	}
);

export const toggleStarredContact = createAsyncThunk(
	'contactsApp/contacts/toggleStarredContact',
	async (contactId, { dispatch, getState }) => {
		const response = await apiUrl.post('/api/contacts-app/toggle-starred-contact', { contactId });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getContacts());

		return data;
	}
);

export const toggleStarredContacts = createAsyncThunk(
	'contactsApp/contacts/toggleStarredContacts',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/toggle-starred-contacts', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getContacts());

		return data;
	}
);

export const setContactsStarred = createAsyncThunk(
	'contactsApp/contacts/setContactsStarred',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/set-contacts-starred', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getContacts());

		return data;
	}
);
export const setActiveOrDeactive = createAsyncThunk("",async (id,status, { dispatch, getState }) => {
	console.log(id);
	console.log(status);
	// const response = await apiUrl.get('/api/user/deleteUser?id='+ contactId );
	// const data = await response.data;
	// dispatch(getContacts());
	//
	// return data;
});

// export const setActiveOrDeactive = (id,status)=>{
// 	console.log(status);
// }
	// async (id,status, { dispatch, getState }) => {
	//
	// 	// const response = await axios.get('?id='+ id);
	// 	// const data = await response.data;
	// 	//
	// 	//
	// 	// dispatch(getContacts());
	// 	//
	// 	// return data;
	// }

export const setContactsUnstarred = createAsyncThunk(
	'contactsApp/contacts/setContactsUnstarred',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/set-contacts-unstarred', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getContacts());

		return data;
	}
);

const contactsAdapter = createEntityAdapter({});

export const { selectAll: selectContacts, selectById: selectContactsById } = contactsAdapter.getSelectors(
	state => state.contactsApp.contacts
);

const contactsSlice = createSlice({
	name: 'contactsApp/contacts',
	initialState: contactsAdapter.getInitialState({
		searchText: '',
		routeParams: {},
		contactDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		}
	}),
	reducers: {
		setContactsSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		},
		openNewContactDialog: (state, action) => {
			state.contactDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewContactDialog: (state, action) => {
			state.contactDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditContactDialog: (state, action) => {
			state.contactDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditContactDialog: (state, action) => {
			state.contactDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		}
	},
	extraReducers: {
		[updateContact.fulfilled]: contactsAdapter.upsertOne,
		[addContact.fulfilled]: contactsAdapter.addOne,
		[getContacts.fulfilled]: (state, action) => {
			const { data, routeParams } = action.payload;
			contactsAdapter.setAll(state, data);
			state.routeParams = routeParams;
			state.searchText = '';
		}
	}
});

export const {
	setContactsSearchText,
	openNewContactDialog,
	closeNewContactDialog,
	openEditContactDialog,
	closeEditContactDialog
} = contactsSlice.actions;

export default contactsSlice.reducer;
