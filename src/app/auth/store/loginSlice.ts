import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import jwtService from 'app/main/login/services/loginService';
import { setUserData } from './userSlice';
import { agentConfig, adminConfig } from 'app/fuse-configs/navigationConfig';

import { setNavigation } from 'app/store/fuse/navigationSlice';

/**
	 * Read document https://redux-toolkit.js.org/usage/usage-with-typescript thunk section for detail
	 * 
	 */
export const submitLogin = ({ email, password }: { email: string, password: string }) => async (dispatch: Dispatch<any>) => {
	return jwtService
		.loginWithUserIdAndPassword(email, password)
		.then(user => {
			dispatch(setUserData({
				userId: user.userSessionInfo.userId, userName: user.userSessionInfo.userName, userType: user.userSessionInfo.userType, role: user.userSessionInfo.userType, sessionId: user.userSessionInfo.sessionId, from: "", data: {
					displayName: 'John Doe',
					photoURL: 'assets/images/avatars/Velazquez.jpg',
					email: 'johndoe@withinpixels.com',
					shortcuts: ['calendar', 'mail', 'contacts', 'todo']
				}
			}));
			//TODO do proper check
			if (email == "admin") {
				//check http://react-material.fusetheme.com/documentation/fuse-components/fuse-navigation
				dispatch(setNavigation(adminConfig));

			} else {
				dispatch(setNavigation(agentConfig));

			}
			return dispatch(loginSuccess());
		})
		.catch(error => {

			//set error data 
			dispatch(setUserData({
				userId: "Admin", userName: email, userType: "Admin", role: "Admin", sessionId: "xyzsessionid", from: "", data: {
					displayName: 'John Doe',
					photoURL: 'assets/images/avatars/Velazquez.jpg',
					email: 'johndoe@withinpixels.com',
					shortcuts: ['calendar', 'mail', 'contacts', 'todo']
				}
			}));

			//TODO remove
			if (email == "admin") {
				dispatch(setNavigation(adminConfig));

			} else {
				dispatch(setNavigation(agentConfig));

			}
			return dispatch(loginSuccess());

			//	return dispatch(loginError(error));
		});
};


const initialState = {
	success: false,
	error: {
		username: null,
		password: null
	}
};

const loginSlice = createSlice({
	name: 'auth/login',
	initialState,
	reducers: {
		loginSuccess: (state, action: PayloadAction<undefined>) => {
			state.success = true;
		},
		loginError: (state, action) => {
			state.success = false;
			state.error = action.payload;
			console.log(state.error);
		}
	},
	extraReducers: {}
});

export const { loginSuccess, loginError } = loginSlice.actions;

export default loginSlice.reducer;

