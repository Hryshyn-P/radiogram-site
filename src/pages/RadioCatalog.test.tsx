import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/context/LanguageContext";
import RadioCatalog from "@/pages/RadioCatalog";

vi.mock("@/lib/radioBrowser", () => ({
  fetchCountries: vi.fn().mockResolvedValue([]),
  fetchLanguages: vi.fn().mockResolvedValue([]),
  fetchStations: vi.fn().mockResolvedValue([]),
  fetchTags: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/lib/seo", () => ({ useSeo: vi.fn() }));

describe("RadioCatalog", () => {
  beforeEach(() => {
    localStorage.setItem("app.language", JSON.stringify("en"));
  });

  it("renders the radio route without a runtime error", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={["/radio"]}>
          <Routes>
            <Route path="/radio" element={<RadioCatalog />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    );

    expect(
      await screen.findByRole("heading", { level: 1, name: "Explore live radio" }),
    ).toBeInTheDocument();
  });
});
