import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { downloadCsv } from "./downloadCsv";

describe("downloadCsv", () => {
  let createObjectURL: ReturnType<typeof vi.fn>;
  let revokeObjectURL: ReturnType<typeof vi.fn>;
  let appendChild: ReturnType<typeof vi.fn>;
  let removeChild: ReturnType<typeof vi.fn>;
  let clickMock: ReturnType<typeof vi.fn>;
  let createdLink: HTMLAnchorElement | null = null;

  beforeEach(() => {
    createObjectURL = vi.fn(() => "blob:mock-url");
    revokeObjectURL = vi.fn();
    appendChild = vi.fn();
    removeChild = vi.fn();
    clickMock = vi.fn();

    vi.stubGlobal("URL", {
      createObjectURL,
      revokeObjectURL,
    });

    vi.spyOn(document, "createElement").mockImplementation((tagName: string) => {
      if (tagName.toLowerCase() === "a") {
        createdLink = {
          href: "",
          download: "",
          style: { display: "" },
          click: clickMock,
        } as unknown as HTMLAnchorElement;
        return createdLink;
      }
      return document.createElement(tagName);
    });

    vi.spyOn(document.body, "appendChild").mockImplementation((node: Node) => {
      appendChild(node);
      return node;
    });

    vi.spyOn(document.body, "removeChild").mockImplementation((node: Node) => {
      removeChild(node);
      return node;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    createdLink = null;
  });

  it("creates a blob with the CSV content and correct type", () => {
    const content = "id,name\n1,bulbasaur";
    downloadCsv(content, "pokedex.csv");

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    const blob = createObjectURL.mock.calls[0][0];
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("text/csv;charset=utf-8");
    expect(blob.size).toBe(content.length);
  });

  it("sets the anchor download attribute to the given filename", () => {
    downloadCsv("header\n", "pokedex-2025-02-14.csv");

    expect(createdLink).not.toBeNull();
    expect(createdLink!.download).toBe("pokedex-2025-02-14.csv");
  });

  it("triggers a click on the temporary link", () => {
    downloadCsv("data", "export.csv");

    expect(clickMock).toHaveBeenCalledTimes(1);
  });

  it("revokes the object URL after download", () => {
    downloadCsv("csv", "file.csv");

    expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
  });

  it("appends and removes the link from document body", () => {
    downloadCsv("x", "x.csv");

    expect(appendChild).toHaveBeenCalledTimes(1);
    expect(removeChild).toHaveBeenCalledTimes(1);
  });
});
