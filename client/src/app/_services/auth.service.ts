import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../_models/user';
import { environment } from '../../environments/environment';
import { EndPointApi } from '../_helpers/endpointapi';

@Injectable()
export class AuthService {

	private currentUser: UserProfile;
	private endPointConfig: string = EndPointApi.getURL();

	constructor(private http: HttpClient) { 
		let user = JSON.parse(localStorage.getItem('currentUser'));
		if (user) {
		  this.currentUser = user;
		}
	}

	signIn(username: string, password: string) {
		return new Observable((observer) => {
			if (environment.serverEnabled) {
				let header = new HttpHeaders({ 'Content-Type': 'application/json' });
				return this.http.post(this.endPointConfig + '/api/signin', { username: username, password: password }).subscribe((result: any) => {
					if (result) {
						this.currentUser = <UserProfile>result.data;
						this.saveUserToken(this.currentUser)
					}
					observer.next();
				}, err => {
					console.log(err);
					observer.error(err);
				});
			} else {
				observer.next();
			}
		});

	}

	signOut() {
		this.removeUser();
	}

	getUser(): User {
		return this.currentUser;
	}

	getUserToken(): string {
		if (this.currentUser) {
			return this.currentUser.token;
		} else {
			return null;
		}
	}

	// to check by page refresh
	private saveUserToken(user: UserProfile) {
		localStorage.setItem('currentUser', JSON.stringify(user));
	}

	private removeUser() {
		this.currentUser = null;
		localStorage.removeItem('currentUser');
	}
}

export class UserProfile extends User {
	token: string;
}