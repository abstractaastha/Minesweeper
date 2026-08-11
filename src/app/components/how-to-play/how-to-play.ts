import { Component, HostListener, effect, signal } from '@angular/core';

@Component({
  selector: 'app-how-to-play',
  standalone: true,
  imports: [],
  templateUrl: './how-to-play.html',
  styleUrl: './how-to-play.scss',
})
export class HowToPlay {
  readonly isOpen = signal(false);

  constructor() {
    effect(() => {
      document.body.style.overflow = this.isOpen() ? 'hidden' : '';
    });
  }

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}