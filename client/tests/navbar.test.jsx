import React from "react";
import { render, screen} from "@testing-library/react";
import Navigation from "../src/components/ui/navbar";
import { BrowserRouter} from "react-router-dom";

describe("Navigation", () => {
  test("renders Navigation component", () => {
    render(<BrowserRouter><Navigation /></BrowserRouter>);
    let _homeLink = screen.getAllByText("Home")[0];
    expect(_homeLink.href).toContain('/');
    let _sitesLink = screen.getAllByText("Sites")[0];
    expect(_sitesLink.href).toContain('/sites');
    let _historyLink = screen.getAllByText("History")[0];
    expect(_historyLink.href).toContain('/history');
    let _analyticsLink = screen.getAllByText("Analytics")[0];
    expect(_analyticsLink.href).toContain('/analytics');
  });
});

describe("Navigation redirects", () => {
    it("should navigate to /", () => {
      render(<BrowserRouter><Navigation/></BrowserRouter>);
      let _homeLink = screen.getAllByRole('link', { name: /home/i });
      _homeLink.forEach(element => {
        expect(element).toHaveAttribute('href', '/');
      });
    });

    it("should navigate to /sites", () => {
      render(<BrowserRouter><Navigation/></BrowserRouter>);
      let _sitesLink = screen.getAllByRole('link', { name: /sites/i });
      _sitesLink.forEach(element => {
        expect(element).toHaveAttribute('href', '/sites');
      });
    });

    it("should navigate to /history", () => {
      render(<BrowserRouter><Navigation/></BrowserRouter>);
      let _historyLink = screen.getAllByRole('link', { name: /history/i });
      _historyLink.forEach(element => {
        expect(element).toHaveAttribute('href', '/history');
      });
    });

    it("should navigate to /analytics", () => {
      render(<BrowserRouter><Navigation/></BrowserRouter>);
      let _analyticsLink = screen.getAllByRole('link', { name: /analytics/i });
      _analyticsLink.forEach(element => {
        expect(element).toHaveAttribute('href', '/analytics');
      });
    });
});