import AdminPage from "../pages/admin-page";

export interface IMenu {
  name: string;
  path: string;
}

export const ADMIN_MENU: IMenu[] = [
  {
    name: "Admin Page",
    path: "/admin",
  },
  {
    name: "Cart Page",
    path: "/cart-page",
  },
];

export const USER_MENU: IMenu[] = [
  {
    name: "Cart Page",
    path: "/cart-page",
  },
  {
    name: "My Ticket Page",
    path: "/my-ticket-page",
  },
  {
    name: "History Page",
    path: "/history-page",
  },
  {
    name: "Check Location Page",
    path: "/check-location-page",
  }
];

export const PUBLIC_MENU: IMenu[] = [
  {
    name: "Hotels",
    path: "/hotels",
  },
  {
    name: "Flights",
    path: "/flights",
  },
  {
    name: "Multiplayer Game",
    path: "/multiplayer-game",
  },
];
