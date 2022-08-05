import FuseUtils from '@fuse/utils/FuseUtils';
import { createApi } from 'app/components/ApiClient';
import axios  from 'axios';
import jwtDecode from 'jwt-decode';
import Config from '../Config';
/* eslint-disable camelcase */


class JwtService extends FuseUtils.EventEmitter {
	init() {
		this.setInterceptors();
		this.handleAuthentication();
	}

	setInterceptors = () => {
		axios.interceptors.response.use(
			response => {
				return response;
			},
			(error) => {  console.log(error)
				return new Promise((resolve, reject) => {

					if (error.message === 'Network Error' && !error.response) {
						console.log("Network Error - make sure API is running")
					}
					const { status ,data, config} = error.response;

					if(status === 400) {

						//history.push('/notfound')
					}
					if(status === 404) {
						//history.push('/notfound')
					}
					if(status === 500) {

						//history.push('/notfound')
					}
					if(status === 401 ) {
						//history.push('/notfound')
					}
					if (error.response.status === 401 && error.config && !error.config.__isRetryRequest) {
						// if you ever get an unauthorized response, logout the user
						this.emit('onAutoLogout', 'Invalid access_token');
						this.setSession(null);
					}
					//alert(JSON.stringify(err))

					throw error;
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

	createUser = data => {
		return new Promise((resolve, reject) => {
			createApi(Config.AUTH_API_URL)
			.post('/api/auth/register', data).then(response => {
				if (response.data.user) {
					this.setSession(response.data.access_token);
					resolve(response.data.user);
				} else {
					//reject(response.data.error);

				}
			});
		});
	};
	// Giriş Yapma

	signInWithEmailAndPassword = (email, password) => {

		return new Promise((resolve, reject) => {
			createApi(Config.AUTH_API_URL)
				.post('/auth/signin', {
					email,
					password
				})
				.then(response => {
					//console.log(response.data);
					if (response.data) {
						this.setSession(response.data.accessToken);
						resolve(response.data.user);
					} else {
						reject(response.data.error);

					}
				})/*.catch(error=>  {

					if (error.message === 'Network Error' && !error.response) {
						this.emit('onAutoLogout', 'Network Error - Backend Uygulama Çalışmıyor');
						console.log("Network Error - make sure API is running")
					}
					console.log(error)
				})*/

		});
	};

	signInWithToken = () => {

		return new Promise((resolve, reject) => {
			createApi(Config.AUTH_API_URL)
				.post('/api/user/access-token', JSON.stringify({
						access_token: this.getAccessToken()

				}))
				.then(response => {
					if (response.data.user) {
						this.setSession(response.data.accessToken);
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

	updateUserData = user => {
		return axios.post('/api/auth/user/update', {
			user
		});
	};

	setSession = access_token => {
		if (access_token) {
			sessionStorage.setItem('jwt_access_token', access_token);
			axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
		} else {
			sessionStorage.removeItem('jwt_access_token');
			sessionStorage.removeItem('companyId');
			sessionStorage.removeItem('clientId');
			delete axios.defaults.headers.common.Authorization;
		}
	};

	logout = () => {
		this.setSession(null);
	};

	isAuthTokenValid = access_token => {
		if (!access_token) {
			return false;
		}
		const decoded = jwtDecode(access_token);
		const currentTime = Date.now() / 1000;
		if (decoded.exp < currentTime) {
			console.warn('access token expired');
			return false;
		}

		return true;
	};

	getAccessToken = () => {
		return window.sessionStorage.getItem('jwt_access_token');
	};

	responseHandler = (response) => {
		// console.log("responseHandler response:", response);

		const status =
		  response.request.responseURL.indexOf("login") !== -1
			? response.status
			: response.data.statusCode;

		switch (status) {
		  case 200:
		  case 201:
			return { response: response.data, error: null };
		  case 204:
		  case 400:
		  case 401:
		  case 404:
		  case 500:
		  case 503:
			return { response: null, error: response.data };
		  default:
			return response.data;
		}
	  };


}

const instance = new JwtService();

export default instance;
