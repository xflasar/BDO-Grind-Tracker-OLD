import React from "react";
import { render, screen, act } from "@testing-library/react";
import SiteBox from "../src/components/ui/SiteBox";

describe("test SiteBox", () => {
    it("When data is present it should show the box with data", async () => {
        const data = {
            SiteName: 'Loading...',
            TotalTime: 'Loading...',
            TotalEarned: 'Loading...',
            TotalSpent: 'Loading...',
            AverageEarnings: 'Loading...'
        };
        
        render(<SiteBox data={data} />);
        
        const _box = await screen.getByRole('siteBox');

        expect(_box).toHaveTextContent('Loading...'); // Probably not needed but just to be sure the data is there
        
        expect(_box).toBeInTheDocument();
    });
});