package models

import (
	"time"
)

type TicketHeader struct {
	TicketID        string `gorm:"primaryKey"`
	UserID          string
	User            User `gorm:"foreignKey:UserID"`
	TransactionDate time.Time
	PromoID         string
	Promo           Promo `gorm:"foreignKey:PromoID"`
	PaymentMethod   string
}
