import { ILocation } from "./location-interface";
import { IReview } from "./review-interface";

export interface IHotel {
  HotelID: string;
  HotelName: string;
  Description: string;
  LocationID: string;
  Location: ILocation;
  ImageLink: string;
  AC: boolean;
  SwimmingPool: boolean;
  WiFi: boolean;
  Restaurant: boolean;
  Elevator: boolean;
  Reviews: IReview[];
}
