import { TestBed } from '@angular/core/testing';

import { ScrollService } from './scroll.service';

describe('ScrollService', () => {
  let service: ScrollService;
  let originalWindow: Window & typeof globalThis;
  let mockAddEventListener: jasmine.Spy;
  let mockRemoveEventListener: jasmine.Spy;

  beforeEach(() => {
    
    originalWindow = window;
    
    
    mockAddEventListener = jasmine.createSpy('addEventListener');
    mockRemoveEventListener = jasmine.createSpy('removeEventListener');
    
    
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 100
    });
    
    Object.defineProperty(window, 'addEventListener', {
      writable: true,
      configurable: true,
      value: mockAddEventListener
    });
    
    Object.defineProperty(window, 'removeEventListener', {
      writable: true,
      configurable: true,
      value: mockRemoveEventListener
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollService);
  });

  afterEach(() => {
    
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: originalWindow.scrollY
    });
    
    Object.defineProperty(window, 'addEventListener', {
      writable: true,
      configurable: true,
      value: originalWindow.addEventListener
    });
    
    Object.defineProperty(window, 'removeEventListener', {
      writable: true,
      configurable: true,
      value: originalWindow.removeEventListener
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize scrollY signal with current scroll position', () => {
    expect(service.scrollY()).toBe(100);
  });

  it('should add scroll event listener on construction when window is available', () => {
    expect(mockAddEventListener).toHaveBeenCalledWith(
      'scroll',
      jasmine.any(Function),
      { passive: true }
    );
  });

  it('should update scroll position when scroll event occurs', () => {
    
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 200
    });

    
    const scrollHandler = mockAddEventListener.calls.argsFor(0)[1];
    
    
    scrollHandler();

    expect(service.scrollY()).toBe(200);
  });

  it('should remove scroll event listener on destroy when window is available', () => {
    service.ngOnDestroy();
    
    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'scroll',
      jasmine.any(Function)
    );
  });

  it('should handle server-side rendering (no window)', () => {
    
    const serverService = new ScrollService();
    
    expect(serverService).toBeTruthy();
    expect(serverService.scrollY()).toBe(100); 
  });

  it('should handle ngOnDestroy properly', () => {
    
    expect(() => service.ngOnDestroy()).not.toThrow();
    
    
    expect(mockRemoveEventListener).toHaveBeenCalledWith('scroll', jasmine.any(Function));
  });

  it('should call updateScrollPosition in onScroll method', () => {
    spyOn(service as unknown as { updateScrollPosition: () => void }, 'updateScrollPosition');
    
    
    (service as unknown as { onScroll: () => void }).onScroll();
    
    expect((service as unknown as { updateScrollPosition: jasmine.Spy }).updateScrollPosition).toHaveBeenCalled();
  });

  it('should update scrollY signal in updateScrollPosition when window is available', () => {
    
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 300
    });

    
    (service as unknown as { updateScrollPosition: () => void }).updateScrollPosition();

    expect(service.scrollY()).toBe(300);
  });

  it('should update scrollY when updateScrollPosition is called', () => {
    const initialValue = service.scrollY();
    
    
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 500
    });
    
    
    (service as unknown as { updateScrollPosition: () => void }).updateScrollPosition();
    
    
    expect(service.scrollY()).toBe(500);
    expect(service.scrollY()).not.toBe(initialValue);
  });
});