import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Header } from './header';

@Component({ template: '' })
class TelaEntrarDeTeste {}

describe('Header', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([{ path: 'entrar', component: TelaEntrarDeTeste }])],
    }).compileComponents();
  });

  async function criarHeader(): Promise<{ fixture: ComponentFixture<Header>; raiz: HTMLElement }> {
    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();
    await fixture.whenStable();
    return { fixture, raiz: fixture.nativeElement as HTMLElement };
  }

  function botaoMenu(raiz: HTMLElement): HTMLButtonElement {
    const botao = raiz.querySelector<HTMLButtonElement>('button[aria-controls="gaveta-navegacao"]');
    expect(botao).toBeTruthy();
    return botao!;
  }

  function gaveta(raiz: HTMLElement): HTMLElement | null {
    return raiz.querySelector<HTMLElement>('#gaveta-navegacao');
  }

  function linkEntrarDaGaveta(raiz: HTMLElement): HTMLAnchorElement | undefined {
    const links = Array.from(gaveta(raiz)?.querySelectorAll<HTMLAnchorElement>('a') ?? []);
    return links.find((link) => link.textContent?.trim() === 'Entrar');
  }

  it('CA7: mostra o link "Entrar" na barra superior, apontando para /entrar', async () => {
    const { raiz } = await criarHeader();

    const links = Array.from(raiz.querySelectorAll<HTMLAnchorElement>('header nav a'));
    const entrar = links.find((link) => link.textContent?.trim() === 'Entrar');

    expect(entrar).toBeTruthy();
    expect(entrar?.getAttribute('href')).toBe('/entrar');
  });

  it('CA8: com a gaveta fechada, tocar no ☰ abre a gaveta e mostra o link "Entrar"', async () => {
    const { fixture, raiz } = await criarHeader();

    expect(gaveta(raiz)).toBeNull();
    expect(botaoMenu(raiz).getAttribute('aria-expanded')).toBe('false');

    botaoMenu(raiz).click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(gaveta(raiz)).toBeTruthy();
    expect(botaoMenu(raiz).getAttribute('aria-expanded')).toBe('true');
    expect(linkEntrarDaGaveta(raiz)?.getAttribute('href')).toBe('/entrar');
  });

  it('CA9: com a gaveta aberta, tocar em "Entrar" fecha a gaveta e navega para /entrar', async () => {
    const { fixture, raiz } = await criarHeader();
    botaoMenu(raiz).click();
    fixture.detectChanges();
    await fixture.whenStable();

    const entrar = linkEntrarDaGaveta(raiz);
    expect(entrar).toBeTruthy();
    entrar!.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(gaveta(raiz)).toBeNull();
    expect(botaoMenu(raiz).getAttribute('aria-expanded')).toBe('false');
    expect(TestBed.inject(Router).url).toBe('/entrar');
  });
});
