import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cell } from './cell';
import type { CellState } from '../../services/game';

const buildCell = (overrides: Partial<CellState> = {}): CellState => ({
  row: 0,
  col: 0,
  isMine: false,
  isRevealed: false,
  isFlagged: false,
  adjacentMines: 0,
  ...overrides,
});

describe('Cell', () => {
  let component: Cell;
  let fixture: ComponentFixture<Cell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cell],
    }).compileComponents();

    fixture = TestBed.createComponent(Cell);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('cell', buildCell());
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows no label for a hidden, unflagged cell', () => {
    expect(component.label()).toBe('');
  });

  it('shows a flag icon for a flagged cell', () => {
    fixture.componentRef.setInput('cell', buildCell({ isFlagged: true }));
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('img[alt="flag"]')).toBeTruthy();
  });

  it('shows a mine icon for a revealed mine', () => {
    fixture.componentRef.setInput('cell', buildCell({ isRevealed: true, isMine: true }));
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('img[alt="mine"]')).toBeTruthy();
    expect(component.label()).toBe('');
  });

  it('shows the adjacent mine count once revealed', () => {
    fixture.componentRef.setInput('cell', buildCell({ isRevealed: true, adjacentMines: 3 }));
    fixture.detectChanges();
    expect(component.label()).toBe('3');
  });

  it('emits reveal when clicked and the game is still active', () => {
    let revealed = false;
    component.reveal.subscribe(() => (revealed = true));

    component.onClick();

    expect(revealed).toBe(true);
  });

  it('does not emit reveal once the game is over', () => {
    fixture.componentRef.setInput('gameOver', true);
    fixture.detectChanges();

    let revealed = false;
    component.reveal.subscribe(() => (revealed = true));

    component.onClick();

    expect(revealed).toBe(false);
  });
});
