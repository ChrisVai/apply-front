import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { StorageService } from '../shared/services/storage/storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const storageService: StorageService = inject(StorageService);
  const router: Router = inject(Router);

  if (storageService.getUserId() === null) {
    router.navigateByUrl('/auth');
    return false;
  }
  return true;
};
