import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { get, post } from "../tools/api";
import Error from "../components/form/errors";
import NavbarLayout from "../layouts/navbar-layout";
import styled from "styled-components";
import { CiLocationOn } from "react-icons/ci";
import Button from "../components/button";
import ReviewCard from "../components/hotels/review-card";
import { MdOutlineCleanHands } from "react-icons/md";
import { CgViewComfortable } from "react-icons/cg";
import { FaMapLocationDot } from "react-icons/fa6";
import { MdOutlineRoomService } from "react-icons/md";
import Form from "../components/form/form";
import Vertical from "../components/form/vertical";
import Input from "../components/form/input";
import Horizontal from "../components/form/horizontal";
import { useAuth } from "../providers/auth-context-provider";
import Modal from "../components/modal";
import Title from "../components/form/title";
import UploadHotelImage from "../firebase/upload-hotel-image";
import UploadRoomTypeImage from "../firebase/upload-roomtype-image";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase/config";
import { useCurrency } from "../providers/currency-context-provider";
import { useJwt } from "../hooks/use-jwt";

interface RoomType {
  RoomTypeID: string;
  HotelID: string;
  RoomType: string;
  Stock: number;
  Price: number;
  ImageLink: string;
}

export interface Review {
  ReviewID: string;
  UserID: string;
  Rating: number;
  ReviewDesc: string;
  IsAnonymous: boolean;
}

