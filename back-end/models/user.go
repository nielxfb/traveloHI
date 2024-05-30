package models

import (
	"time"
)

type User struct {
	ID                 string `gorm:"primaryKey"`
	Email              string
	Password           string
	FirstName          string
	LastName           string
	PhoneNumber        string
	DOB                time.Time
	Address            string
	Gender             string
	ProfilePictureLink string
	Role               string
	Subscribe          bool
	LoggedIn           bool
	IsBanned           bool
	OTPCode            string
	OTPCreatedAt       time.Time
	CreditCards        []CreditCard      `gorm:"foreignKey:UserID;references:ID"`
	HotelCarts         []CartHotelTicket `gorm:"foreignKey:UserID;references:ID"`
	FlightCarts        []CartFlightTicket `gorm:"foreignKey:UserID;references:ID"`
}

type PersonalSecurityQuestion struct {
	QuestionID int `gorm:"primaryKey"`
	Answer     string
	UserID     string `gorm:"primaryKey"`
}

type Wallet struct {
	UserID string `gorm:"primaryKey"`
	Balance float64
}
