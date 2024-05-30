package controllers

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/nielxfb/TPA-Web-TraveloHI/database"
	"github.com/nielxfb/TPA-Web-TraveloHI/models"
	"gorm.io/gorm"
)

func AddHotel(ctx *gin.Context) {
	var body models.Hotel

	err := ctx.Bind(&body)

	if err != nil {

		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	if body.HotelName == "" || body.Description == "" || body.LocationID == "" || body.ImageLink == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "All fields must be filled",
		})
		return
	}

	db := database.Connection()

	var hotel models.Hotel

	if err := db.Where("hotel_name = ?", body.HotelName).First(&hotel).Error; err == nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Hotel already exists",
		})
		return
	}

	var lastHotel models.Hotel
	newHotel := false

	if err := db.Order("hotel_id desc").Limit(1).Find(&lastHotel).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			newHotel = true
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to fetch last hotel",
			})
		}
		return
	}

	latestID := lastHotel.HotelID

	var latestNumber int

	if newHotel || latestID == "" {
		latestNumber = 0
	} else {
		numberPart := strings.TrimPrefix(latestID, "HT")

		latestNumber, err = strconv.Atoi(numberPart)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to convert hotel id to number",
			})
			return
		}
	}

	latestNumber++

	ID := fmt.Sprintf("HT%03d", latestNumber)

	body.HotelID = ID

	if err := db.Create(&body).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create hotel",
		})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "Hotel created",
	})
}

func FetchHotelRecommendations(ctx *gin.Context) {
	db := database.Connection()

	var hotels []models.Hotel

	if err := db.Preload("Location").Find(&hotels).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch hotels",
		})
		return
	}

	var response []struct {
		HotelID     string
		HotelName   string
		CityName    string
		CountryName string
	}

	for _, hotel := range hotels {
		response = append(response, struct {
			HotelID     string
			HotelName   string
			CityName    string
			CountryName string
		}{
			HotelID:     hotel.HotelID,
			HotelName:   hotel.HotelName,
			CityName:    hotel.Location.CityName,
			CountryName: hotel.Location.CountryName,
		})
	}

	ctx.JSON(http.StatusOK, response)
}

func FetchHotels(ctx *gin.Context) {
	db := database.Connection()

	var hotels []models.Hotel

	if err := db.Preload("Location").Find(&hotels).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch hotels",
		})
		return
	}

	var response []struct {
		HotelID     string
		HotelName   string
		CityName    string
		CountryName string
		ImageLink   string
	}

	for _, hotel := range hotels {
		response = append(response, struct {
			HotelID     string
			HotelName   string
			CityName    string
			CountryName string
			ImageLink   string
		}{
			HotelID:     hotel.HotelID,
			HotelName:   hotel.HotelName,
			CityName:    hotel.Location.CityName,
			CountryName: hotel.Location.CountryName,
			ImageLink:   hotel.ImageLink,
		})
	}

	ctx.JSON(http.StatusOK, response)
}

