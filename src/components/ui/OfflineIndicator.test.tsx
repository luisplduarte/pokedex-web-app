import { describe, it, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { OfflineIndicator } from "./OfflineIndicator";

describe("OfflineIndicator", () => {
  const originalOnLine = Object.getOwnPropertyDescriptor(
    navigator,
    "onLine"
  ) as PropertyDescriptor | undefined;

  afterEach(() => {
    if (originalOnLine) {
      Object.defineProperty(navigator, "onLine", originalOnLine);
    }
  });

  it("renders nothing when online", () => {
    Object.defineProperty(navigator, "onLine", {
      value: true,
      configurable: true,
      writable: true,
    });

    const { container } = render(<OfflineIndicator />);

    expect(container.firstChild).toBeNull();
  });

  it("shows offline message when offline", async () => {
    Object.defineProperty(navigator, "onLine", {
      value: false,
      configurable: true,
      writable: true,
    });

    render(<OfflineIndicator />);

    await screen.findByText("Offline — changes saved locally");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Offline — changes saved locally"
    );
  });
});
