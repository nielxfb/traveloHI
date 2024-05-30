import React, { ChangeEvent, useEffect, useState } from "react";
import { useJwt } from "../hooks/use-jwt";
import { get, post, put, remove } from "../tools/api";
import NavbarLayout from "../layouts/navbar-layout";
import { IHotel } from "../interfaces/hotel-interface";
import styled from "styled-components";
import Horizontal from "../components/form/horizontal";
import Button from "../components/button";
import { useCurrency } from "../providers/currency-context-provider";
import Modal from "../components/modal";
import Vertical from "../components/form/vertical";
import Input from "../components/form/input";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase/config";
import { IFlight } from "../interfaces/flight-interface";
import { ICreditCard } from "../interfaces/credit-card-interface";
import Select from "../components/form/select";
import { useAuth } from "../providers/auth-context-provider";

interface IRoomType {
  RoomType: string;
  Price: number;
}

interface IHotelCart {
  Hotel: IHotel;
  CartID: string;
  CheckInDate: string;
  CheckOutDate: string;
  RoomType: IRoomType;
}

interface IFlightCart {
  Flight: IFlight;
  CartID: string;
  SeatNumber: string;
  UseLuggage: boolean;
}

interface Response {
  HotelCarts: IHotelCart[];
  FlightCarts: IFlightCart[];
}

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.background};
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.fontDimmed};
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  box-shadow: ${(props) => props.theme.shadow};

  img {
    max-width: 45%;
    height: auto;
    object-fit: contain;
    border-radius: 0.5rem;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: left;
  gap: 1rem;
`;

function CartPage() {
  const { sub } = useJwt();
  const { displayCurrency } = useCurrency();
  const { user } = useAuth();
  const [items, setItems] = useState<Response>({} as Response);
  const [updateCheckInDate, setUpdateCheckInDate] = useState<boolean>(false);
  const [updateCheckOutDate, setUpdateCheckOutDate] = useState<boolean>(false);
  const [selectedCart, setSelectedCart] = useState<IHotelCart>(
    {} as IHotelCart
  );
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [cards, setCards] = useState<ICreditCard[]>([]);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);

  const fetchCards = async () => {
    const url = import.meta.env.VITE_API_URL + "/api/fetch-credit-cards/" + sub;
    let response;
    try {
      response = await get(url);
    } catch (error: any) {
      alert(error.message);
      return;
    }

    setCards(response as ICreditCard[]);
  };

  useEffect(() => {
    fetchCards();

    const unsubscribe = onSnapshot(collection(firestore, "banks"), () => {
      fetchCards();
    });

    return () => unsubscribe();
  }, []);

  const useShowCheckout = () => {
    setShowCheckout((prev) => !prev);
  };

  const fetchCart = async () => {
    const url = import.meta.env.VITE_API_URL + "/api/fetch-user-carts/" + sub;
    let response;
    try {
      response = await get(url);
    } catch (error: any) {
      alert(error.message);
      return;
    }

    if (response == undefined) {
      alert("response empty");
      return;
    }

    setItems(response);
  };

  const useUpdateCheckInDate = async (item: IHotelCart) => {
    if (!updateCheckInDate) {
      setSelectedCart(item);
      setUpdateCheckInDate(true);
    } else {
      const url = import.meta.env.VITE_API_URL + "/api/update-check-in-date";

      try {
        await put(url, {
          CheckInDate: selectedCart.CheckInDate,
          CartID: selectedCart.CartID,
        });
      } catch (error: any) {
        alert(error.message);
        return;
      }
      alert("Successfully updated check in date!");
      await addDoc(collection(firestore, "carts"), {
        data: "Hai",
      });
      setSelectedCart({} as IHotelCart);
      setUpdateCheckInDate(false);
    }
  };

  const useUpdateCheckOutDate = async (item: IHotelCart) => {
    if (!updateCheckOutDate) {
      setSelectedCart(item);
      setUpdateCheckOutDate(true);
    } else {
      const url = import.meta.env.VITE_API_URL + "/api/update-check-out-date";

      try {
        await put(url, {
          CheckOutDate: selectedCart.CheckOutDate,
          CartID: selectedCart.CartID,
        });
      } catch (error: any) {
        alert(error.message);
        return;
      }
      alert("Successfully updated check out date!");
      await addDoc(collection(firestore, "carts"), {
        data: "Hai",
      });
      setSelectedCart({} as IHotelCart);
      setUpdateCheckOutDate(false);
    }
  };

  useEffect(() => {
    fetchCart();

    const unsubscribe = onSnapshot(collection(firestore, "carts"), () => {
      fetchCart();
    });

    return () => unsubscribe();
  }, []);

  const handleCheckInDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedCart((prev) => ({
      ...prev,
      CheckInDate: new Date(e.target.value).toISOString().split("T")[0],
    }));
  };

  const handleCheckOutDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedCart((prev) => ({
      ...prev,
      CheckOutDate: new Date(e.target.value).toISOString().split("T")[0],
    }));
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    if (items.HotelCarts) {
      items.HotelCarts.forEach((item) => {
        totalPrice +=
          ((new Date(item.CheckOutDate).getTime() -
            new Date(item.CheckInDate).getTime()) /
            (3600 * 24 * 1000)) *
          item.RoomType.Price;
      });
    }
    if (items.FlightCarts) {
      items.FlightCarts.forEach((item) => {
        totalPrice += item.Flight.Price;
        if (item.UseLuggage) totalPrice += 500
      });
    }
    return totalPrice;
  };

  //   useEffect(() => {
  //     console.log(items);
  //   }, [items]);

  const handleRemoveFlight = async (CartID: string) => {
    console.log(CartID);
    const url =
      import.meta.env.VITE_API_URL + "/api/remove-flight-from-cart/" + CartID;
    try {
      await remove(url);
    } catch (error: any) {
      alert(error.message);
      return;
    }

    await addDoc(collection(firestore, "carts"), {
      data: "Hai",
    });

    alert("Successfully removed flight ticket from cart!");
  };

  const handleCheckPromo = async () => {
    const promoInput = document.getElementById("promoCode") as HTMLInputElement;
    const code = promoInput.value;

    const url = import.meta.env.VITE_API_URL + "/api/check-promo";
    try {
      await post(url, { PromoCode: code });
    } catch (error: any) {
      setError(error.message);
      return;
    }

    setError("");
    setSuccess("Promo applied!");
  };

  const handleCardChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.options[e.target.selectedIndex].id;
    setSelectedMethod(id);
  };

  const handleCheckout = async () => {
    if (error != "") {
      alert("Please check your promo code");
      return;
    }

    setSuccess("");

    const paymentMethod = document.getElementById(
      "method"
    ) as HTMLSelectElement;
    const selectedCard = paymentMethod.value.split(" ")[0];

    const url = import.meta.env.VITE_API_URL + "/api/checkout";
    // check what method is selected
    // if HIWallet, then the UsingWallet is set to true
    // else if credit cards, then the UsingCreditCard is set to true
    const data = {
      UsingWallet: selectedCard == "HIWallet:",
      UsingCreditCard: selectedCard != "HIWallet:",
      UserID: sub,
      PromoCode: (document.getElementById("promoCode") as HTMLInputElement)
        .value,
      CreditCardID: selectedMethod != "wallet" ? selectedMethod : "",
      TotalPrice: calculateTotalPrice(),
    };

    try {
      await post(url, data);
    } catch (error: any) {
      setError(error.message);
      return;
    }

    setError("");
    await addDoc(collection(firestore, "carts"), {
      data: "Hai",
    })
    alert("Successfully checked out!");
    useShowCheckout();
  };

  const fetchUserWallet = async () => {
    const url = import.meta.env.VITE_API_URL + "/api/fetch-wallet-balance/" + sub;
    let response;
    try {
      response = await get(url);
    } catch (error: any) {
      alert(error.message);
      return;
    }

    setBalance(response);
  }

  useEffect(() => {
    fetchUserWallet();

    const unsubscribe = onSnapshot(collection(firestore, "wallets"), () => {
      fetchUserWallet();
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <NavbarLayout>
        <Vertical>
          {items.HotelCarts &&
            items.HotelCarts.map((item, index) => (
              <Wrapper key={index}>
                <img src={item.Hotel.ImageLink} alt="" />
                <Content>
                  <h3>
                    Status:{" "}
                    {new Date(item.CheckInDate).getTime() > new Date().getTime()
                      ? "Ongoing"
                      : "Expired"}
                  </h3>
                  <h1>{item.Hotel.HotelName}</h1>
                  <h3>
                    Check in date: {new Date(item.CheckInDate).toDateString()}
                  </h3>
                  <h3>
                    Check out date: {new Date(item.CheckOutDate).toDateString()}
                  </h3>
                  <h3>
                    Staying duration:{" "}
                    {(new Date(item.CheckOutDate).getTime() -
                      new Date(item.CheckInDate).getTime()) /
                      (3600 * 24 * 1000)}
                  </h3>
                  <h3>Room type: {item.RoomType.RoomType}</h3>
                  <h2>
                    Price:{" "}
                    {displayCurrency(
                      ((new Date(item.CheckOutDate).getTime() -
                        new Date(item.CheckInDate).getTime()) /
                        (3600 * 24 * 1000)) *
                        item.RoomType.Price
                    )}
                  </h2>
                  <Vertical>
                    <Horizontal>
                      <Button
                        type="button"
                        onClick={() => useUpdateCheckInDate(item)}
                      >
                        Update Check in Date
                      </Button>
                      <Button
                        type="button"
                        onClick={() => useUpdateCheckOutDate(item)}
                      >
                        Update Check out Date
                      </Button>
                    </Horizontal>
                    <Button type="button">Remove Hotel from Cart</Button>
                  </Vertical>
                </Content>
              </Wrapper>
            ))}
          {items.FlightCarts &&
            items.FlightCarts.map((item, index) => (
              <Wrapper key={index}>
                <Content>
                  <h3>
                    Status:{" "}
                    {new Date(item.Flight.DepartureTime).getTime() >
                    new Date().getTime()
                      ? "Ongoing"
                      : "Expired"}
                  </h3>
                  <h1>
                    {item.Flight.AirlineCode}
                    {item.Flight.AirlineNumber}
                  </h1>
                  <h3>
                    {item.Flight.OriginAirportCode} —{" "}
                    {item.Flight.DestinationAirportCode}
                  </h3>
                  <h3>
                    Departure time:{" "}
                    {new Date(item.Flight.DepartureTime).toUTCString()}
                  </h3>
                  <h3>
                    Arrival time:{" "}
                    {new Date(item.Flight.ArrivalTime).toUTCString()}
                  </h3>
                  <h3>Seat number: {item.SeatNumber}</h3>
                  <h2>Price: {displayCurrency(item.Flight.Price + (item.UseLuggage ? 500 : 0))}</h2>
                  <Vertical>
                    <Button
                      type="button"
                      onClick={() => handleRemoveFlight(item.CartID)}
                    >
                      Remove Flight from Cart
                    </Button>
                  </Vertical>
                </Content>
              </Wrapper>
            ))}
          <Wrapper>
            <Vertical>
              <h1>Total Price: {displayCurrency(calculateTotalPrice())}</h1>
              <Button type="button" onClick={useShowCheckout}>
                Check out
              </Button>
            </Vertical>
          </Wrapper>
        </Vertical>
      </NavbarLayout>
      <Modal
        show={updateCheckInDate}
        onClose={() => setUpdateCheckInDate(false)}
      >
        <Vertical>
          <label>Check in date</label>
          <Input
            type="date"
            value={String(selectedCart.CheckInDate).split("T")[0]}
            onChange={handleCheckInDateChange}
          />
          <Button
            type="button"
            onClick={() => useUpdateCheckInDate(selectedCart)}
          >
            Update
          </Button>
        </Vertical>
      </Modal>
      <Modal
        show={updateCheckOutDate}
        onClose={() => setUpdateCheckOutDate(false)}
      >
        <Vertical>
          <label>Check out date</label>
          <Input
            type="date"
            value={String(selectedCart.CheckOutDate).split("T")[0]}
            onChange={handleCheckOutDateChange}
          />
          <Button
            type="button"
            onClick={() => useUpdateCheckOutDate(selectedCart)}
          >
            Update
          </Button>
        </Vertical>
      </Modal>
      <Modal show={showCheckout} onClose={useShowCheckout}>
        <Vertical>
          <Vertical>
            <label>Payment Method</label>
            <Select id="method" onChange={handleCardChange}>
              <option id="wallet">
                HIWallet: {displayCurrency(balance)}
              </option>
              {cards &&
                cards.map((card, index) => (
                  <option key={index} id={card.ID}>
                    {card.CardNumber} {card.BankName}
                  </option>
                ))}
            </Select>
          </Vertical>
          <Vertical>
            <label>Promo Code</label>
            <Horizontal>
              <Input type="text" id="promoCode" />
              <Button type="button" onClick={handleCheckPromo}>
                Apply
              </Button>
            </Horizontal>
            {success != "" && <p style={{ color: "blue" }}>{success}</p>}
            {error != "" && <p style={{ color: "red" }}>{error}</p>}
          </Vertical>
          <Button type="button" onClick={handleCheckout}>
            Pay
          </Button>
        </Vertical>
      </Modal>
    </>
  );
}

export default CartPage;
