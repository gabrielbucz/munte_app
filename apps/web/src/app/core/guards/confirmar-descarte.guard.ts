import { CanDeactivateFn } from '@angular/router';

export const MENSAGEM_DE_DESCARTE = 'Descartar esta oferta? O que você preencheu será perdido.';

// A tela que tem o que perder ao sair: devolve true quando a saída não precisa de confirmação.
export interface PodeSair {
  podeSair(): boolean;
}

// Vale para qualquer saída pelo Router (link, voltar do navegador, navigate); fechar a aba não passa aqui.
export const confirmarDescarteGuard: CanDeactivateFn<PodeSair> = (tela) =>
  tela.podeSair() || window.confirm(MENSAGEM_DE_DESCARTE);
