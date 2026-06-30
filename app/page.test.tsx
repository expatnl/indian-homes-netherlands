import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home page (smoke test)", () => {
  it("renders without crashing, proving the app builds and the route resolves", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /IndianHomes\.nl/i })
    ).toBeInTheDocument();
  });
});
