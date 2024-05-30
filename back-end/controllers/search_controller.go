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

func generateID() (string, error) {
	var latestSearch models.SearchHistory
	db := database.Connection()
	newUser := false
	if err := db.Order("search_id desc").Limit(1).Find(&latestSearch).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			newUser = true
		} else {
			return "", err
		}
	}

	if latestSearch.SearchID == "" || newUser {
		return "SH001", nil
	} else {
		id := strings.TrimPrefix(latestSearch.SearchID, "SH")
		number, err := strconv.Atoi(id)
		if err != nil {
			return "", err
		}
		number++
		return fmt.Sprintf("SH%03d", number), nil
	}
}

func FetchTop5RecentSearches(ctx *gin.Context) {
	db := database.Connection()

	var searches []models.Search

	if err := db.Order("count desc").Limit(5).Find(&searches).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch top 5 recent searches",
		})
		return
	}

	var response []string

	for _, search := range searches {
		response = append(response, search.Query)
	}

	fmt.Println(response)

	ctx.JSON(http.StatusOK, response)
}

func FetchHistory(ctx *gin.Context) {
	ID := ctx.Param("id")

	db := database.Connection()

	var userSearchHistory []models.SearchHistory

	if err := db.Order("search_id DESC").Where("user_id = ?", ID).Limit(3).Find(&userSearchHistory).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch user search history",
		})
		return
	}

	var response struct {
		SearchHistory []string
	}

	for _, history := range userSearchHistory {
		response.SearchHistory = append(response.SearchHistory, history.Query)
	}

	ctx.JSON(http.StatusOK, response)
}

func HandleSearch(ctx *gin.Context) {
	var body struct {
		Query  string
		UserID string
	}

	err := ctx.Bind(&body)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	if body.Query == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Query must be filled",
		})
		return
	}

	if body.UserID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "User ID must be filled",
		})
		return
	}

	db := database.Connection()

	var hotels []models.Hotel
	var flights []models.Flight

	query := "%" + strings.ToLower(body.Query) + "%"

	if err := db.Joins("Location").Where("LOWER(hotel_name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(city_name) LIKE ? OR LOWER(country_name) LIKE ?", query, query, query, query).Find(&hotels).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch hotels",
		})
		return
	}

	if err := db.Joins("JOIN airlines ON flights.airline_code = airlines.airline_code").Joins("JOIN airports ON airports.airport_code = flights.origin_airport_code OR airports.airport_code = flights.destination_airport_code").Joins("JOIN locations ON locations.location_id = airports.location_id").Where("LOWER(airlines.airline_code) LIKE ? OR LOWER(airline_number) LIKE ? OR LOWER(destination_airport_code) LIKE ? OR LOWER(origin_airport_code) LIKE ? OR LOWER(airport_name) LIKE ? OR LOWER(city_name) LIKE ? OR LOWER(country_name) LIKE ?", query, query, query, query, query, query, query).Find(&flights).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch flights",
		})
		return
	}

	var search models.Search

	if err := db.Where("query = ?", body.Query).Find(&search).Error; err == nil {
		search.Count++
		db.Save(&search)
	} else {
		search.Query = body.Query
		search.Count = 1
		db.Create(&search)
	}

	newId, err := generateID()
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to generate search id",
		})
		return
	}

	newHistory := models.SearchHistory{
		SearchID: newId,
		UserID:   body.UserID,
		Query:    body.Query,
	}

	if err := db.Create(&newHistory).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create search history",
		})
		return
	}

	response := struct {
		Hotels  []models.Hotel
		Flights []models.Flight
	}{
		Hotels:  hotels,
		Flights: flights,
	}

	ctx.JSON(http.StatusOK, response)
}
