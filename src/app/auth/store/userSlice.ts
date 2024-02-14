//@ts-nocheck

import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import 'firebase/auth';
import history from '@history';
import _ from '@lodash';
import { setInitialSettings, setDefaultSettings } from 'app/store/fuse/settingsSlice';
import { showMessage } from 'app/store/fuse/messageSlice';

import loginService from 'app/main/login/services/loginService';

export interface UserState {
	role: String[] | string,
	userType: String,
	userId: String,
	userName: String,
	sessionId: String,
	data?: {
		displayName: string,
		photoURL: string,
		email: string,
		shortcuts: string[]
	},
	from: string
}



export const setUserData = (user: UserState) => async (dispatch: Dispatch<any>, getState: any) => {
	/*
		You can redirect the logged-in user to a specific route depending on his role
		 */

	// history.location.state = {
	// 	redirectUrl: "/agent" // for example 'apps/academy'
	// };
	//TODO redirect based on role
	if (user.userName == "admin") {
		history.push({
			pathname: '/agent/example'
		});
	} else {
		history.push({
			pathname: '/agent/example'
		});
	}
	/*
	Set User Settings
	 */
	//dispatch(setDefaultSettings(user.data.settings));
	dispatch(setDefaultSettings(user.data.settings));

	dispatch(setUser(user));
	dispatch(showMessage({ message: 'User logged in' }));

};

export const updateUserSettings = (settings: any) => async (dispatch: Dispatch<any>, getState: any) => {
	const oldUser = getState().auth.user;
	const user = _.merge({}, oldUser, { data: { settings } });
	dispatch(updateUserData(user));
	return dispatch(setUserData(user));
};

export const updateUserShortcuts = (shortcuts: any) => async (dispatch: Dispatch<any>, getState: any) => {
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

export const logoutUser = () => async (dispatch: Dispatch, getState: any) => {
	const { user } = getState().auth;

	if (!user.role || user.role.length === 0) {
		// is guest
		return null;
	}

	history.push({
		pathname: '/'
	});

	switch (user.from) {
		default: {
			loginService.logout();
		}
	}

	dispatch(setInitialSettings());

	return dispatch(userLoggedOut());
};

export const updateUserData = (user: UserState) => async (dispatch: Dispatch, getState: any) => {
	if (!user.role || user.role.length === 0) {
		// is guest
		return
	}
	switch (user.from) {

		default: {
			loginService
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

const initialState: UserState = {
	role: [], // guest
	data: {
		displayName: 'John Doe',
		photoURL: 'assets/images/avatars/Velazquez.jpg',
		email: 'johndoe@withinpixels.com',
		shortcuts: ['calendar', 'mail', 'contacts', 'todo']
	},
	userType: null,
	userId: null,
	userName: null,
	sessionId: null,

};

const userSlice = createSlice({
	name: 'auth/user',
	initialState,
	reducers: {
		setUser: (state, action) => {

			return action.payload;
		},
		userLoggedOut: (state, action: PayloadAction<undefined>) => initialState
	},
	extraReducers: {}
});

export const { setUser, userLoggedOut } = userSlice.actions;
export default userSlice.reducer;

export const getLoginData = (({ auth: { user } }: { auth: { user: UserState } }) => user);
