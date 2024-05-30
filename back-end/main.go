package main

import (
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/nielxfb/TPA-Web-TraveloHI/controllers"
	"github.com/nielxfb/TPA-Web-TraveloHI/database"
	"github.com/nielxfb/TPA-Web-TraveloHI/initializers"
	"github.com/nielxfb/TPA-Web-TraveloHI/models"
	"github.com/nielxfb/TPA-Web-TraveloHI/seed"

	_ "github.com/nielxfb/TPA-Web-TraveloHI/docs"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func initDB() {
	db := database.Connection()
	models.Migrate(db)
	seed.Seed(db)
}

// @title           TraveloHI API Documentation
// @version         1.0
// @description     API Documentation for Web Programming TPA 23-2.
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.url    http://www.swagger.io/support
// @contact.email  support@swagger.io

// @license.name  Apache 2.0
// @license.url   http://www.apache.org/licenses/LICENSE-2.0.html

// @host      localhost:3000
// @BasePath  /api

// @securityDefinitions.basic  BasicAuth

// @externalDocs.description  OpenAPI
// @externalDocs.url          https://swagger.io/resources/open-api/
func main() {
	initializers.LoadEnvVariables()
	initDB()
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:" + os.Getenv("FRONT_END_PORT")},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE"},
		AllowHeaders:     []string{"Content-Type"},
		AllowCredentials: true,
		MaxAge:           12 * 3600,
	}))

	r.GET("/api/users", controllers.GetUsers)
	r.GET("/api/fetch-hotel-recommendations", controllers.FetchHotelRecommendations)
	r.GET("/api/fetch-promos", controllers.FetchPromos)
	r.GET("/api/fetch-credit-cards/:id", controllers.FetchCreditCards)
	r.GET("/api/fetch-banks", controllers.FetchBanks)
	r.GET("/api/fetch-hotels", controllers.FetchHotels)
	r.GET("/api/fetch-hotel/:id", controllers.FetchHotelByID)
	r.GET("/api/fetch-top-5-searches", controllers.FetchTop5RecentSearches)
	r.GET("/api/fetch-history/:id", controllers.FetchHistory)
	r.GET("/api/fetch-flights", controllers.FetchFlights)
	r.GET("/api/fetch-flight/:id", controllers.FetchFlightByID)
	r.GET("/api/fetch-user-carts/:id", controllers.FetchUserCarts)
	r.GET("/api/fetch-ongoing-tickets/:id", controllers.FetchOngoingTickets)
	r.GET("/api/fetch-wallet-balance/:id", controllers.FetchUserWallet)
	r.GET("/api/fetch-flight-recommendations", controllers.FetchFlightRecommendations)
	r.GET("/api/fetch-ongoing-tickets-count/:id", controllers.FetchOngoingTicketsCount)
	r.GET("/api/fetch-expired-tickets/:id", controllers.FetchExpiredTickets)

	r.POST("/api/sign-up", controllers.SignUp)
	r.POST("/api/login", controllers.Login)
	r.POST("/api/fetch-questions", controllers.FetchQuestions)
	r.POST("/api/validate-question-answer", controllers.ValidateQuestionAndAnswer)
	r.POST("/api/send-otp", controllers.SendOTP)
	r.POST("/api/validate-otp", controllers.ValidateOTP)
	r.POST("/api/ban-user", controllers.BanUser)
	r.POST("/api/send-email", controllers.SendEmail)
	r.POST("/api/add-location", controllers.AddLocation)
	r.POST("/api/add-hotel", controllers.AddHotel)
	r.POST("/api/add-airline", controllers.AddAirline)
	r.POST("/api/add-promo", controllers.AddPromo)
	r.POST("/api/add-credit-card", controllers.AddCreditCard)
	r.POST("/api/add-room-type", controllers.AddRoomType)
	r.POST("/api/search", controllers.HandleSearch)
	r.POST("/api/add-to-hotel-cart", controllers.AddToHotelCart)
	r.POST("/api/add-to-flight-cart", controllers.AddToFlightCart)
	r.POST("/api/check-promo", controllers.CheckPromo)
	r.POST("/api/checkout", controllers.HandleCheckout)
	r.POST("/api/add-review", controllers.AddReview)

	r.PUT("/api/update-promo", controllers.UpdatePromo)
	r.PUT("/api/logout", controllers.LogOut)
	r.PUT("/api/update-user", controllers.UpdateUser)
	r.PUT("/api/update-password", controllers.UpdatePassword)
	r.PUT("/api/update-check-in-date", controllers.UpdateCheckInDate)
	r.PUT("/api/update-check-out-date", controllers.UpdateCheckOutDate)
	r.PUT("/api/update-wallet-balance", controllers.UpdateWalletBalance)

	r.DELETE("/api/remove-flight-from-cart/:id", controllers.RemoveFlightFromCart)
	r.DELETE("/api/delete-user/:id", controllers.DeleteUser)

	port := os.Getenv("PORT")
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	r.Run(":" + port)
}