interface HotelResponse {
  HotelID: string;
  HotelName: string;
  Description: string;
  Address: string;
  CityName: string;
  CountryName: string;
  ImageLink: string;
  AverageRating: number;
  CleanlinessRating: number;
  ComfortRating: number;
  LocationRating: number;
  ServiceRating: number;
  RoomTypes: RoomType[];
  CleanlinessReviews: Review[];
  ComfortReviews: Review[];
  LocationReviews: Review[];
  ServiceReviews: Review[];
}

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.background};
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.fontDimmed};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  box-shadow: ${(props) => props.theme.shadow};

  img {
    max-width: 45%;
    height: auto;
    object-fit: cover;
    border-radius: 0.5rem;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: left;
  gap: 2rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: left;
  gap: 1rem;
`;

const Location = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: left;
`;

const RatingItems = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: left;
`;

const Rating = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: left;
  padding: 0 0.5rem;
`;

interface CurrReview {
  reviews: Review[];
  id: string;
}

interface Payload {
  UserID: string;
  HotelID: string;
  CheckInDate: string;
  CheckOutDate: string;
}

function HotelDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { sub } = useJwt();
  const { displayCurrency } = useCurrency();
  const role = user!.Role;
  const [error, setError] = useState<string>("");
  const [hotel, setHotel] = useState<HotelResponse>({} as HotelResponse);
  const [reviews, setReviews] = useState<CurrReview>({
    reviews: [],
    id: "",
  });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [roomType, setRoomType] = useState<RoomType>({} as RoomType);
  const [data, setData] = useState<Payload>({
    UserID: sub,
    HotelID: id!,
    CheckInDate: "",
    CheckOutDate: "",
  });
  const imageRef = useRef<HTMLInputElement>(null);

  const handleChangeReview = (e: MouseEvent) => {
    if (reviews.id == e.currentTarget.id) {
      setReviews({ reviews: [], id: "" });
      return;
    }

    switch (e.currentTarget.id) {
      case "cleanliness":
        setReviews({
          reviews: hotel.CleanlinessReviews || [],
          id: "cleanliness",
        });
        break;

      case "comfort":
        setReviews({ reviews: hotel.ComfortReviews || [], id: "comfort" });
        break;

      case "location":
        setReviews({ reviews: hotel.LocationReviews || [], id: "location" });
        break;

      case "service":
        setReviews({ reviews: hotel.ServiceReviews || [], id: "service" });
        break;

      default:
        setReviews({ reviews: [], id: "" });
        break;
    }
  };

  const fetchHotel = async () => {
    const url = import.meta.env.VITE_API_URL + "/api/fetch-hotel/" + id;
    let response;
    try {
      response = await get(url);
    } catch (error: any) {
      setError(error.message);
      return;
    }

    if (response == undefined) {
      setError("Not found");
      return;
    }

    setError("");
    setHotel(response as HotelResponse);
  };

  useEffect(() => {
    fetchHotel();

    const unsubscribe = onSnapshot(collection(firestore, "room-types"), () => {
      fetchHotel();
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log(hotel.RoomTypes);
  }, [hotel.RoomTypes]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRoomType({ ...roomType, [e.target.id]: e.target.value });
  };

  const handleAddType = async () => {
    const image = imageRef.current?.files?.[0];

    if (image == undefined) {
      setError("Image is required");
      return;
    }

    const link = await UploadRoomTypeImage(image, image.name, id!);

    if (link == "") {
      setError("Failed to upload image");
      return;
    }

    const data = {
      ...roomType,
      Price: parseFloat(roomType.Price.toString()),
      HotelID: id!,
      ImageLink: link,
    };

    try {
      const url = import.meta.env.VITE_API_URL + "/api/add-room-type";
      await post(url, data);
    } catch (error: any) {
      setError(error.message);
      return;
    }

    setError("");

    await addDoc(collection(firestore, "room-types"), {
      data: "hai",
    });

    alert("Room type added successfully");
    setShowModal(false);
  };

  const handleCartChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData((data) => ({
      ...data,
      [e.target.id]: e.target.value,
    }));
  };

  const handleAddToCart = async (roomTypeID: string) => {
    const payload = {
      ...data,
      RoomTypeID: roomTypeID,
    };

    console.log(payload);
    try {
      const url = import.meta.env.VITE_API_URL + "/api/add-to-hotel-cart";
      await post(url, payload);
    } catch (error: any) {
      alert(error.message);
      setError(error.message);
      return;
    }

    setError("");
    setData((prev) => ({
      ...prev,
      CheckInDate: "",
      CheckOutDate: "",
    }));
    await addDoc(collection(firestore, "room-types"), {
      data: "Hai",
    });
    alert("Successfully added to cart!");
  };

  return (
    <>
      <NavbarLayout>
        <Error error={error} />
        <Wrapper>
          <Container>
            <img src={hotel.ImageLink} />
            <Content>
              <Link to="/hotels">&lt;&ensp;Back to hotels</Link>
              <h3>Rating: {hotel.AverageRating}</h3>
              <RatingItems>
                <Rating>
                  <MdOutlineCleanHands size={25} width={25} />
                  Cleanliness: {hotel.CleanlinessRating}
                </Rating>
                <Rating>
                  <CgViewComfortable size={25} width={25} />
                  Comfort: {hotel.ComfortRating}
                </Rating>
                <Rating>
                  <FaMapLocationDot size={25} width={25} />
                  Location: {hotel.LocationRating}
                </Rating>
                <Rating>
                  <MdOutlineRoomService size={25} width={25} />
                  Service: {hotel.ServiceRating}
                </Rating>
              </RatingItems>
              <h1>{hotel.HotelName}</h1>
              <Location>
                <CiLocationOn size={25} width={25} /> {hotel.Address}
              </Location>
              <h3>
                {hotel.CityName}, {hotel.CountryName}
              </h3>
              <p>{hotel.Description}</p>
            </Content>
          </Container>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            {role == "admin" && (
              <Button onClick={() => setShowModal(true)}>Add room type</Button>
            )}
          </div>
          {hotel.RoomTypes &&
            hotel.RoomTypes.map((roomType, index) => (
              <div key={index} style={{ width: "100%" }}>
                <h3>{roomType.RoomType}</h3>
                <h3>Price: {displayCurrency(roomType.Price)}</h3>
                <img
                  src={roomType.ImageLink}
                  alt={`${roomType.RoomType} Image`}
                />
                <p>Stock: {roomType.Stock}</p>
                <div>
                  <Form>
                    <Horizontal>
                      <Vertical>
                        <label>Check in Date</label>
                        <Input
                          type="date"
                          id="CheckInDate"
                          onChange={handleCartChange}
                          value={data.CheckInDate}
                        />
                      </Vertical>
                      <Vertical>
                        <label>Check out Date</label>
                        <Input
                          type="date"
                          id="CheckOutDate"
                          onChange={handleCartChange}
                          value={data.CheckOutDate}
                        />
                      </Vertical>
                      <Vertical>
                        <Button
                          type="button"
                          onClick={() => handleAddToCart(roomType.RoomTypeID)}
                        >
                          Add to Cart
                        </Button>
                        <Button type="button">Buy Now</Button>
                      </Vertical>
                    </Horizontal>
                  </Form>
                </div>
              </div>
            ))}
          <ButtonContainer>
            <Button type="button" onClick={handleChangeReview} id="cleanliness">
              Cleanliness (
              {hotel.CleanlinessReviews ? hotel.CleanlinessReviews.length : 0})
            </Button>
            <Button type="button" onClick={handleChangeReview} id="comfort">
              Comfort ({hotel.ComfortReviews ? hotel.ComfortReviews.length : 0})
            </Button>
            <Button type="button" onClick={handleChangeReview} id="location">
              Location (
              {hotel.LocationReviews ? hotel.LocationReviews.length : 0})
            </Button>
            <Button type="button" onClick={handleChangeReview} id="service">
              Service ({hotel.ServiceReviews ? hotel.ServiceReviews.length : 0})
            </Button>
          </ButtonContainer>
          {reviews.reviews &&
            reviews.reviews.map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))}
          {reviews.id != "" && reviews.reviews.length == 0 && (
            <h3>No reviews for {reviews.id}</h3>
          )}
        </Wrapper>
      </NavbarLayout>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Vertical>
          <Title>Add Room Type</Title>
          <Vertical>
            <label>Room Type</label>
            <Input type="text" id="RoomType" onChange={handleChange} />
          </Vertical>
          <Vertical>
            <label>Price (In USD)</label>
            <Input type="number" id="Price" onChange={handleChange} />
          </Vertical>
          <Vertical>
            <label>Image</label>
            <Input type="file" ref={imageRef} />
          </Vertical>
          <Error error={error} />
          <Button type="button" onClick={handleAddType}>
            Add
          </Button>
        </Vertical>
      </Modal>
    </>
  );
}

export default HotelDetailPage;
