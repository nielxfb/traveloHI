package models

type CartFlightTicket struct {
	CartID     string `gorm:"primaryKey"`
	UserID     string
	FlightID   string
	Flight     Flight
	UseLuggage bool
	SeatNumber int
}
