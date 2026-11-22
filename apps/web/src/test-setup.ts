// Setup global dos testes, carregado pelo builder `@angular/build:unit-test` (angular.json → test.options.setupFiles).
//
// A partir do Node 25, o próprio Node define `localStorage` e `sessionStorage` no escopo global.
// Sem a flag `--localstorage-file`, esses globais valem `undefined` e escondem os do jsdom,
// e todo código que usa o storage quebra no teste com
// "Cannot read properties of undefined (reading 'getItem')".
// Aqui religamos os dois globais à janela do jsdom, que o Vitest expõe como `jsdom`.
// Em Node 22/24 o storage já funciona, e o bloco não faz nada.

interface AmbienteJsdom {
  jsdom?: { window: Pick<Window, 'localStorage' | 'sessionStorage'> };
  localStorage?: Storage;
  sessionStorage?: Storage;
}

const ambiente = globalThis as unknown as AmbienteJsdom;
const janelaJsdom = ambiente.jsdom?.window;

if (janelaJsdom) {
  for (const nome of ['localStorage', 'sessionStorage'] as const) {
    if (ambiente[nome] === undefined) {
      Object.defineProperty(globalThis, nome, {
        configurable: true,
        get: () => janelaJsdom[nome],
      });
    }
  }
}
