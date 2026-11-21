import { TestBed } from '@angular/core/testing';
import { Footer } from './footer';

describe('Footer', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
    }).compileComponents();
  });

  it('CA7: renderiza o rodapé da App Shell com o nome do app', async () => {
    const fixture = TestBed.createComponent(Footer);
    fixture.detectChanges();
    await fixture.whenStable();

    const rodape = (fixture.nativeElement as HTMLElement).querySelector('footer');
    expect(rodape?.textContent).toContain('Munte-app');
  });
});
