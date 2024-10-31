import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  // public toastService = inject(ToastService);
  constructor(public toastService: ToastService) { }
  toastClass!: string[];
  toastMessage!: string;
  showsToast!: boolean;
  private time!: any;


  dismiss(): void {
    this.toastService.dismissToast();
  }

}
