package models

type CreditCard struct {
	ID           string `gorm:"primaryKey"`
	UserID       string
	CardNumber   string
	BankID       string
	Bank         Bank
	ExpiredMonth int
	ExpiredYear  int
	CVV          string
}
