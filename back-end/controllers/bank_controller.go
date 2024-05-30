package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nielxfb/TPA-Web-TraveloHI/database"
	"github.com/nielxfb/TPA-Web-TraveloHI/models"
)

func FetchBanks(ctx *gin.Context) {
	db := database.Connection()

	var banks []models.Bank

	db.Find(&banks)

	ctx.JSON(http.StatusOK, banks)
}
