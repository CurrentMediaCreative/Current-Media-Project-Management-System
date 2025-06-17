/// <reference types="vitest/globals" />
import React from 'react';
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { render as rtlRender } from '@testing-library/react';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Custom render function that includes router
interface RenderOptions {
  route?: string;
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

function render(
  ui: React.ReactElement,
  { route = '/', wrapper: Wrapper = React.Fragment }: RenderOptions = {}
) {
  window.history.pushState({}, '', route);
  
  return rtlRender(
    <MemoryRouter initialEntries={[route]}>
      <Wrapper>{ui}</Wrapper>
    </MemoryRouter>
  );
}

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorage.clear();
});

export * from '@testing-library/react';
export { render };
