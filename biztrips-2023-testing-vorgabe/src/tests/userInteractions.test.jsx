import { render, screen, fireEvent, act } from "@testing-library/react";
import App from "../App";

describe("User Interaction Tests for BizTrips App", () => {
    it("should add a trip to the wishlist", async () => {
        render(<App />);

        // Wait for trips to load
        await act(async () => {
            await screen.findByText("BT02");
        });

        const addButton = screen.getAllByText(/add to wishlist/i)[0];
        fireEvent.click(addButton);

        // Check if the trip appears in the wishlist
        const wishlistItem = screen.getByText("BT02");
        expect(wishlistItem).toBeInTheDocument();
    });

    it("should remove a trip from the wishlist", async () => {
        render(<App />);

        // Add a trip to the wishlist
        await act(async () => {
            const addButton = screen.getAllByText(/add to wishlist/i)[0];
            fireEvent.click(addButton);
        });

        const removeButton = screen.getByText(/delete item/i);
        fireEvent.click(removeButton);

        // Check if the wishlist is empty
        expect(screen.getByText("Wishlist is empty")).toBeInTheDocument();
    });

    it("should clear the wishlist", async () => {
        render(<App />);

        // Add multiple trips to the wishlist
        await act(async () => {
            const addButtons = screen.getAllByText(/add to wishlist/i);
            addButtons.forEach((button) => fireEvent.click(button));
        });

        const clearButton = screen.getByText(/empty wishlist/i);
        fireEvent.click(clearButton);

        // Check if the wishlist is empty
        expect(screen.getByText("Wishlist is empty")).toBeInTheDocument();
    });

    it("should filter trips by month", async () => {
        render(<App />);

        await act(async () => {
            await screen.findByText("BT02");
        });

        fireEvent.change(screen.getByLabelText(/filter by month/i), {
            target: { value: "6" },
        });

        expect(screen.getByText("Found 1 trip for the month of June")).toBeInTheDocument();
        expect(screen.getByText("BT02")).toBeInTheDocument();
        expect(screen.queryByText("BT03")).not.toBeInTheDocument();
    });

    it("should handle API errors gracefully", async () => {
        global.fetch.mockImplementationOnce(() =>
            Promise.reject(new Error("API is down"))
        );

        render(<App />);

        const errorMessage = await screen.findByText(/error: api is down/i);
        expect(errorMessage).toBeInTheDocument();
    });
});
