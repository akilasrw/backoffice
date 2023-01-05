import { ToastrService } from 'ngx-toastr';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { CargoAgentService } from 'src/app/_services/cargo-agent.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-publish-notification',
  templateUrl: './publish-notification.component.html',
  styleUrls: ['./publish-notification.component.scss']
})
export class PublishNotificationComponent implements OnInit {

  keyword = 'value';
  cargoAgents: SelectList[] = [];
  cargoAgentId?: string;
  isLoading: boolean = false;
  notificationForm!: FormGroup;
  @Output() closePopup = new EventEmitter<any>();

  constructor(private cargoAgentService: CargoAgentService,
    private notificationService: NotificationService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initNotificationForm();
    this.loadCargoAgents();
  }

  initNotificationForm() {
    this.notificationForm = new FormGroup({
      cargoAgentId: new FormControl(null, [Validators.required]),
      title: new FormControl(null, [Validators.required, Validators.minLength(1)]),
      body: new FormControl(null, [Validators.required, Validators.minLength(1)]),
    });
  }

  loadCargoAgents() {
    this.isLoading = true;
    this.cargoAgentService.getAgentList()
      .subscribe({
        next: (res) => {
          if (res.length > 0) {
            this.cargoAgents = res;
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
        }
      });
  }

  selectedCargoAgent(value: any) {
    this.notificationForm.get('cargoAgentId')?.patchValue(value.id);
  }

  onClearCargoAgent() {
    this.notificationForm.get('cargoAgentId')?.patchValue(null);
  }

  closeModal() {
    this.notificationForm.reset();
    this.closePopup.emit();
  }

  publish() {
    if (this.notificationForm.get('cargoAgentId')?.value === null || this.notificationForm.get('cargoAgentId')?.value === "") {
      this.toastr.error('Please select cargo agent.');
    }
    if (this.notificationForm.valid) {
      this.isLoading = true;
      this.notificationService.create(this.notificationForm.value).subscribe({
        next: (res) => {
          this.toastr.success('Notification published successfully.');
          this.closeModal();
          this.isLoading = false;
        },
        error: (error) => {
          this.toastr.error('Unable to publish notification.');
          this.isLoading = false;
        }
      });
      this.notificationForm.markAsUntouched();
    } else {
      this.notificationForm.markAsTouched();
    }
  }

}
