package models

type Hotel struct {
	HotelID      string `gorm:"primaryKey"`
	HotelName    string
	Description  string
	LocationID   string
	Location     Location
	ImageLink    string
	AC           bool
	SwimmingPool bool
	WiFi         bool
	Restaurant   bool
	Elevator     bool
	RoomTypes    []RoomType        `gorm:"foreignKey:HotelID;references:HotelID"`
	Reviews      []Review          `gorm:"foreignKey:HotelID;references:HotelID"`
	CartHotels   []CartHotelTicket `gorm:"foreignKey:HotelID;references:HotelID"`
	HotelTickets []HotelTicket     `gorm:"foreignKey:HotelID;references:HotelID"`
}
