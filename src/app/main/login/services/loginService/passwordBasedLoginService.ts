import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
/* eslint-disable camelcase */
import APiHelper from 'packages/api-helper';

export interface LoginResponse {
	"requestId": string,
	"contactCenterId": number,
	"userSessionInfo": {
		"userId": string,
		"terminalInfo": null,
		"sessionId": string,
		"loginTime": number,
		"userType": string,
		"lastLoginInfo": {
			"userId": string,
			"userName": string,
			"lastLoginTime": number,
			"lastLogoutTime": number,
			"sessionId": string,
			"localIp": string,
			"publicIp": string,
			"clientType": string,
			"clientVersion": string,
			"browserInfo": any
		},
		"publicIp": string,
		"clientType": string,
		"clientVersion": string,
		"browserInfo": string,
		"authenticationPolicy": string,
		"userName": string,
		"rootUser": boolean
	},
	"authenticationState": {
		"userId": string,
		"authPolicyVsUserAuthState": any,
		"authPolicyVsUserInfo": {
			"auth.type.passwd": {
				"userId": string,
				"sessionId": string,
				"properties": {
					"passwordStateDetail": {
						"reason": string,
						"passwordValid": boolean,
						"warnUser": boolean,
						"shouldChangePassword": boolean
					}
				},
				"loginProperties": any
			}
		}
	}
}


interface LoginRequestInputBean {
	userId: string,
	token: string,
	domain: string
	forceLogin?: boolean,
	properties?: any,
	captchaAuthenticationInputBean?: any,
	locale?: string

}

interface UserBean {
	token: string
	userId: String
	terminalInfo: String
	sessionId: String
	loginTime: any
	userType: String
	contactCenterId: number
	userName: String
	passwordStateDetail: any
	loginProperties: any
	lastLoginDetail: any

}



class JwtService extends FuseUtils.EventEmitter {
	init() {
		this.setInterceptors();
		this.handleAuthentication();
	}

	setInterceptors = () => {
		APiHelper.interceptors.response.use(
			response => {
				return response;
			},
			err => {
				return new Promise((resolve, reject) => {
					if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
						// if you ever get an unauthorized response, logout the user
						this.emit('onAutoLogout', 'Invalid access_token');
						this.setSession(null);
					}
					throw err;
				});
			}
		);
	};

	handleAuthentication = () => {
		const access_token = this.getAccessToken();

		if (!access_token) {
			this.emit('onNoAccessToken');

			return;
		}

		if (this.isAuthTokenValid(access_token)) {
			this.setSession(access_token);
			this.emit('onAutoLogin', true);
		} else {
			this.setSession(null);
			this.emit('onAutoLogout', 'access_token expired');
		}
	};


	loginWithUserIdAndPassword = (userName: string, password: string) => {
		return new Promise<LoginResponse>((resolve, reject) => {

			let inputData: LoginRequestInputBean = { domain: window.location.hostname, token: password, userId: userName, forceLogin: true };
			let url = "http://localhost:8888/ameyorestapi/userLogin/login";
			//let data = {"domain":"localhost", "userId":userName, "token":password, "userDetails":null, "clientType":null, "clientVersion":null, "forceLogin":true, "properties":null, "captchaAuthenticationInputBean":null, "requestId":null};

			APiHelper
				.post(url,
					inputData
				)
				.then(response => {
					if (response.data.userSessionInfo) {
						// this.setSession(response.data.access_token);
						// resolve(response.data.user);
						this.setSession(response.data.userSessionInfo.sessionId);
						//resolve({redirectUrl:"/example",data:{settings:{},displayName:response.data.userSessionInfo.userId,sessionId:response.data.userSessionInfo.sessionId}});
						resolve(response.data);
					} else {

						// this.setSession("meraTokenhyeto");
						// resolve({redirectUrl:"/example"});
						reject(response.data.error);
					}
				}).catch(error => {
					// AmeyoLogger.log("sss")
					reject(error);
				});

		});

	}

	signInWithEmailAndPassword = (email: string, password: string) => {
		return new Promise((resolve, reject) => {
			axios
				.get('/api/auth', {
					data: {
						email,
						password
					}
				})
				.then(response => {
					if (response.data.user) {
						this.setSession(response.data.access_token);
						resolve(response.data.user);
					} else {
						reject(response.data.error);
					}
				});
		});
	};

	signInWithToken = () => {
		return new Promise((resolve, reject) => {
			axios
				.get('/api/auth/access-token', {
					data: {
						access_token: this.getAccessToken()
					}
				})
				.then(response => {
					if (response.data.user) {
						this.setSession(response.data.access_token);
						resolve(response.data.user);
					} else {
						this.logout();
						reject(new Error('Failed to login with token.'));
					}
				})
				.catch(error => {
					this.logout();
					reject(new Error('Failed to login with token.'));
				});
		});
	};

	updateUserData = (user: any) => {
		return axios.post('/api/auth/user/update', {
			user
		});
	};

	setSession = (sessionId?: string | null) => {
		if (sessionId) {
			localStorage.setItem('sessionId', sessionId);
			APiHelper.defaults.headers.common["sessionId"] = `${sessionId}`;
		} else {
			localStorage.removeItem('sessionId');
			delete APiHelper.defaults.headers.common.Authorization;
		}
	};

	logout = () => {
		this.setSession(null);
	};

	isAuthTokenValid = (access_token: string) => {
		if (!access_token) {
			return false;
		}


		return true;
	};

	getAccessToken = () => {
		return window.localStorage.getItem('sessionId');
	};
}

const instance = new JwtService();

export default instance;
