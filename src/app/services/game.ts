import { Injectable, computed, signal } from '@angular/core';

export type CellState = {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
};

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export type Difficulty = {
  label: string;
  rows: number;
  cols: number;
  mines: number;
};

export const DIFFICULTIES: Record<string, Difficulty> = {
  beginner: { label: 'Beginner', rows: 9, cols: 9, mines: 10 },
  intermediate: { label: 'Intermediate', rows: 16, cols: 16, mines: 40 },
  expert: { label: 'Expert', rows: 16, cols: 30, mines: 99 },
};

const NEIGHBOR_OFFSETS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];


@Injectable({ providedIn: 'root' })
export class GameService {
  private difficultySignal = signal<Difficulty>(DIFFICULTIES['beginner']);
  private gridSignal = signal<CellState[][]>([]);
  private statusSignal = signal<GameStatus>('idle');
  private flagsPlacedSignal = signal(0);
  private secondsElapsedSignal = signal(0);
  private timerHandle: ReturnType<typeof setInterval> | null = null;

  readonly difficulty = this.difficultySignal.asReadonly();
  readonly grid = this.gridSignal.asReadonly();
  readonly status = this.statusSignal.asReadonly();
  readonly secondsElapsed = this.secondsElapsedSignal.asReadonly();

  readonly minesRemaining = computed(
    () => this.difficultySignal().mines - this.flagsPlacedSignal(),
  );

  constructor() {
    this.newGame(this.difficultySignal());
  }

  newGame(difficulty: Difficulty = this.difficultySignal()): void {
    this.stopTimer();
    this.difficultySignal.set(difficulty);
    this.statusSignal.set('idle');
    this.flagsPlacedSignal.set(0);
    this.secondsElapsedSignal.set(0);
    this.gridSignal.set(this.createEmptyGrid(difficulty));
  }

  reveal(row: number, col: number): void {
    if (this.statusSignal() === 'won' || this.statusSignal() === 'lost') {
      return;
    }

    const cell = this.gridSignal()[row][col];
    if (cell.isRevealed || cell.isFlagged) {
      return;
    }

    if (this.statusSignal() === 'idle') {
      this.placeMines(row, col);
      this.statusSignal.set('playing');
      this.startTimer();
    }

    const grid = this.cloneGrid();
    if (grid[row][col].isMine) {
      this.revealAllMines(grid);
      this.gridSignal.set(grid);
      this.statusSignal.set('lost');
      this.stopTimer();
      return;
    }

    this.floodReveal(grid, row, col);
    this.gridSignal.set(grid);

    if (this.checkWin(grid)) {
      this.statusSignal.set('won');
      this.stopTimer();
    }
  }

  toggleFlag(row: number, col: number): void {
    const status = this.statusSignal();
    if (status === 'won' || status === 'lost') {
      return;
    }

    const cell = this.gridSignal()[row][col];
    if (cell.isRevealed) {
      return;
    }

    if (!cell.isFlagged && this.minesRemaining() <= 0) {
      return;
    }

    const grid = this.cloneGrid();
    grid[row][col] = { ...grid[row][col], isFlagged: !grid[row][col].isFlagged };
    this.gridSignal.set(grid);
    this.flagsPlacedSignal.update((count) => (cell.isFlagged ? count - 1 : count + 1));
  }

  private createEmptyGrid(difficulty: Difficulty): CellState[][] {
    return Array.from({ length: difficulty.rows }, (_, row) =>
      Array.from({ length: difficulty.cols }, (_, col) => ({
        row,
        col,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
      })),
    );
  }

  private placeMines(safeRow: number, safeCol: number): void {
    const { rows, cols, mines } = this.difficultySignal();
    const grid = this.cloneGrid();
    let placed = 0;
    while (placed < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      const isSafeZone = Math.abs(row - safeRow) <= 1 && Math.abs(col - safeCol) <= 1;

      if (isSafeZone || grid[row][col].isMine) {
        continue;
      }

      grid[row][col].isMine = true;
      placed++;
    }

    for (const row of grid) {
      for (const cell of row) {
        if (!cell.isMine) {
          cell.adjacentMines = this.countAdjacentMines(grid, cell.row, cell.col);
        }
      }
    }

    this.gridSignal.set(grid);
  }

  private countAdjacentMines(grid: CellState[][], row: number, col: number): number {
    return this.neighbors(grid, row, col).filter((cell) => cell.isMine).length;
  }

  private neighbors(grid: CellState[][], row: number, col: number): CellState[] {
    const result: CellState[] = [];
    for (const [dr, dc] of NEIGHBOR_OFFSETS) {
      const r = row + dr;
      const c = col + dc;
      if (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length) {
        result.push(grid[r][c]);
      }
    }
    return result;
  }

  private floodReveal(grid: CellState[][], startRow: number, startCol: number): void {
    const stack: Array<[number, number]> = [[startRow, startCol]];

    while (stack.length) {
      const [row, col] = stack.pop()!;
      const cell = grid[row][col];

      if (cell.isRevealed || cell.isFlagged) {
        continue;
      }

      cell.isRevealed = true;

      if (cell.adjacentMines === 0) {
        for (const neighbor of this.neighbors(grid, row, col)) {
          if (!neighbor.isRevealed && !neighbor.isMine) {
            stack.push([neighbor.row, neighbor.col]);
          }
        }
      }
    }
  }

  private revealAllMines(grid: CellState[][]): void {
    for (const row of grid) {
      for (const cell of row) {
        if (cell.isMine) {
          cell.isRevealed = true;
        }
      }
    }
  }

  private checkWin(grid: CellState[][]): boolean {
    return grid.every((row) => row.every((cell) => cell.isMine || cell.isRevealed));
  }

  private cloneGrid(): CellState[][] {
    return this.gridSignal().map((row) => row.map((cell) => ({ ...cell })));
  }

  private startTimer(): void {
    this.stopTimer();
    this.timerHandle = setInterval(() => {
      this.secondsElapsedSignal.update((seconds) => seconds + 1);
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerHandle !== null) {
      clearInterval(this.timerHandle);
      this.timerHandle = null;
    }
  }
}
