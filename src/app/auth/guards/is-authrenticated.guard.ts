import { CanActivateFn } from '@angular/router';

export const isAuthrenticatedGuard: CanActivateFn = (route, state) => {
  return true;
};
