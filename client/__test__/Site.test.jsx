import React from "react";
import { render, screen, act } from "@testing-library/react";
import Sites from "../src/pages/Sites/Sites";
import Cookies from "js-cookie";

describe("test fetch with mocked data", () => {
    it("When session token is present it should set data to DataFromFetch!", async () => {
        const data = {
        Site1: {
            SiteName: 'Loading...',
            TotalTime: 'Loading...',
            TotalEarned: 'Loading...',
            TotalSpent: 'Loading...',
            AverageEarnings: 'Loading...'
          },
          Site2: {
            SiteName: 'Loading...',
            TotalTime: 'Loading...',
            TotalEarned: 'Loading...',
            TotalSpent: 'Loading...',
            AverageEarnings: 'Loading...'
          },
          Site3: {
            SiteName: 'Loading...',
            TotalTime: 'Loading...',
            TotalEarned: 'Loading...',
            TotalSpent: 'Loading...',
            AverageEarnings: 'Loading...'
          },
          Site4: {
            SiteName: 'Loading...',
            TotalTime: 'Loading...',
            TotalEarned: 'Loading...',
            TotalSpent: 'Loading...',
            AverageEarnings: 'Loading...'
          }};
        
        jest.spyOn(global, "fetch").mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve(data)
            })
        );

        Cookies.set("token", "test");
        
        await act (async () => {render(<Sites />)});
        
        const _boxes = await screen.getAllByRole('siteBox');
        
        expect(_boxes.length).toBe(4);
        
        Cookies.remove("token");
        global.fetch.mockRestore();
    });

    it("When session token is not present it should not show any siteBoxes",async () => {
        const container = render(<Sites />);
        await act (async () => container);
        
        const _boxes = await container.queryAllByRole('siteBox');
        
        expect(_boxes).toStrictEqual([]);
    });
  });