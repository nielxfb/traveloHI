package models

type ReservedSeat struct {
	SeatID     string `gorm:"primaryKey"`
	FlightID   string
	SeatNumber int
}
