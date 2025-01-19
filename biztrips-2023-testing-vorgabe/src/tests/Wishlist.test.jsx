import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Wishlist from "../components/Wishlist";

describe("Wishlist Component", () => {
    const mockRemoveFromWishlist = jest.fn();
    const mockClearWishlist = jest.fn();

    const sampleWishlist = [
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

    it("renders wishlist items", () => {
        render(
            <Wishlist
                wishlist={sampleWishlist}
                removeFromWishlist={mockRemoveFromWishlist}
                clearWishlist={mockClearWishlist}
            />
        );

        const items = screen.getAllByText("BT02");
        expect(items.length).toBeGreaterThan(0);
        expect(screen.getByText("BT03")).toBeInTheDocument();
    });

    it("renders empty wishlist message when no items", () => {
        render(
            <Wishlist
                wishlist={[]}
                removeFromWishlist={mockRemoveFromWishlist}
                clearWishlist={mockClearWishlist}
            />
        );

        expect(screen.getByText("Wishlist is empty")).toBeInTheDocument();
    });

    it("calls removeFromWishlist when 'Delete Item' button is clicked", () => {
        render(
            <Wishlist
                wishlist={sampleWishlist}
                removeFromWishlist={mockRemoveFromWishlist}
                clearWishlist={mockClearWishlist}
            />
        );

        const deleteButtons = screen.getAllByText(/delete item/i);
        fireEvent.click(deleteButtons[0]);

        expect(mockRemoveFromWishlist).toHaveBeenCalledWith(sampleWishlist[0]);
    });

    it("calls clearWishlist when 'Empty Wishlist' button is clicked", () => {
        render(
            <Wishlist
                wishlist={sampleWishlist}
                removeFromWishlist={mockRemoveFromWishlist}
                clearWishlist={mockClearWishlist}
            />
        );

        const clearButton = screen.getByText(/empty wishlist/i);
        fireEvent.click(clearButton);

        expect(mockClearWishlist).toHaveBeenCalled();
    });

    it("disables 'Empty Wishlist' button when wishlist is empty", () => {
        render(
            <Wishlist
                wishlist={[]}
                removeFromWishlist={mockRemoveFromWishlist}
                clearWishlist={mockClearWishlist}
            />
        );

        const clearButton = screen.getByText(/empty wishlist/i);
        expect(clearButton).toBeDisabled();
    });
});
