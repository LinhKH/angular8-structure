import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

import { LoggedInUser } from '../domain/loggedin.user';


import { SystemConstants } from '../common/system.constants';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient) { }

  login(username: string, password: string) {
		
  }

  logout() {
		localStorage.removeItem(SystemConstants.CURRENT_USER);
  }
  
  isUserAuthenticated(): boolean {
		let user = localStorage.getItem(SystemConstants.CURRENT_USER);
		if (user != null) {
			return true;
		}
		else
			return false;
	}

  getLoggedInUser(): LoggedInUser {
		let user: LoggedInUser;
		if (this.isUserAuthenticated()) {
			var userData = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER));
			user = new LoggedInUser(
				userData.access_token,
				userData.username,
				userData.fullName,
				userData.email,
				userData.avatar,
				userData.roles,
				userData.permissions
			);
		} else
			user = null;
		return user;
	}
}
