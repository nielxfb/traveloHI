export interface ISidebar {
    name: string;
    path: string;
}

export const ADMIN_ITEMS = [
    {
        name: "Add new Hotel",
        path: "/admin/add-new-hotel",
    },
    {
        name: "Add new Airline",
        path: "/admin/add-new-airline",
    },
    {
        name: "View All Users",
        path: "/admin/users",
    },
    {
        name: "Send Email to subscribed account",
        path: "/admin/send-email",
    },
    {
        name: "Add new Promo",
        path: "/admin/add-promo",
    },
    {
        name: "View All Promos",
        path: "/admin/promos",
    },
]

export const PROFILE_ITEMS = [
    {
        name: "My Profile",
        path: "/profile",
    },
    {
        name: "My Credit Cards",
        path: "/credit-cards",
    },
    {
        name: "My Wallet",
        path: "/wallet",
    },
]