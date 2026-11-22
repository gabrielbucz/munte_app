describe('Ambiente de teste', () => {
  afterEach(() => localStorage.clear());

  it('oferece um localStorage que grava, lê e limpa (Node 25+ esconde o do jsdom)', () => {
    localStorage.setItem('munte.teste', 'ok');
    expect(localStorage.getItem('munte.teste')).toBe('ok');
    expect(localStorage.length).toBe(1);

    localStorage.clear();
    expect(localStorage.getItem('munte.teste')).toBeNull();
  });

  it('expõe o mesmo localStorage em window e em document.defaultView', () => {
    window.localStorage.setItem('munte.teste', 'ok');
    expect(document.defaultView?.localStorage.getItem('munte.teste')).toBe('ok');
  });
});
