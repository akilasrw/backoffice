import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor() { }

  login(model: any) {
    // return this.http.post(this.baseUrl + 'user/authenticate', model, { withCredentials: true }).pipe(
    //   map((response: any) => {
    //     const user = response;
    //     if (user) {
    //       this.setCurrentUser(user);
    //       return user;
    //     }
    //   })
    // )
  }
}
