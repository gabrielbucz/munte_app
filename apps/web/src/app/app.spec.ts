import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { App } from './app';

@Component({
  selector: 'app-tela-teste',
  template: '<p>Conteúdo da tela de teste</p>',
})
class TelaTeste {}

describe('App (App Shell)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([{ path: 'tela-teste', component: TelaTeste }])],
    }).compileComponents();
  });

  it('CA7: renderiza a tela da rota ativa no palco central, entre o cabeçalho e o rodapé', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/tela-teste');
    fixture.detectChanges();
    await fixture.whenStable();

    const raiz = fixture.nativeElement as HTMLElement;
    const filhos = Array.from(raiz.children).map((elemento) => elemento.tagName.toLowerCase());
    expect(filhos).toEqual(['app-header', 'main', 'app-footer']);

    const palco = raiz.querySelector('main');
    expect(palco?.querySelector('app-tela-teste')?.textContent).toContain(
      'Conteúdo da tela de teste',
    );
  });
});
