import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CryptoService } from 'src/app/core/services/crypto.service';
import { AuthenticateRM } from 'src/app/_models/request-models/login/authenticate-rm.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  returnUrl = '';
  public loginForm!: FormGroup;
  isSubmitting = false;
  show: boolean = false;
  logoUrl = environment.loginImgPath;

  constructor(public accountService: AccountService,
    private router: Router,
    private cryptoService: CryptoService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.initializeForm();
    //this.verifyUserLogin();
  }

  initializeForm() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      rememberMe: new FormControl(null)
    });
    this.setSavedCredentials();
  }

  // verifyUserLogin(){
  //   if(this.accountService.verifyLogin())
  //     this.router.navigate([this.returnUrl]);
  // }

  setSavedCredentials(){
    let userCredential: AuthenticateRM;
    const userCredentialValue = localStorage.getItem('UserCredential');
    if (userCredentialValue && userCredentialValue != "null") {
      var decUserCredential = this.cryptoService.decrypt(userCredentialValue);
      userCredential = JSON.parse(decUserCredential);
      if(userCredential.rememberMe){
        this.loginForm.get('username')?.patchValue(userCredential.username);
        this.loginForm.get('password')?.patchValue(userCredential.password);
      }
    }
  }

  login() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.accountService.login(this.loginForm.value).subscribe({
        next:(res)=>{
          this.router.navigate([this.returnUrl]);
          this.isSubmitting = false;
          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },
        error:(err)=>{
          this.isSubmitting = false;
        }
      })
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
