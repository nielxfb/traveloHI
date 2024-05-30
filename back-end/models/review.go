package models

type Review struct {
	ReviewID     string `gorm:"primaryKey"`
	UserID       string
	HotelID      string
	ReviewTypeID string
	ReviewType   ReviewType
	Rating       float64
	ReviewDesc   string
	IsAnonymous  bool
}
