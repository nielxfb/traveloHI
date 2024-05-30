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

func generateHotelId() (string, error) {
	db := database.Connection()

	var lastCart models.CartHotelTicket
	newUser := false

	if err := db.Order("cart_id desc").Limit(1).Find(&lastCart).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			newUser = true
		} else {
			return "", err
		}
	}

	if newUser || lastCart.CartID == "" {
		return "CT001", nil
	}

	id := lastCart.CartID

	number := id[2:]

	numberInt, err := strconv.Atoi(number)

	if err != nil {
		return "", err
	}

	numberInt++

	return fmt.Sprintf("CT%03d", numberInt), nil
}

func AddToHotelCart(ctx *gin.Context) {
	var body struct {
		UserID       string
		HotelID      string
		RoomTypeID   string
		CheckInDate  string
		CheckOutDate string
	}

	if err := ctx.Bind(&body); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	fmt.Println(body)

	if body.UserID == "" || body.HotelID == "" || body.RoomTypeID == "" || body.CheckInDate == "" || body.CheckOutDate == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "All fields must be filled",
		})
		return
	}

	checkIn, err := time.Parse("2006-01-02", body.CheckInDate)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid check in date",
		})
		return
	}

	checkOut, err := time.Parse("2006-01-02", body.CheckOutDate)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid check out date",
		})
		return
	}

	if checkIn.After(checkOut) || checkIn.Equal(checkOut) {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Check in date must be before check out date",
		})
		return
	}

	if checkIn.Before(time.Now()) {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Check in date must be after today",
		})
		return
	}

	db := database.Connection()

	var roomType models.RoomType

	if err := db.Where("room_type_id = ?", body.RoomTypeID).First(&roomType).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Room type not found",
		})
		return
	}

	if roomType.Stock == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Room type out of stock",
		})
		return
	}

	cartID, err := generateHotelId()

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to generate cart ID",
		})
		return
	}

	newCart := models.CartHotelTicket{
		CartID:       cartID,
		UserID:       body.UserID,
		HotelID:      body.HotelID,
		RoomTypeID:   body.RoomTypeID,
		CheckInDate:  checkIn,
		CheckOutDate: checkOut,
	}

	db.Create(&newCart)

	roomType.Stock--

	db.Save(&roomType)

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Added to cart",
	})
}

func generateFlightId() (string, error) {
	db := database.Connection()

	var lastCart models.CartFlightTicket
	newUser := false

	if err := db.Order("cart_id desc").Limit(1).Find(&lastCart).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			newUser = true
		} else {
			return "", err
		}
	}

	if newUser || lastCart.CartID == "" {
		return "CT001", nil
	}

	id := lastCart.CartID

	number := id[2:]

	numberInt, err := strconv.Atoi(number)

	if err != nil {
		return "", err
	}

	numberInt++

	return fmt.Sprintf("CT%03d", numberInt), nil
}

func AddToFlightCart(ctx *gin.Context) {
	var body struct {
		CartID     string
		UserID     string
		FlightID   string
		UseLuggage bool
		Seats      []int
	}

	if err := ctx.Bind(&body); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	if body.UserID == "" || body.FlightID == "" || body.Seats == nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "All fields must be filled",
		})
		return
	}

	latestID, err := generateFlightId()

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to generate cart ID",
		})
		return
	}

	for _, seat := range body.Seats {
		newCart := models.CartFlightTicket{
			CartID:     latestID,
			UserID:     body.UserID,
			FlightID:   body.FlightID,
			SeatNumber: seat,
			UseLuggage: body.UseLuggage,
		}

		db := database.Connection()
		db.Create(&newCart)

		num := latestID[2:]
		numInt, err := strconv.Atoi(num)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": err,
			})
			return
		}
		numInt++
		latestID = fmt.Sprintf("CT%03d", numInt)
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Added to cart",
	})
}

func FetchUserCarts(ctx *gin.Context) {
	id := ctx.Param("id")

	db := database.Connection()

	var hotelCarts []models.CartHotelTicket
	var flightCarts []models.CartFlightTicket

	if err := db.Preload("Hotel").Preload("RoomType").Where("user_id = ?", id).Find(&hotelCarts).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch hotel carts",
		})
		return
	}

	if err := db.Preload("Flight").Where("user_id = ?", id).Find(&flightCarts).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch flight carts",
		})
		return
	}

	var response struct {
		HotelCarts  []models.CartHotelTicket
		FlightCarts []models.CartFlightTicket
	}

	response.HotelCarts = hotelCarts
	response.FlightCarts = flightCarts

	ctx.JSON(http.StatusOK, response)
}

