import { Component, signal } from '@angular/core';
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
  // O link "Oferecer carona" aparece sempre: o Header não conhece a sessão (shared/ não importa
  // core/); sem sessão, o authGuard da rota leva à tela Entrar.
  protected readonly links: readonly LinkNavegacao[] = [
    { rotulo: 'Entrar', caminho: '/entrar' },
    { rotulo: 'Oferecer carona', caminho: '/ofertas/nova' },
  ];

  protected readonly menuAberto = signal(false);

  protected alternarMenu(): void {
    this.menuAberto.update((aberto) => !aberto);
  }

  protected fecharMenu(): void {
    this.menuAberto.set(false);
  }
}
