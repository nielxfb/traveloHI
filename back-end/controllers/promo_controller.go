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

func AddPromo(ctx *gin.Context) {
	var body models.Promo

	err := ctx.Bind(&body)

	if err != nil {

		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	if body.PromoCode == "" || body.ImageLink == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "All fields must be filled",
		})
		return
	}

	if body.DiscountValue < 0 || body.DiscountValue > 100 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Discount value must be between 0 and 100",
		})
		return
	}

	db := database.Connection()

	var promo models.Promo

	if err := db.Where("promo_code = ?", body.PromoCode).First(&promo).Error; err == nil {

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Promo already exists",
		})
		return
	}

	var lastPromo models.Promo
	newPromo := false

	if err := db.Order("promo_id desc").Limit(1).Find(&lastPromo).Error; err != nil {

		if errors.Is(err, gorm.ErrRecordNotFound) {
			newPromo = true
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to fetch last promo",
			})
			return
		}
	}

	latestID := lastPromo.PromoID

	var latestNumber int

	if newPromo || latestID == "" {
		latestNumber = 0
	} else {
		numberPart := strings.TrimPrefix(latestID, "PR")

		latestNumber, err = strconv.Atoi(numberPart)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to convert latest promo id to number",
			})
			return
		}
	}

	latestNumber++

	ID := fmt.Sprintf("PR%03d", latestNumber)

	body.PromoID = ID

	if err := db.Create(&body).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create promo",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Promo created",
	})
}

func FetchPromos(ctx *gin.Context) {
	db := database.Connection()

	var promos []models.Promo

	db.Find(&promos)

	ctx.JSON(http.StatusOK, promos)
}

func UpdatePromo(ctx *gin.Context) {
	var body models.Promo

	err := ctx.Bind(&body)

	if err != nil {
		fmt.Println(err)
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	if body.PromoID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Promo ID must be filled",
		})
		return
	}

	if body.PromoCode == "" || body.ImageLink == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "All fields must be filled",
		})
		return
	}

	if body.DiscountValue < 1 || body.DiscountValue > 100 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Discount value must be between 1 and 100",
		})
		return
	}

	db := database.Connection()

	var promo models.Promo

	if err := db.Where("promo_id = ?", body.PromoID).First(&promo).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Promo not found",
		})
		return
	}

	if err := db.Model(&promo).Updates(&body).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update promo",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Promo updated",
	})
}

func CheckPromo(ctx *gin.Context) {
	var body struct {
		PromoCode string
	}

	err := ctx.Bind(&body)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	if body.PromoCode == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Promo code must be filled",
		})
		return
	}

	db := database.Connection()

	var promo models.Promo

	if err := db.Where("promo_code = ?", body.PromoCode).First(&promo).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Promo not found",
		})
		return
	}

	ctx.JSON(http.StatusOK, promo)
}
