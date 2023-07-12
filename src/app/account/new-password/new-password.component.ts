import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {

  public passwordForm!: FormGroup;
  logoUrl = environment.loginImgPath;

  constructor() { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.passwordForm = new FormGroup({
      password: new FormControl(null, [Validators.required]),
      confirmPassword: new FormControl(null, [Validators.required]),
    });
  }

}
