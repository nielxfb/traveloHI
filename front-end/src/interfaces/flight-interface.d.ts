export interface IFlight {
    FlightID: string;
    AirlineCode: string;
    AirlineNumber: string;
    DestinationAirportCode: string;
    OriginAirportCode: string;
    DepartureTime: Date;
    ArrivalTime: Date;
    SeatTotal: number;
    Price: number;
}