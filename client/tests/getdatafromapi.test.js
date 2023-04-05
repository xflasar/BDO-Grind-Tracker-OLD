const React = require("react");
import { render, screen } from "@testing-library/react";
import Homepage from "../src/pages/Home/Homepage";

describe('getDataFromApi', () => {
    beforeEach(() => {
        fetchMock.resetMocks()
    })

    test('renders Homepage when API call succeeds', async () => {
        fetchMock.mockResponse(() => Promise.resolve({
            status: 200,
            body: JSON.stringify({ message: "Successfully acquired data from server!" })
        }));
        render(<Homepage />);
        expect(await screen.findByText('Successfully acquired data from server!')).toBeInTheDocument();
        expect(screen.queryByText('No data!')).not.toBeInTheDocument();
    });

    it("should fail", async () => {
        fetchMock.mockResponse(() => Promise.resolve({
            status: 503,
            body: JSON.stringify({ message: "Failed to acquire data from server!" })
        }));
        render(<Homepage />);
        expect(await screen.findByText('No data!')).toBeInTheDocument();
        expect(screen.queryByText('Successfully acquired data from server!')).not.toBeInTheDocument();
    });
      
      
});
