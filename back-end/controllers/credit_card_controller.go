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

func FetchCreditCards(ctx *gin.Context) {
	ID := ctx.Param("id")

	db := database.Connection()

	var user models.User

	if err := db.Where("id = ?", ID).First(&user).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "User not found",
		})
		return
	}

	var response []struct {
		ID           string
		BankName     string
		CardNumber   string
		ExpiredMonth int
		ExpiredYear  int
		CVV          string
	}

	var creditCards []models.CreditCard

	if err := db.Preload("Bank").Where("user_id = ?", ID).Find(&creditCards).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Credit cards not found",
		})
		return
	}

	for _, card := range creditCards {
		response = append(response, struct {
			ID           string
			BankName     string
			CardNumber   string
			ExpiredMonth int
			ExpiredYear  int
			CVV          string
		}{
			ID:           card.ID,
			BankName:     card.Bank.BankName,
			CardNumber:   card.CardNumber,
			ExpiredMonth: card.ExpiredMonth,
			ExpiredYear:  card.ExpiredYear,
			CVV:          card.CVV,
		})
	}

	ctx.JSON(http.StatusOK, response)
}

func AddCreditCard(ctx *gin.Context) {
	var body struct {
		UserID       string
		BankID       string
		CardNumber   string
		ExpiredMonth int
		ExpiredYear  int
		CVV          string
	}

	err := ctx.Bind(&body)

	if err != nil {

		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	if body.UserID == "" || body.BankID == "" || body.CardNumber == "" || body.CVV == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "All fields must be filled",
		})
		return
	}

	if body.ExpiredMonth == 0 || body.ExpiredYear == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid expired date",
		})
		return
	}

	if body.ExpiredMonth < 0 || body.ExpiredMonth > 12 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid expired month",
		})
		return
	}

	if len(body.CardNumber) != 16 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid card number",
		})
		return
	}

	if len(body.CVV) != 3 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid CVV",
		})
		return
	}

	if body.ExpiredYear < 2024 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Card has expired",
		})
		return
	}

	if body.ExpiredYear == 2024 && body.ExpiredMonth <= int(time.Now().Month()) {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Card has expired",
		})
		return
	}

	db := database.Connection()

	var user models.User

	if err := db.Where("id = ?", body.UserID).First(&user).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "User not found",
		})
		return
	}

	var bank models.Bank

	if err := db.Where("bank_id = ?", body.BankID).First(&bank).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Bank not found",
		})
		return
	}

	var card models.CreditCard

	if err := db.Where("user_id = ? AND card_number = ?", body.UserID, body.CardNumber).First(&card).Error; err == nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Credit card already exists",
		})
		return
	}

	var latestCard models.CreditCard
	newCard := false

	if err := db.Order("id desc").Limit(1).Find(&latestCard).Error; err != nil {

		if errors.Is(err, gorm.ErrRecordNotFound) {
			newCard = true
		} else {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "Failed to get latest credit card",
			})
		}
	}

	latestID := latestCard.ID
	var latestNumber int

	if newCard || latestID == "" {
		latestNumber = 0
	} else {
		numberPart := strings.TrimPrefix(latestID, "CC")
		latestNumber, err = strconv.Atoi(numberPart)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "Failed to get latest credit card",
			})
			return
		}
	}

	latestNumber++

	ID := fmt.Sprintf("CC%03d", latestNumber)

	creditCard := models.CreditCard{
		ID:           ID,
		UserID:       body.UserID,
		CardNumber:   body.CardNumber,
		BankID:       body.BankID,
		ExpiredMonth: body.ExpiredMonth,
		ExpiredYear:  body.ExpiredYear,
		CVV:          body.CVV,
	}

	if err := db.Create(&creditCard).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create credit card",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Credit card added",
	})
}
