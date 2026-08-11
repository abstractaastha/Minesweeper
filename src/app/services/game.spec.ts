import { TestBed } from '@angular/core/testing';

import { DIFFICULTIES, GameService } from './game';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('starts with a fresh, unrevealed beginner grid', () => {
    const grid = service.grid();
    expect(grid.length).toBe(DIFFICULTIES['beginner'].rows);
    expect(grid[0].length).toBe(DIFFICULTIES['beginner'].cols);
    expect(service.status()).toBe('idle');
    expect(service.minesRemaining()).toBe(DIFFICULTIES['beginner'].mines);
    expect(grid.every((row) => row.every((cell) => !cell.isRevealed && !cell.isMine))).toBe(true);
  });

  it('places mines away from the first revealed cell and starts playing', () => {
    service.reveal(4, 4);

    const grid = service.grid();
    expect(grid[4][4].isMine).toBe(false);
    expect(grid[4][4].isRevealed).toBe(true);
    expect(service.status()).toBe('playing');
  });

  it('flags and unflags a hidden cell, adjusting the remaining mine count', () => {
    const initialRemaining = service.minesRemaining();

    service.toggleFlag(0, 0);
    expect(service.grid()[0][0].isFlagged).toBe(true);
    expect(service.minesRemaining()).toBe(initialRemaining - 1);

    service.toggleFlag(0, 0);
    expect(service.grid()[0][0].isFlagged).toBe(false);
    expect(service.minesRemaining()).toBe(initialRemaining);
  });

  it('does not reveal a flagged cell', () => {
    service.toggleFlag(0, 0);
    service.reveal(0, 0);
    expect(service.grid()[0][0].isRevealed).toBe(false);
  });

  it('starting a new game resets status, flags, and timer', () => {
    service.reveal(4, 4);
    service.toggleFlag(0, 0);

    service.newGame();

    expect(service.status()).toBe('idle');
    expect(service.secondsElapsed()).toBe(0);
    expect(service.minesRemaining()).toBe(DIFFICULTIES['beginner'].mines);
  });

  it('switches difficulty and resizes the grid', () => {
    service.newGame(DIFFICULTIES['intermediate']);

    const grid = service.grid();
    expect(grid.length).toBe(DIFFICULTIES['intermediate'].rows);
    expect(grid[0].length).toBe(DIFFICULTIES['intermediate'].cols);
    expect(service.minesRemaining()).toBe(DIFFICULTIES['intermediate'].mines);
  });
});
