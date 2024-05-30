package models

type Bank struct {
	BankID   string `gorm:"primaryKey"`
	BankName string
	CreditCards []CreditCard `gorm:"foreignKey:BankID;references:BankID"`
}