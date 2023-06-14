import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseService } from '../core/services/base.service';
import { User } from '../_models/user.model';
import { Router } from '@angular/router';
import { CryptoService } from '../core/services/crypto.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenData } from '../_models/token-data.model';
import { AuthenticateRM } from '../_models/request-models/login/authenticate-rm.model';


@Injectable({
  providedIn: 'root'
})
export class AccountService  extends BaseService {
  baseUrl = environment.baseEndpoint;
  private currentUserSource: BehaviorSubject<User|null>;
  currentUser$: Observable<User| null>;

  constructor(http: HttpClient,
    private cryptoService: CryptoService,
    private router: Router) {
    super(http);
    this.currentUserSource = new BehaviorSubject<User|null>(null);
    this.currentUser$ = this.currentUserSource.asObservable();
  }

  login(model: AuthenticateRM) {
    return this.http.post(this.baseUrl + 'user/authenticate', model, { withCredentials: true }).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
          this.saveUserCredential(model);
          return user;
        }
      })
    )
  }

  refreshToken(token?: string) {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }
    return this.http.post(this.baseUrl + 'user/refresh-token', '"' + token + '"', httpOptions).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
          return user;
        }
      })
    )
  }

  logout(optionalErrorMessage? : string) {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.router.navigate(['/account']);
  }

  verifyLogin(){
    const userValue = localStorage.getItem('user');
    if (userValue && userValue != "null") {
      return true;
    }
    return false;
  }

  setCurrentUser(user: User) {
    this.startRefreshTokenTimer(user);
    var enriptedUser = this.cryptoService.encrypt(JSON.stringify(user));
    localStorage.setItem('user', enriptedUser);
    this.currentUserSource.next(user);
  }

  removeCurrentUser() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  getDecodedToken(token: string) {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken<TokenData>(token);
    return decodedToken;
  }

 private refreshTokenTimeout: any;

  private startRefreshTokenTimer(user: User) {
      // parse json object from base64 encoded jwt token
      const jwtToken = JSON.parse(atob(user.jwtToken.split('.')[1]));

      // set a timeout to refresh the token a minute before it expires
      const expires = new Date(jwtToken.exp * 1000);
      const timeout = expires.getTime() - Date.now() - (60 * 1000);
      this.refreshTokenTimeout = setTimeout(() => this.refreshToken(user.refreshToken).subscribe(), timeout);
  }

  saveUserCredential(model: AuthenticateRM){
    if(model.rememberMe){
      var enriptedCredentil = this.cryptoService.encrypt(JSON.stringify(model));
      localStorage.setItem('UserCredential', enriptedCredentil);
    }else{
      localStorage.removeItem('UserCredential');
    }
  }

}
