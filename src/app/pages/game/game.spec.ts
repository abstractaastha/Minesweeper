import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Game } from './game';

describe('Game', () => {
  let component: Game;
  let fixture: ComponentFixture<Game>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Game],
    }).compileComponents();

    fixture = TestBed.createComponent(Game);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the header and board', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-game-header')).toBeTruthy();
    expect(compiled.querySelector('app-board')).toBeTruthy();
  });

  it('renders the how-to-play trigger and the footer credit', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-how-to-play')).toBeTruthy();
    expect(compiled.querySelector('.footer')?.textContent).toContain('Aastha');
  });
});