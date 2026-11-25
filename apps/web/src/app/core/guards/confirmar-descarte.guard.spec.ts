import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MENSAGEM_DE_DESCARTE, PodeSair, confirmarDescarteGuard } from './confirmar-descarte.guard';

function executarGuard(tela: PodeSair): ReturnType<typeof confirmarDescarteGuard> {
  return TestBed.runInInjectionContext(() =>
    confirmarDescarteGuard(
      tela,
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot,
      {} as RouterStateSnapshot,
    ),
  );
}

describe('confirmarDescarteGuard', () => {
  afterEach(() => vi.restoreAllMocks());

  it('CA6: quando a tela pode sair, libera sem perguntar', () => {
    const confirmar = vi.spyOn(window, 'confirm');

    expect(executarGuard({ podeSair: () => true })).toBe(true);
    expect(confirmar).not.toHaveBeenCalled();
  });

  it('CA6: quando a tela não pode sair, pergunta "Descartar esta oferta? O que você preencheu será perdido."', () => {
    const confirmar = vi.spyOn(window, 'confirm').mockReturnValue(true);

    executarGuard({ podeSair: () => false });

    expect(MENSAGEM_DE_DESCARTE).toBe('Descartar esta oferta? O que você preencheu será perdido.');
    expect(confirmar).toHaveBeenCalledTimes(1);
    expect(confirmar).toHaveBeenCalledWith(MENSAGEM_DE_DESCARTE);
  });

  it.each([
    ['confirmando', true],
    ['recusando', false],
  ])('CA6: %s a pergunta, o guard devolve %s', (_acao, confirmou) => {
    vi.spyOn(window, 'confirm').mockReturnValue(confirmou);

    expect(executarGuard({ podeSair: () => false })).toBe(confirmou);
  });
});
