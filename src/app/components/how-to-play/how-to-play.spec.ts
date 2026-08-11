import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToPlay } from './how-to-play';

describe('HowToPlay', () => {
  let component: HowToPlay;
  let fixture: ComponentFixture<HowToPlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowToPlay],
    }).compileComponents();

    fixture = TestBed.createComponent(HowToPlay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('is closed by default and has no overlay in the DOM', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(component.isOpen()).toBe(false);
    expect(compiled.querySelector('.overlay')).toBeNull();
  });

  it('opens the overlay when the trigger is clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('.trigger')!.click();
    fixture.detectChanges();

    expect(component.isOpen()).toBe(true);
    expect(compiled.querySelector('.overlay')).toBeTruthy();
  });

  it('closes the overlay when the close button is clicked', () => {
    component.open();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('.close-btn')!.click();
    fixture.detectChanges();

    expect(component.isOpen()).toBe(false);
    expect(compiled.querySelector('.overlay')).toBeNull();
  });

  it('closes the overlay on escape', () => {
    component.open();
    fixture.detectChanges();

    component.onEscape();
    fixture.detectChanges();

    expect(component.isOpen()).toBe(false);
  });
});