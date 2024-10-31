import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss'
})
export class ConfirmationModalComponent {
  @Input() message: string = '';

  constructor(public activeModal: NgbActiveModal) {}

  confirm() {
    this.activeModal.close('confirm');
  }

  dismiss() {
    this.activeModal.dismiss('cancel');
  }
}
