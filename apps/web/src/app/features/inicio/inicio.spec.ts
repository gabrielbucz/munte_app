import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../../core/services/auth.service';
import { Inicio } from './inicio';

describe('Inicio (tela Início)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inicio],
      providers: [
        {
          provide: AuthService,
          useValue: { sessao: signal({ email: 'fulano@alunos.utfpr.edu.br' }) },
        },
      ],
    }).compileComponents();
  });

  it('CA2: mostra o e-mail com que o aluno entrou', async () => {
    const fixture = TestBed.createComponent(Inicio);
    fixture.detectChanges();
    await fixture.whenStable();

    const raiz = fixture.nativeElement as HTMLElement;
    expect(raiz.textContent).toContain('Você entrou como fulano@alunos.utfpr.edu.br');
  });
});