func UpdateCheckInDate(ctx *gin.Context) {
	var body struct {
		CartID      string
		CheckInDate string
	}

	if err := ctx.Bind(&body); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	if body.CartID == "" || body.CheckInDate == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "All fields must be filled",
		})
		return
	}

	checkIn, err := time.Parse("2006-01-02", body.CheckInDate)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid check in date",
		})
		return
	}

	db := database.Connection()

	var cart models.CartHotelTicket

	if err := db.Where("cart_id = ?", body.CartID).First(&cart).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Cart not found",
		})
		return
	}

	if checkIn.After(cart.CheckOutDate) || checkIn.Equal(cart.CheckOutDate) {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Check in date must be before check out date",
		})
		return
	}

	if checkIn.Before(time.Now()) {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Check in date must be after today",
		})
		return
	}

	if err := db.Model(&cart).Where("cart_id = ?", body.CartID).Update("check_in_date", checkIn).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Check in date updated",
	})
}

func UpdateCheckOutDate(ctx *gin.Context) {
	var body struct {
		CartID       string
		CheckOutDate string
	}

	if err := ctx.Bind(&body); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	if body.CartID == "" || body.CheckOutDate == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "All fields must be filled",
		})
		return
	}

	checkOut, err := time.Parse("2006-01-02", body.CheckOutDate)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid check out date",
		})
		return
	}

	db := database.Connection()

	var cart models.CartHotelTicket

	if err := db.Where("cart_id = ?", body.CartID).First(&cart).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Cart not found",
		})
		return
	}

	if checkOut.Before(cart.CheckInDate) || checkOut.Equal(cart.CheckInDate) {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Check out date must be after check in date",
		})
		return
	}

	if checkOut.Before(time.Now()) {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Check out date must be after today",
		})
		return
	}

	if err := db.Model(&cart).Where("cart_id = ?", body.CartID).Update("check_out_date", checkOut).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Check out date updated",
	})
}

func RemoveFlightFromCart(ctx *gin.Context) {
	cartID := ctx.Param("id")

	db := database.Connection()

	var cart models.CartFlightTicket

	if err := db.Where("cart_id = ?", cartID).First(&cart).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Cart not found",
		})
		return
	}

	if err := db.Delete(&cart).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to remove flight from cart",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Flight removed from cart",
	})
}

func generateFlightTicketId() (string, error) {
	db := database.Connection()

	var lastTicket models.FlightTicket
	newUser := false

	if err := db.Order("ticket_id desc").Limit(1).Find(&lastTicket).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			newUser = true
		} else {
			return "", err
		}
	}

	if newUser || lastTicket.TicketID == "" {
		return "TK001", nil
	}

	id := lastTicket.TicketID

	number := id[2:]

	numberInt, err := strconv.Atoi(number)

	if err != nil {
		return "", err
	}

	numberInt++

	return fmt.Sprintf("TK%03d", numberInt), nil
}

func generateHotelTicketId() (string, error) {
	db := database.Connection()

	var lastTicket models.HotelTicket
	newUser := false

	if err := db.Order("ticket_id desc").Limit(1).Find(&lastTicket).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			newUser = true
		} else {
			return "", err
		}
	}

	if newUser || lastTicket.TicketID == "" {
		return "TK001", nil
	}

	id := lastTicket.TicketID

	number := id[2:]

	numberInt, err := strconv.Atoi(number)

	if err != nil {
		return "", err
	}

	numberInt++

	return fmt.Sprintf("TK%03d", numberInt), nil
}

