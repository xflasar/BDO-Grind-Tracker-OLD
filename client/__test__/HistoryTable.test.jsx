import React from "react";
import { render, screen } from "@testing-library/react";
import HistoryTable from "../src/components/ui/HistoryTable";

describe("HistoryTable", () => {
    test("renders HistoryTable component", () => {
        render(<HistoryTable />);
        const historyTable = screen.getByRole("historyTable");
        expect(historyTable).toBeInTheDocument();
    });
});

describe("HistoryTable content renders", () => {
    it("should render HistoryTable component content when data is present", async () => {
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

        render(<HistoryTable data={data} />);

        const historyTable = screen.getByRole("historyTableItem");

        expect(historyTable).toBeInTheDocument();
    });

    it("should not render HistoryTable component content when data is not present", async () => {
        const data = undefined;

        render(<HistoryTable data={data} />);

        const historyTable = screen.queryByRole("historyTableItem");

        expect(historyTable).toBeNull();
    });
});