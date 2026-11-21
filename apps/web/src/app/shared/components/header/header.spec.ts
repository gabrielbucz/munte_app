import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Header } from './header';

describe('Header', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('CA7: mostra o link "Entrar" na barra superior, apontando para /entrar', async () => {
    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();
    await fixture.whenStable();

    const raiz = fixture.nativeElement as HTMLElement;
    const links = Array.from(raiz.querySelectorAll<HTMLAnchorElement>('header nav a'));
    const entrar = links.find((link) => link.textContent?.trim() === 'Entrar');

    expect(entrar).toBeTruthy();
    expect(entrar?.getAttribute('href')).toBe('/entrar');
  });
});
