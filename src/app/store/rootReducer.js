import { combineReducers } from '@reduxjs/toolkit';
import auth from 'app/auth/store';
import fuse from './fuse';
import i18n from './i18nSlice';
import company from './companySlice';
const createReducer = asyncReducers =>
	combineReducers({
		auth,
		fuse,
		i18n,
		company,
		...asyncReducers
	});

export default createReducer;
