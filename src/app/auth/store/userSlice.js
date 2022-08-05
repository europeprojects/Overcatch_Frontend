import { createSlice } from '@reduxjs/toolkit';
import firebase from 'firebase';
import history from '@history';
import _ from '@lodash';
import { setInitialSettings, setDefaultSettings } from 'app/store/fuse/settingsSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import jwtService from 'app/services/jwtService';

export const createUserSettingsFirebase = authUser => async (dispatch, getState) => {
	const guestUser = getState().auth.user;
	const fuseDefaultSettings = getState().fuse.settings.defaults;
	const { currentUser } = firebase.auth();

	/**
	 * Merge with current Settings
	 */
	const user = _.merge({}, guestUser, {
		uid: authUser.uid,
		from: 'firebase',
		role: ['admin'],
		data: {
			displayName: authUser.displayName,
			email: authUser.email,
			settings: { ...fuseDefaultSettings }
		}
	});
	currentUser.updateProfile(user.data);

	dispatch(updateUserData(user));

	return dispatch(setUserData(user));
};

export const setUserData = user => async (dispatch, getState) => {
	/*
        You can redirect the logged-in user to a specific route depending on his role
         */
	//console.log(user);
	history.location.state = {
		redirectUrl: '/' // for example 'apps/academy'
	};
	/*
    Set User Settings
     */
	//dispatch(setDefaultSettings(user.data.settings));

	dispatch(setUser(user));
};

export const updateUserSettings = settings => async (dispatch, getState) => {
	const oldUser = getState().auth.user;
	const user = _.merge({}, oldUser, { data: { settings } });

	dispatch(updateUserData(user));

	return dispatch(setUserData(user));
};

export const updateUserShortcuts = shortcuts => async (dispatch, getState) => {
	const { user } = getState().auth;
	const newUser = {
		...user,
		data: {
			...user.data,
			shortcuts
		}
	};

	dispatch(updateUserData(user));

	return dispatch(setUserData(newUser));
};

export const logoutUser = () => async (dispatch, getState) => {
	const { user } = getState().auth;

	if (!user.role || user.role.length === 0) {
		// is guest
		return null;
	}

	history.push({
		pathname: '/login'
	});

	jwtService.logout();

	dispatch(setInitialSettings());

	dispatch(userLoggedOut());
};



export const updateUserData = user => async (dispatch, getState) => {
	if (!user.role || user.role.length === 0) {
		// is guest
		return;
	}
	switch (user.from) {
		default: {
			jwtService
				.updateUserData(user)
				.then(() => {
					dispatch(showMessage({ message: 'User data saved with api' }));
				})
				.catch(error => {
					dispatch(showMessage({ message: error.message }));
				});
			break;
		}
	}
};

const initialState = {
	role: [], // guest
	data: {
	}
};

const userSlice = createSlice({
	name: 'auth/user',
	initialState,
	reducers: {
		setUser: (state, action) => action.payload,
		userLoggedOut: (state, action) => initialState
	},
	extraReducers: {}
});

export const { setUser, userLoggedOut } = userSlice.actions;

export default userSlice.reducer;
