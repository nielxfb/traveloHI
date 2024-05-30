import { Outlet, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home-page";
import LoginPage from "./pages/login-page";
import GuestRoute from "./middlewares/guest-route";
import RegisterPage from "./pages/register-page";
import AdminRoute from "./middlewares/admin-route";
import AdminPage from "./pages/admin-page";
import UsersPage from "./pages/users-page";
import SendEmail from "./pages/send-email";
import AddNewHotel from "./pages/add-new-hotel";
import AuthenticatedRoute from "./middlewares/authenticated-route";
import ProfilePage from "./pages/profile-page";
import ForgotPassword from "./pages/forgot-password";
import AddNewAirline from "./pages/add-new-airline";
import HotelsPage from "./pages/hotels-page";
import AddPromo from "./pages/add-promo";
import PromosPage from "./pages/promos-page";
import CreditCardsPage from "./pages/credit-cards-page";
import AddCreditCard from "./pages/add-credit-card";
import HotelDetailPage from "./pages/hotel-detail-page";
import SearchResult from "./pages/search-result";
import NotFound from "./pages/not-found";
import MultiplayerGame from "./pages/multiplayer-game";
import FlightsPage from "./pages/flights-page";
import FlightDetailPage from "./pages/flight-detail-page";
import CartPage from "./pages/cart-page";
import AboutPage from "./pages/about-page";
import ContactUs from "./pages/contact-us";
import PrivacyPolicy from "./pages/privacy-policy";
import WalletPage from "./pages/wallet-page";
import MyTicketPage from "./pages/my-ticket-page";
import HistoryPage from "./pages/history-page";
import CheckLocationPage from "./pages/check-location-page";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }
      >
        <Route path="add-new-hotel" element={<AddNewHotel />} />
        <Route path="add-new-airline" element={<AddNewAirline />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="send-email" element={<SendEmail />} />
        <Route path="add-promo" element={<AddPromo />} />
        <Route path="promos" element={<PromosPage />} />
      </Route>
      <Route
        path="/auth"
        element={
          <GuestRoute>
            <Outlet />
          </GuestRoute>
        }
      >
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>
      <Route
        path="/profile"
        element={
          <AuthenticatedRoute>
            <ProfilePage />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/credit-cards"
        element={
          <AuthenticatedRoute>
            <CreditCardsPage />
          </AuthenticatedRoute>
        }
      >
        <Route path="add-credit-card" element={<AddCreditCard />} />
      </Route>
      <Route
        path="/wallet"
        element={
          <AuthenticatedRoute>
            <WalletPage />
          </AuthenticatedRoute>
        }
      />
      <Route path="/hotels" element={<HotelsPage />} />
      <Route
        path="/hotels/:id"
        element={
          <AuthenticatedRoute>
            <HotelDetailPage />
          </AuthenticatedRoute>
        }
      />
      <Route path="/search/:query" element={<SearchResult />} />
      <Route
        path="/multiplayer-game"
        element={
          <AuthenticatedRoute>
            <MultiplayerGame />
          </AuthenticatedRoute>
        }
      />
      <Route path="/flights" element={<FlightsPage />} />
      <Route path="/flight-detail/:id" element={<FlightDetailPage />} />
      <Route
        path="/cart-page"
        element={
          <AuthenticatedRoute>
            <CartPage />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/history-page"
        element={
          <AuthenticatedRoute>
            <HistoryPage />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/my-ticket-page"
        element={
          <AuthenticatedRoute>
            <MyTicketPage />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/check-location-page"
        element={
          <AuthenticatedRoute>
            <CheckLocationPage />
          </AuthenticatedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
      <Route path="/about-page" element={<AboutPage />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    </Routes>
  );
}

export default App;
