package models

type Airline struct {
	AirlineCode string `gorm:"primaryKey"`
	AirlineName string
	ImageLink string
	Flights     []Flight `gorm:"foreignKey:AirlineCode;references:AirlineCode"`
}
