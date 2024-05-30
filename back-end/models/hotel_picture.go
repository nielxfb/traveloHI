package models

type HotelPicture struct {
	PictureID   string `gorm:"primaryKey"`
	HotelID     string `gorm:"primaryKey"`
	Hotel       Hotel  `gorm:"foreignKey:HotelID"`
	PictureLink string
}
