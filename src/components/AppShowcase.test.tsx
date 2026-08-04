import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AppShowcase from "@/components/AppShowcase";
import { LanguageProvider } from "@/context/LanguageContext";

let intersectionCallback: IntersectionObserverCallback;
const originalScrollTo = HTMLElement.prototype.scrollTo;

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [0.25];

  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
  }

  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();
}

const renderShowcase = () => render(
  <LanguageProvider>
    <AppShowcase />
  </LanguageProvider>,
);

describe("AppShowcase", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: vi.fn(),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: originalScrollTo,
    });
  });

  it("keeps autoplay running while a slide has focus", () => {
    renderShowcase();
    act(() => {
      intersectionCallback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });

    fireEvent.focus(screen.getByRole("button", { name: /^1 \/ 14:/ }));
    const callsBeforeAutoplay = vi.mocked(HTMLElement.prototype.scrollTo).mock.calls.length;

    act(() => vi.advanceTimersByTime(5600));

    expect(HTMLElement.prototype.scrollTo).toHaveBeenCalledTimes(callsBeforeAutoplay + 1);
  });

  it("activates a clicked slide immediately", () => {
    renderShowcase();
    const first = screen.getByRole("button", { name: /^1 \/ 14:/ });
    const second = screen.getByRole("button", { name: /^2 \/ 14:/ });

    expect(first).toHaveClass("is-active");
    fireEvent.click(second);

    expect(second).toHaveClass("is-active");
    expect(first).not.toHaveClass("is-active");
  });

  it("activates the centered slide in the same scroll event", () => {
    const { container } = renderShowcase();
    const viewport = container.querySelector<HTMLElement>(".app-showcase__viewport");
    const figures = Array.from(container.querySelectorAll("figure"));

    expect(viewport).not.toBeNull();
    if (!viewport) return;

    Object.defineProperty(viewport, "clientWidth", { configurable: true, value: 300 });
    Object.defineProperty(viewport, "scrollLeft", { configurable: true, value: 1400, writable: true });
    figures.forEach((figure, index) => {
      Object.defineProperty(figure, "clientWidth", { configurable: true, value: 100 });
      Object.defineProperty(figure, "offsetLeft", { configurable: true, value: index * 100 });
    });

    fireEvent.scroll(viewport);

    expect(screen.getByRole("button", { name: /^2 \/ 14:/ })).toHaveClass("is-active");
  });
});
