/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

interface CustomMatchers<R = unknown> {
  toBeInTheDocument(): R;
  toHaveStyle(style: Record<string, any>): R;
  toHaveAttribute(attr: string, value?: string): R;
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {
    // Required to satisfy @typescript-eslint/no-empty-interface
    // These interfaces extend CustomMatchers to enable custom test matchers
    readonly _customMatcherBrand: unique symbol;
  }
  interface AsymmetricMatchersContaining extends CustomMatchers {
    // Required to satisfy @typescript-eslint/no-empty-interface
    // These interfaces extend CustomMatchers to enable custom test matchers
    readonly _customMatcherBrand: unique symbol;
  }
}
