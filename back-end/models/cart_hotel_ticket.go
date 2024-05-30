package models

import (
	"time"
)

type CartHotelTicket struct {
	CartID       string
	UserID       string
	HotelID      string
	Hotel        Hotel
	RoomTypeID   string
	RoomType     RoomType
	CheckInDate  time.Time
	CheckOutDate time.Time
}
