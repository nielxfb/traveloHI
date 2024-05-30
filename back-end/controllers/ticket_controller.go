package controllers

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/nielxfb/TPA-Web-TraveloHI/database"
	"github.com/nielxfb/TPA-Web-TraveloHI/models"
	"gorm.io/gorm"
)

func FetchOngoingTickets(ctx *gin.Context) {
	id := ctx.Param("id")

	db := database.Connection()

	var hotelTickets []models.HotelTicket
	var flightTickets []models.FlightTicket

	if err := db.Preload("RoomType").Preload("Hotel").Where("user_id = ? AND check_in_date > ?", id, time.Now().Format("2006-01-02")).Find(&hotelTickets).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to fetch ongoing hotel tickets",
		})
		return
	}

	if err := db.Preload("Flight").Joins("JOIN flights ON flights.flight_id = flight_tickets.flight_id").Where("user_id = ? AND departure_time > ?", id, time.Now().Format("2006-01-02")).Find(&flightTickets).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to fetch ongoing flight tickets",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"HotelTickets":  hotelTickets,
		"FlightTickets": flightTickets,
	})
}

func FetchOngoingTicketsCount(ctx *gin.Context) {
	id := ctx.Param("id")

	db := database.Connection()

	var hotelTickets []models.HotelTicket
	var flightTickets []models.FlightTicket

	if err := db.Preload("RoomType").Preload("Hotel").Where("user_id = ? AND check_in_date > ?", id, time.Now().Format("2006-01-02")).Find(&hotelTickets).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to fetch ongoing hotel tickets",
		})
		return
	}

	if err := db.Preload("Flight").Joins("JOIN flights ON flights.flight_id = flight_tickets.flight_id").Where("user_id = ? AND departure_time > ?", id, time.Now().Format("2006-01-02")).Find(&flightTickets).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to fetch ongoing flight tickets",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"HotelTicketsCount":  len(hotelTickets),
		"FlightTicketsCount": len(flightTickets),
	})
}

func FetchExpiredTickets(ctx *gin.Context) {
	id := ctx.Param("id")

	db := database.Connection()

	var hotelTickets []models.HotelTicket
	var flightTickets []models.FlightTicket

	if err := db.Preload("RoomType").Preload("Hotel").Where("user_id = ? AND check_in_date < ?", id, time.Now().Format("2006-01-02")).Find(&hotelTickets).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to fetch expired hotel tickets",
		})
		return
	}

	if err := db.Preload("Flight").Joins("JOIN flights ON flights.flight_id = flight_tickets.flight_id").Where("user_id = ? AND departure_time < ?", id, time.Now().Format("2006-01-02")).Find(&flightTickets).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to fetch expired flight tickets",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"HotelTickets":  hotelTickets,
		"FlightTickets": flightTickets,
	})
}

func AddReview(ctx *gin.Context) {
	var body models.Review

	err := ctx.Bind(&body)

	if err != nil {
		fmt.Println(err)
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	if body.UserID == "" || body.HotelID == "" || body.Rating < 1 || body.Rating > 5 || body.ReviewDesc == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid body",
		})
		return
	}

	db := database.Connection()

	var latestReview models.Review
	newUser := false

	if err := db.Order("review_id DESC").First(&latestReview).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			newUser = true
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to fetch latest review",
			})
			return
		}
	}

	if newUser || latestReview.ReviewID == "" {
		body.ReviewID = "RV001"
	} else {
		latestID := strings.TrimPrefix(body.ReviewID, "RV")
		latestNum, _ := strconv.Atoi(latestID)
		latestNum++
		body.ReviewID = fmt.Sprintf("RV%03d", latestNum)
	}

	if err := db.Create(&body).Error; err != nil {
		fmt.Println(err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to add review",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Review added successfully",
	})
}
