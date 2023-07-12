import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-left-side',
  templateUrl: './login-left-side.component.html',
  styleUrls: ['./login-left-side.component.scss']
})
export class LoginLeftSideComponent implements OnInit {

  logoUrl = environment.loginImgPath;
  constructor() { }

  ngOnInit(): void {
  }

}
