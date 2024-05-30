package controllers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/nielxfb/TPA-Web-TraveloHI/database"
	"github.com/nielxfb/TPA-Web-TraveloHI/models"
)

func FetchFlights(ctx *gin.Context) {
	db := database.Connection()

	var flights []models.Flight

	if err := db.Find(&flights).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch flights",
		})
		return
	}

	var response []struct {
		FlightID               string
		Price                  float64
		AirlineCode            string
		AirlineNumber          string
		DestinationAirportCode string
		OriginAirportCode      string
		DepartureTime          time.Time
		ArrivalTime            time.Time
		SeatTotal              int
	}

	for _, flight := range flights {
		response = append(response, struct {
			FlightID               string
			Price                  float64
			AirlineCode            string
			AirlineNumber          string
			DestinationAirportCode string
			OriginAirportCode      string
			DepartureTime          time.Time
			ArrivalTime            time.Time
			SeatTotal              int
		}{
			FlightID:               flight.FlightID,
			Price:                  flight.Price,
			AirlineCode:            flight.AirlineCode,
			AirlineNumber:          flight.AirlineNumber,
			DestinationAirportCode: flight.DestinationAirportCode,
			OriginAirportCode:      flight.OriginAirportCode,
			DepartureTime:          flight.DepartureTime,
			ArrivalTime:            flight.ArrivalTime,
			SeatTotal:              flight.SeatTotal,
		})
	}

	ctx.JSON(http.StatusOK, response)
}

func FetchFlightByID(ctx *gin.Context) {
	id := ctx.Param("id")

	db := database.Connection()

	var flight models.Flight

	if err := db.Where("flight_id = ?", id).First(&flight).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch flight",
		})
		return
	}

	var imageLink string
	var destinationAirport string
	var originAirport string

	if err := db.Table("airlines").Select("image_link").Where("airline_code = ?", flight.AirlineCode).Limit(1).Find(&imageLink).Error; err != nil {
		fmt.Println(err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch airline image",
		})
		return
	}

	if err := db.Table("airports").Select("airport_name").Where("airport_code = ?", flight.DestinationAirportCode).Limit(1).Find(&destinationAirport).Error; err != nil {
		fmt.Println(err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch destination airport",
		})
		return
	}

	if err := db.Table("airports").Select("airport_name").Where("airport_code = ?", flight.OriginAirportCode).Limit(1).Find(&originAirport).Error; err != nil {
		fmt.Println(err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch origin airport",
		})
		return
	}

	var reservedSeats []models.ReservedSeat

	if err := db.Where("flight_id = ?", id).Find(&reservedSeats).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch reserved seats",
		})
		return
	}

	response := struct {
		FlightID               string
		Price                  float64
		AirlineCode            string
		AirlineNumber          string
		DestinationAirportCode string
		DestinationAirport     string
		OriginAirportCode      string
		OriginAirport          string
		DepartureTime          time.Time
		ArrivalTime            time.Time
		SeatTotal              int
		AirlineImage           string
		ReservedSeats          []models.ReservedSeat
	}{
		FlightID:               flight.FlightID,
		Price:                  flight.Price,
		AirlineCode:            flight.AirlineCode,
		AirlineNumber:          flight.AirlineNumber,
		DestinationAirportCode: flight.DestinationAirportCode,
		DestinationAirport:     destinationAirport,
		OriginAirportCode:      flight.OriginAirportCode,
		OriginAirport:          originAirport,
		DepartureTime:          flight.DepartureTime,
		ArrivalTime:            flight.ArrivalTime,
		SeatTotal:              flight.SeatTotal,
		AirlineImage:           imageLink,
		ReservedSeats:          reservedSeats,
	}

	ctx.JSON(http.StatusOK, response)
}

func FetchFlightRecommendations(ctx *gin.Context) {
	db := database.Connection()

	var flights []models.Flight

	if err := db.Limit(5).Find(&flights).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to fetch flight recommendations",
		})
		return
	}

	ctx.JSON(http.StatusOK, flights)
}
