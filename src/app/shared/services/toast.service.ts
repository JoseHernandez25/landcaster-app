import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


export interface Toast {
  message: string
  state: "success" | "warning" | "danger",
}
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toast!: Toast;
  public showsToast$: BehaviorSubject<string> = new BehaviorSubject<string>('init');
  public toastMessage$: BehaviorSubject<string> = new BehaviorSubject<string>('Default toast message');
  public toastState$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private toastTimeout: any;
  private isPaused: boolean = false;

  constructor() { }

  showToast(body: Toast): void {
    this.toastState$.next(body.state);
    this.toastMessage$.next(body.message);
    this.showsToast$.next('show');

    // Limpia el temporizador si existe
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    // Configura el nuevo temporizador para ocultar el toast después de 3000 milisegundos (ajusta según sea necesario)
    this.toastTimeout = setTimeout(() => {
      if (!this.isPaused) {
        this.dismissToast();
      }
    }, 3000);
  }

  // Método para pausar o reanudar el temporizador
  togglePause(): void {
    this.isPaused = !this.isPaused;
  }

  dismissToast(): void {
    this.showsToast$.next('hide');
    // Limpia el temporizador para evitar la ocultación automática después de la ocultación manual
    clearTimeout(this.toastTimeout);
  }


}
