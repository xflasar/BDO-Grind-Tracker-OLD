import React from "react";
import { render, screen, act} from "@testing-library/react";
import History from "../src/pages/History/History";
import Cookies from "js-cookie";

describe("History", () => {
    test("renders History component", () => {
        render(<History />);
        const historyContainer = screen.getByRole("historyContainer");
        expect(historyContainer).toBeInTheDocument();
    });
});

describe("test fetch with mocked data and render of HistoryTable", () => {
  it("should render HistoryTable component when session token is present", async () => {
    const data = [
      {
        Date: "Loading...",
        SiteName: "Loading...",
        TimeSpent: "Loading...",
        Earnings: "Loading...",
        AverageEarnings: "Loading...",
        Expenses: "Loading...",
        Gear: "Loading..."
      }
    ];

    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(data)
      })
    );

    Cookies.set("token", "test");

    await act(async () => {
      render(<History />);
    });

    const historyTable = screen.getByRole("historyTable");

    expect(historyTable).toBeInTheDocument();

    Cookies.remove("token");
    global.fetch.mockRestore();
  });

    it("When session token is not present it should not show any siteBoxes",async () => {
        const container = render(<History />);
        await act (async () => container);
        
        const _boxes = await container.queryByRole('historyTable');
        
        expect(_boxes).toStrictEqual(null);
    });
  });
