package models

type Airport struct {
	AirportCode string `gorm:"primaryKey"`
	AirportName string
	LocationID  string
	DepartingFlights []Flight `gorm:"foreignKey:OriginAirportCode;references:AirportCode"`
	ArrivingFlights []Flight `gorm:"foreignKey:DestinationAirportCode;references:AirportCode"`
}
