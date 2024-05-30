package models

type Rating struct {
	UserID  string `gorm:"primaryKey"`
	User    User   `gorm:"foreignKey:UserID"`
	HotelID string `gorm:"primaryKey"`
	Hotel   Hotel  `gorm:"foreignKey:HotelID"`
	Rating  float64
}
