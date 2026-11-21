import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface LinkNavegacao {
  rotulo: string;
  caminho: string;
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
})
export class Header {
  protected readonly links: readonly LinkNavegacao[] = [{ rotulo: 'Entrar', caminho: '/entrar' }];
}
