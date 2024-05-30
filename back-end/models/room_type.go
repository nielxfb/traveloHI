package models

type RoomType struct {
	RoomTypeID   string `gorm:"primaryKey"`
	HotelID      string
	RoomType     string
	Price        float64
	Stock        int
	ImageLink    string
	CartRooms    []CartHotelTicket `gorm:"foreignKey:RoomTypeID;references:RoomTypeID"`
	HotelTickets []HotelTicket     `gorm:"foreignKey:RoomTypeID;references:RoomTypeID"`
}
