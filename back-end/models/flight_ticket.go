package models

type FlightTicket struct {
	TicketID   string `gorm:"primaryKey"`
	UserID     string
	FlightID   string
	Flight     Flight
	SeatNumber int
}
