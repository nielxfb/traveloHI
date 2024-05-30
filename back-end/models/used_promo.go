package models

type UsedPromo struct {
	UserID  string `gorm:"primaryKey"`
	PromoCode string `gorm:"primaryKey"`
}