func HandleCheckout(ctx *gin.Context) {
	var body struct {
		UserID          string
		PromoCode       string
		UsingWallet     bool
		UsingCreditCard bool
		CreditCardID    string
		TotalPrice      float64
	}

	if err := ctx.Bind(&body); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	if body.UsingWallet {
		var userWallet models.Wallet
		db := database.Connection()
		if err := db.Where("user_id = ?", body.UserID).First(&userWallet).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "User not found",
			})
			return
		}

		if userWallet.Balance < 0 {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "Insufficient balance",
			})
			return
		}
	} else if body.UsingCreditCard {
		if body.CreditCardID == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "Credit card must be filled",
			})
			return
		}

		var creditCard models.CreditCard
		db := database.Connection()

		if err := db.Where("id = ?", body.CreditCardID).First(&creditCard).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Credit card not found",
			})
			return
		}
	}

	db := database.Connection()

	var promo models.Promo

	if body.PromoCode != "" {
		if err := db.Where("promo_code = ?", body.PromoCode).First(&promo).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Promo not found",
			})
			return
		}

		var usedPromo models.UsedPromo

		if err := db.Where("user_id = ? AND promo_code = ?", body.UserID, body.PromoCode).First(&usedPromo).Error; err == nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Promo used",
			})
			return
		}
	}

	var hotelCarts []models.CartHotelTicket
	var flightCarts []models.CartFlightTicket

	if err := db.Preload("Hotel").Preload("RoomType").Where("user_id = ?", body.UserID).Find(&hotelCarts).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch hotel carts",
		})
		return
	}

	if err := db.Preload("Flight").Where("user_id = ?", body.UserID).Find(&flightCarts).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch flight carts",
		})
		return
	}

	for _, cart := range hotelCarts {
		if cart.CheckInDate.Before(time.Now()) {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "Expired ticket",
			})
			return
		}
	}

	for _, cart := range flightCarts {
		if cart.Flight.DepartureTime.Before(time.Now()) {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "Expired ticket",
			})
			return
		}
	}

	if body.PromoCode != "" {
		body.TotalPrice -= (body.TotalPrice * float64(promo.DiscountValue/100))

		db.Create(&models.UsedPromo{
			UserID:    body.UserID,
			PromoCode: body.PromoCode,
		})
	}

	var user models.User
	if err := db.Where("id = ?", body.UserID).First(&user).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "User not found",
		})
		return
	}

	if body.UsingWallet {
		var userWallet models.Wallet

		if err := db.Where("user_id = ?", body.UserID).First(&userWallet).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "User not found",
			})
			return
		}

		if userWallet.Balance < body.TotalPrice {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "Insufficient balance",
			})
			return
		}

		userWallet.Balance -= body.TotalPrice

		if err := db.Save(&userWallet).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to update wallet balance",
			})
			return
		}
	} else if body.UsingCreditCard {
		var creditCard models.CreditCard
		if err := db.Where("id = ?", body.CreditCardID).First(&creditCard).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Credit card not found",
			})
			return
		}
	}

	for _, cart := range hotelCarts {
		if err := db.Where("cart_id = ?", cart.CartID).Delete(&cart).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to remove hotel from cart",
			})
			return
		}
	}

	for _, cart := range flightCarts {
		if err := db.Where("cart_id = ?", cart.CartID).Delete(&cart).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to remove flight from cart",
			})
			return
		}
	}

	for _, cart := range hotelCarts {
		id, _ := generateHotelTicketId()
		newTicket := models.HotelTicket{
			TicketID:     id,
			UserID:       body.UserID,
			HotelID:      cart.HotelID,
			RoomTypeID:   cart.RoomTypeID,
			CheckInDate:  cart.CheckInDate,
			CheckOutDate: cart.CheckOutDate,
		}

		if err := db.Create(&newTicket).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to create hotel ticket",
			})
			return
		}
	}

	for _, cart := range flightCarts {
		id, _ := generateFlightTicketId()
		newTicket := models.FlightTicket{
			TicketID:   id,
			UserID:     body.UserID,
			FlightID:   cart.FlightID,
			SeatNumber: cart.SeatNumber,
		}

		if err := db.Create(&newTicket).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to create flight ticket",
			})
			return
		}

		reservedSeat := models.ReservedSeat{
			FlightID:   cart.FlightID,
			SeatNumber: cart.SeatNumber,
			SeatID:     fmt.Sprintf("ST%s", strings.TrimPrefix(id, "TK")),
		}

		db.Create(&reservedSeat)
	}

	var finalString string

	subject := "Thank you for trusting traveloHI as your travel agent. Here are the details of your transaction.\n"

	for _, cart := range hotelCarts {
		finalString = fmt.Sprintf("%sHotel Name: %s\nHotel Price: %f\nRoom Type: %s\nCheck In Date: %s\nCheck Out Date: %s\n\n", subject, cart.Hotel.HotelName, cart.RoomType.Price*(float64(cart.CheckOutDate.Sub(cart.CheckInDate).Hours()/24)), cart.RoomType.RoomType, cart.CheckInDate.GoString(), cart.CheckOutDate.GoString())
		subject = finalString
	}

	for _, cart := range flightCarts {
		finalString = fmt.Sprintf("%sAirline Number:%s%s\nOrigin: %s\nDestination: %s\nSeat Number: %d\n\n", subject, cart.Flight.AirlineCode, cart.Flight.AirlineNumber, cart.Flight.OriginAirportCode, cart.Flight.DestinationAirportCode, cart.SeatNumber)
		subject = finalString
	}

	sendEmail(user.Email, "Successfully made transaction!", finalString)

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Checkout success",
	})
}
