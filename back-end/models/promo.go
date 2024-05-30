package models

type Promo struct {
	PromoID       string `gorm:"primaryKey"`
	PromoCode     string
	DiscountValue int
	ImageLink     string
}
