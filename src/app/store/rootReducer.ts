import { combineReducers } from '@reduxjs/toolkit';
import auth from 'app/auth/store';
import fuse from './fuse';
import i18n from './i18nSlice';
import orders from './orderSli';
const commonReducer = combineReducers({
	auth: auth,
	fuse: fuse,
	i18n: i18n,
	orders: orders
});


const createReducer = (asyncReducers: any) =>
	combineReducers({
		auth: auth,
		fuse: fuse,
		orders: orders,
		i18n: i18n, ...asyncReducers
	});

export type RootStore = ReturnType<typeof createReducer>;
export default createReducer;
