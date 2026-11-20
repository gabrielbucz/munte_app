import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(private readonly authService: AuthService) {}

  async canActivate(): Promise<boolean> {
    const { data, error } = await this.authService.getSession();

    if (error || !data?.session) {
      return false;
    }

    return true;
  }
}
