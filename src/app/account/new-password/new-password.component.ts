import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AccountService } from '../account.service';
import { UserPasswordRm } from 'src/app/_models/request-models/login/user-password-rm.model';
import { User } from 'src/app/_models/user.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {

  public passwordForm!: FormGroup;
  logoUrl = environment.loginImgPath;
  user: UserPasswordRm = new UserPasswordRm();
  isLoading: boolean = false;
  appUserId?: string;

  constructor(private accountService: AccountService,
    private route: ActivatedRoute,
    private tsr: ToastrService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.route.params.subscribe(params => { debugger
      this.passwordForm.get('appUserId')?.patchValue(params['id']);
    });
  }

  initializeForm() {
    this.passwordForm = new FormGroup({
      appUserId: new FormControl(null),
      password: new FormControl(null, [Validators.required]),
      confirmPassword: new FormControl(null, [Validators.required]),
    });
  }

  save() {
    if(this.passwordForm.valid) {
      this.isLoading = true;
      this.user = this.passwordForm.value;
      this.accountService.updatePassword(this.user).subscribe(
        {
          next: (res) => { console.log(res)
            this.tsr.success('Password successfully updated. Please login again.');
            this.accountService.logout();
            this.isLoading = false;
          },
          error: (err) => {
            this.isLoading = false;
          }
        });
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }
}
