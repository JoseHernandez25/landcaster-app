import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationModalService {

  constructor(private modalService: NgbModal) { }

  openConfirmationModal(message: string): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.message = message;
    return modalRef.result.then((result) => result === 'confirm');
  }}
