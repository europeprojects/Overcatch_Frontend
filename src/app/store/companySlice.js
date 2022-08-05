import { createSlice } from '@reduxjs/toolkit';
import i18n from 'i18n';
import { setDefaultSettings } from './fuse/settingsSlice';

export const changeCompany = companyId => (dispatch, getState) => {
    // const { direction } = getState().fuse.settings.defaults;

    // const newLangDirection = i18n.dir(companyId);
    //
    // i18n.changeLanguage(companyId);

    // if (companyId !== direction) {
    //     dispatch(setDefaultSettings({ direction: newLangDirection }));
    // }
    sessionStorage.setItem('companyId',companyId);
    return dispatch(companySlice.actions.changeCompany(companyId));
};

const companySlice = createSlice({
    name: 'company',
    initialState: {
        currentCompanyId: sessionStorage.getItem('companyId'),
    },
    reducers: {
        changeCompany: (state, action) => {
            state.currentCompanyId = action.payload;
        }
    }
});

export default companySlice.reducer;