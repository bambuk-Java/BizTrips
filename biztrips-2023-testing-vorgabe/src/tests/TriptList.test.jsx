import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import TripList from "../components/TripList";

const mockTrips = [
    {
        id: 2,
        title: "BT02",
        description: "Santa Clara Halley on new Server/IOT/Client",
        startTrip: [2021, 6, 23, 9, 0],
        endTrip: [2021, 6, 27, 16, 56],
    },
    {
        id: 3,
        title: "BT03",
        description: "San Cose City Halley on Docker/IOT/Client",
        startTrip: [2021, 12, 13, 9, 0],
        endTrip: [2021, 12, 15, 16, 56],
    },
];

beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockTrips),
        })
    );
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe("TripList Component", () => {
    const mockAddToWishlist = jest.fn();

    it("renders loading state initially", () => {
        render(<TripList addToWishlist={mockAddToWishlist} />);
        expect(screen.getByText("Loading trips...")).toBeInTheDocument();
    });

    it("renders trips after loading", async () => {
        await act(async () => {
            render(<TripList addToWishlist={mockAddToWishlist} />);
        });

        const trip1 = await screen.findByText((content) => content.includes("BT02"));
        const trip2 = await screen.findAllByText((content) => content.includes("BT03"));

        expect(trip1).toBeInTheDocument();
        expect(trip2.length).toBeGreaterThan(0);
    });

    it("filters trips by selected month", async () => {
        await act(async () => {
            render(<TripList addToWishlist={mockAddToWishlist} />);
        });

        // Warte auf die initialen Trips
        await act(async () => {
            await screen.findByText((content) => content.includes("BT02"));
        });

        // Filter anwenden
        await act(async () => {
            fireEvent.change(screen.getByLabelText(/filter by month/i), { target: { value: "6" } });
        });

        // Überprüfen
        expect(screen.getByText("Found 1 trip for the month of June")).toBeInTheDocument();
        expect(screen.getAllByText("BT02").length).toBeGreaterThan(0);
        expect(screen.queryByText("BT03")).not.toBeInTheDocument();
    });

    it("renders an error message if API request fails", async () => {
        global.fetch.mockImplementationOnce(() =>
            Promise.reject(new Error("API is down"))
        );

        await act(async () => {
            render(<TripList addToWishlist={mockAddToWishlist} />);
        });

        const errorMessage = await screen.findByText(/error: api is down/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it("calls addToWishlist when 'Add to Wishlist' button is clicked", async () => {
        await act(async () => {
            render(<TripList addToWishlist={mockAddToWishlist} />);
        });

        const addButtons = await screen.findAllByText(/add to wishlist/i);
        fireEvent.click(addButtons[0]);

        expect(mockAddToWishlist).toHaveBeenCalledWith(mockTrips[0]);
    });
});