func FetchHotelByID(ctx *gin.Context) {
	db := database.Connection()

	ID := ctx.Param("id")

	var hotel models.Hotel

	if err := db.Preload("Location").Preload("RoomTypes").Preload("Reviews").Preload("Reviews.ReviewType").Where("hotel_id = ?", ID).First(&hotel).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch hotel",
		})
		return
	}

	var averageRating float64
	var cleanlinessRating float64
	var comfortRating float64
	var locationRating float64
	var serviceRating float64

	db.Select("AVG(rating)").Where("hotel_id = ?", ID).Table("reviews").Row().Scan(&averageRating)

	db.Select("AVG(rating)").Where("hotel_id = ? AND review_type_id = ?", ID, "RT001").Table("reviews").Row().Scan(&cleanlinessRating)

	db.Select("AVG(rating)").Where("hotel_id = ? AND review_type_id = ?", ID, "RT002").Table("reviews").Row().Scan(&comfortRating)

	db.Select("AVG(rating)").Where("hotel_id = ? AND review_type_id = ?", ID, "RT003").Table("reviews").Row().Scan(&locationRating)

	db.Select("AVG(rating)").Where("hotel_id = ? AND review_type_id = ?", ID, "RT004").Table("reviews").Row().Scan(&serviceRating)

	responses := struct {
		HotelID           string
		HotelName         string
		Description       string
		Address           string
		CityName          string
		CountryName       string
		ImageLink         string
		AverageRating     float64
		CleanlinessRating float64
		ComfortRating     float64
		LocationRating    float64
		ServiceRating     float64
		RoomTypes         []struct {
			RoomTypeID string
			RoomType   string
			Price      float64
			Stock      int
			ImageLink  string
		}
		CleanlinessReviews []struct {
			ReviewID   string
			UserID     string
			Rating     float64
			ReviewDesc string
		}
		ComfortReviews []struct {
			ReviewID   string
			UserID     string
			Rating     float64
			ReviewDesc string
		}
		LocationReviews []struct {
			ReviewID   string
			UserID     string
			Rating     float64
			ReviewDesc string
		}
		ServiceReviews []struct {
			ReviewID   string
			UserID     string
			Rating     float64
			ReviewDesc string
		}
	}{
		HotelID:           hotel.HotelID,
		HotelName:         hotel.HotelName,
		Description:       hotel.Description,
		Address:           hotel.Location.Address,
		CityName:          hotel.Location.CityName,
		CountryName:       hotel.Location.CountryName,
		ImageLink:         hotel.ImageLink,
		AverageRating:     averageRating,
		CleanlinessRating: cleanlinessRating,
		ComfortRating:     comfortRating,
		LocationRating:    locationRating,
		ServiceRating:     serviceRating,
	}

	for _, roomType := range hotel.RoomTypes {
		responses.RoomTypes = append(responses.RoomTypes, struct {
			RoomTypeID string
			RoomType   string
			Price      float64
			Stock      int
			ImageLink  string
		}{
			RoomTypeID: roomType.RoomTypeID,
			RoomType:   roomType.RoomType,
			Price:      roomType.Price,
			Stock:      roomType.Stock,
			ImageLink:  roomType.ImageLink,
		})
	}

	for _, review := range hotel.Reviews {
		if review.ReviewType.ReviewType == "Cleanliness" {
			responses.CleanlinessReviews = append(responses.CleanlinessReviews, struct {
				ReviewID   string
				UserID     string
				Rating     float64
				ReviewDesc string
			}{
				ReviewID:   review.ReviewID,
				UserID:     review.UserID,
				Rating:     review.Rating,
				ReviewDesc: review.ReviewDesc,
			})
		} else if review.ReviewType.ReviewType == "Comfort" {
			responses.ComfortReviews = append(responses.ComfortReviews, struct {
				ReviewID   string
				UserID     string
				Rating     float64
				ReviewDesc string
			}{
				ReviewID:   review.ReviewID,
				UserID:     review.UserID,
				Rating:     review.Rating,
				ReviewDesc: review.ReviewDesc,
			})
		} else if review.ReviewType.ReviewType == "Location" {
			responses.LocationReviews = append(responses.LocationReviews, struct {
				ReviewID   string
				UserID     string
				Rating     float64
				ReviewDesc string
			}{
				ReviewID:   review.ReviewID,
				UserID:     review.UserID,
				Rating:     review.Rating,
				ReviewDesc: review.ReviewDesc,
			})
		} else if review.ReviewType.ReviewType == "Service" {
			responses.ServiceReviews = append(responses.ServiceReviews, struct {
				ReviewID   string
				UserID     string
				Rating     float64
				ReviewDesc string
			}{
				ReviewID:   review.ReviewID,
				UserID:     review.UserID,
				Rating:     review.Rating,
				ReviewDesc: review.ReviewDesc,
			})
		}
	}

	ctx.JSON(http.StatusOK, responses)
}

func AddRoomType(ctx *gin.Context) {
	var body models.RoomType

	err := ctx.Bind(&body)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	if body.HotelID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Hotel ID must be filled",
		})
		return
	}

	if body.RoomType == "" || body.Price == 0 || body.ImageLink == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "All fields must be filled",
		})
		return
	}

	if body.Price < 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Price invalid",
		})
		return
	}

	db := database.Connection()

	var hotel models.Hotel

	if err := db.Where("hotel_id = ?", body.HotelID).Find(&hotel).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Hotel not found",
		})
		return
	}

	var roomType models.RoomType

	if err := db.Where("room_type = ? AND hotel_id = ?", body.RoomType, body.HotelID).First(&roomType).Error; err == nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Room type already exists",
		})
		return
	}

	var latestType models.RoomType
	newType := false

	if err := db.Order("room_type_id desc").Limit(1).Find(&latestType).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			newType = true
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
		return
	}

	var newId string
	if newType || latestType.RoomTypeID == "" {
		newId = "RT001"
	} else {
		latestNum := strings.TrimPrefix(latestType.RoomTypeID, "RT")
		number, err := strconv.Atoi(latestNum)
		fmt.Println(latestNum)
		fmt.Println(number)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to convert number",
			})
			return
		}
		number++
		newId = fmt.Sprintf("RT%03d", number)
	}

	body.RoomTypeID = newId
	body.Stock = 100

	db.Create(&body)

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "Room type created",
	})
}
