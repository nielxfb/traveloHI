package models

type Location struct {
	LocationID  string `gorm:"primaryKey"`
	CityName    string
	CountryName string
	Address     string
}
