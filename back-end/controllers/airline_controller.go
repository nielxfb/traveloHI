package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nielxfb/TPA-Web-TraveloHI/database"
	"github.com/nielxfb/TPA-Web-TraveloHI/models"
)

func AddAirline(ctx *gin.Context) {
	var body models.Airline

	err := ctx.Bind(&body)

	if err != nil {

		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to read body",
		})
		return
	}

	if body.AirlineName == "" || body.AirlineCode == "" || body.ImageLink == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "All fields must be filled",
		})
		return
	}

	db := database.Connection()

	var airline models.Airline

	if err := db.Where("airline_name = ?", body.AirlineName).First(&airline).Error; err == nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Airline already exists",
		})
		return
	}

	if err = db.Create(&body).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to create airline",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Airline created",
	})
}
