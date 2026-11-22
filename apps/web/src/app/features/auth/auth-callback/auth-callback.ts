import { Component, OnInit, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.html',
})
export class AuthCallback implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly token = input<string>();

  ngOnInit(): void {
    this.authService.confirmarLink(this.token() ?? '').subscribe((resultado) => {
      if (resultado === 'valido') {
        void this.router.navigateByUrl('/inicio');
      }
    });
  }
}
