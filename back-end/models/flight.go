package models

import (
	"time"
)

type Flight struct {
	FlightID               string `gorm:"primaryKey"`
	AirlineCode            string
	AirlineNumber          string
	DestinationAirportCode string
	OriginAirportCode      string
	DepartureTime          time.Time
	ArrivalTime            time.Time
	SeatTotal              int
	Price                  float64
	ReservedSeats          []ReservedSeat     `gorm:"foreignKey:FlightID;references:FlightID"`
	CartFlights            []CartFlightTicket `gorm:"foreignKey:FlightID;references:FlightID"`
	FlightTickets          []FlightTicket     `gorm:"foreignKey:FlightID;references:FlightID"`
}
