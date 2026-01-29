
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { CreateAuction } from "./pages/CreateAuction";
import { AuctionDetails } from "./pages/AuctionDetails";
import { AuctionsList } from "./pages/AuctionList";
import { createHashRouter } from "react-router-dom";

export const router = createHashRouter(
    [
        {
            path: "/",
            element: <Layout />,
            children: [
                { index: true, element: <Home /> },
                { path: "auctions", element: <AuctionsList /> },
                { path: "auctions/:id", element: <AuctionDetails /> },
                { path: "create", element: <CreateAuction /> },
            ],
        },
    ],
    {
        basename: import.meta.env.BASE_URL,
    }
);

