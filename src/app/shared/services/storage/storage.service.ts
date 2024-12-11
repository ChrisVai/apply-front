import { Injectable } from '@angular/core';

const USER_ID_KEY = btoa('auth-user-id');
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  saveUserId(userId: number) {
    if (this.getUserId()) {
      localStorage.removeItem(USER_ID_KEY);
    }
    localStorage.setItem(USER_ID_KEY, btoa(JSON.stringify(userId)));
  }

  getUserId(): number | null {
    const userIdAsString: string | null = localStorage.getItem(USER_ID_KEY);
    if (userIdAsString !== null) {
      return parseInt(atob(userIdAsString));
    } else {
      return null;
    }
  }

  deleteUserId() {
    localStorage.removeItem(USER_ID_KEY);
  }
}
