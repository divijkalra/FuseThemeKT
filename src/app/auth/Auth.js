import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import jwtService from 'app/main/login/services/loginService';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';
import { setNavigation } from 'app/store/fuse/navigationSlice';
import { useDispatch, useSelector } from 'react-redux';

import { setUserData, logoutUser, getLoginData } from './store/userSlice';
import navigationSlice from 'app/store/fuse/navigationSlice';
import { agentConfig, adminConfig } from 'app/fuse-configs/navigationConfig';
class Auth extends Component {
	state = {
		waitAuthCheck: true
	};

	componentDidMount() {
		return Promise.all([
			// Comment the lines which you do not use
			// this.firebaseCheck(),
			// this.auth0Check(),
			this.jwtCheck()
		]).then(() => {
			this.setState({ waitAuthCheck: false });
			this.setDefaultNavigation();
		});
	}

	setDefaultNavigation = () => {
		/**
		 * Auth login flow
		 * set the nagivation based on user type
		 */
		if (this.props.userData.userName == "Admin") {

			this.props.setNavigation(adminConfig);
		} else {
			this.props.setNavigation(agentConfig);

		}
		//this.props.setNavigation(adminConfig);

	}

	jwtCheck = () =>
		new Promise(resolve => {
			jwtService.on('onAutoLogin', () => {
				this.props.showMessage({ message: 'Logging in with JWT' });

				/**
				 * Sign in and retrieve user data from Api
				 */
				jwtService
					.signInWithToken()
					.then(user => {
						this.props.setUserData(user);

						resolve();

						this.props.showMessage({ message: 'Logged in with JWT' });
					})
					.catch(error => {
						this.props.showMessage({ message: error.message });

						resolve();
					});
			});

			jwtService.on('onAutoLogout', message => {
				if (message) {
					this.props.showMessage({ message });
				}

				this.props.logout();

				resolve();
			});

			jwtService.on('onNoAccessToken', () => {
				resolve();
			});

			jwtService.init();

			return Promise.resolve();
		});




	render() {
		return this.state.waitAuthCheck ? <FuseSplashScreen /> : <>{this.props.children}</>;
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			logout: logoutUser,
			setUserData,
			showMessage,
			hideMessage,
			setNavigation
		},
		dispatch
	);
}
const mapStateToProps = (state, ownProps) => (
	{
		// ... computed data from state and optionally ownProps
		userData: state.auth.user
	})

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
