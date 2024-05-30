package models

import (
	"time"
)

type HotelTicket struct {
	TicketID     string `gorm:"primaryKey"`
	UserID       string
	HotelID      string
	Hotel        Hotel
	RoomTypeID   string
	RoomType     RoomType
	CheckInDate  time.Time
	CheckOutDate time.Time
}
