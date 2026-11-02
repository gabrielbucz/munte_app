import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-testbed-check',
  template: '<h1>{{ titulo() }}</h1>',
  styles: [],
  standalone: true,
})
class TestBedCheckComponent {
  protected readonly titulo = signal('TestBed funcionando');
}

describe('Angular TestBed (independente do builder)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestBedCheckComponent],
    }).compileComponents();
  });

  it('deve criar o componente via TestBed', () => {
    const fixture = TestBed.createComponent(TestBedCheckComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('deve renderizar o título via TestBed', async () => {
    const fixture = TestBed.createComponent(TestBedCheckComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('TestBed funcionando');
  });
});