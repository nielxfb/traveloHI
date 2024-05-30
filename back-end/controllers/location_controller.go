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

func AddLocation(ctx *gin.Context) {
	var body models.Location

	err := ctx.Bind(&body)

	if err != nil {

		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})

		return
	}

	if body.CityName == "" || body.CountryName == "" || body.Address == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "All fields must be filled",
		})

		return
	}

	db := database.Connection()

	var location models.Location

	if err := db.Where("city_name = ? AND country_name = ? AND address = ?", body.CityName, body.CountryName, body.Address).First(&location).Error; err == nil {
		ctx.JSON(http.StatusOK, gin.H{
			"ID": location.LocationID,
		})
		return
	}

	var lastLocation models.Location
	newLocation := false

	if err := db.Order("location_id desc").Limit(1).Find(&lastLocation).Error; err != nil {

		if errors.Is(err, gorm.ErrRecordNotFound) {
			newLocation = true
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to fetch last location",
			})

			return
		}
	}

	latestID := lastLocation.LocationID

	var latestNumber int

	if newLocation || latestID == "" {
		latestNumber = 0
	} else {
		numberPart := strings.TrimPrefix(latestID, "LO")

		latestNumber, err = strconv.Atoi(numberPart)
		if err != nil {

			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to convert latest location id",
			})
		}
	}

	latestNumber++

	ID := fmt.Sprintf("LO%03d", latestNumber)

	body.LocationID = ID

	result := db.Create(&body)

	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create location",
		})

		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"ID": ID,
	})
}
