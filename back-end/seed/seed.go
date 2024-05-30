package seed

import (
	"time"

	"github.com/nielxfb/TPA-Web-TraveloHI/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func generatePassword(password string) []byte {
	hash, _ := bcrypt.GenerateFromPassword([]byte(password), 10)
	return hash
}

func generateDob(dobValue string) time.Time {
	dob, _ := time.Parse("2006-01-02", dobValue)
	return dob
}

func Seed(db *gorm.DB) {
	questions := []models.Questions{
		{
			ID:       1,
			Question: "What is your favorite childhood pet's name?",
		},
		{
			ID:       2,
			Question: "In which city were you born?",
		},
		{
			ID:       3,
			Question: "What is the name of your favorite book or movie?",
		},
		{
			ID:       4,
			Question: "What is the name of the elementary school you attended?",
		},
		{
			ID:       5,
			Question: "What is the model of your first car?",
		},
	}

	db.Create(&questions)

	users := []models.User{
		{
			ID:                 "US001",
			Email:              "admin@travelohi.com",
			Password:           string(generatePassword("admin123")),
			FirstName:          "TraveloHI",
			LastName:           "Admin",
			PhoneNumber:        "081234567890",
			DOB:                generateDob("2001-01-01"),
			Address:            "Jakarta",
			Gender:             "Male",
			ProfilePictureLink: "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
			Role:               "admin",
			Subscribe:          false,
			LoggedIn:           false,
			IsBanned:           false,
		},
		{
			ID:                 "US002",
			Email:              "adamludnl@gmail.com",
			Password:           string(generatePassword("^Newtpa123$")),
			FirstName:          "Daniel",
			LastName:           "Adamlu",
			PhoneNumber:        "081234567890",
			DOB:                generateDob("2004-04-27"),
			Address:            "Jakarta",
			Gender:             "Male",
			ProfilePictureLink: "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
			Role:               "user",
			Subscribe:          true,
			LoggedIn:           false,
			IsBanned:           false,
		},
		{
			ID:                 "US003",
			Email:              "adamlu376@gmail.com",
			Password:           string(generatePassword("^Newtpa123$")),
			FirstName:          "Daniel",
			LastName:           "Adamlu",
			PhoneNumber:        "081234567890",
			DOB:                generateDob("2004-04-27"),
			Address:            "Jakarta",
			Gender:             "Male",
			ProfilePictureLink: "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
			Role:               "user",
			Subscribe:          true,
			LoggedIn:           false,
			IsBanned:           false,
		},
	}

	db.Create(&users)

	wallets := []models.Wallet{
		{
			UserID:  "US001",
			Balance: 1000000,
		},
		{
			UserID:  "US002",
			Balance: 1000000,
		},

		{
			UserID:  "US003",
			Balance: 1000000,
		},
	}

	db.Create(&wallets)

	personalSecurityQuestions := []models.PersonalSecurityQuestion{
		{
			QuestionID: 1,
			Answer:     "Hendra",
			UserID:     "US001",
		},
		{
			QuestionID: 1,
			Answer:     "Hendra",
			UserID:     "US002",
		},
		{
			QuestionID: 2,
			Answer:     "Medan",
			UserID:     "US002",
		},
		{
			QuestionID: 1,
			Answer:     "Hendra",
			UserID:     "US003",
		},
	}

	db.Create(&personalSecurityQuestions)

	banks := []models.Bank{
		{
			BankID:   "BN001",
			BankName: "BCA",
		},
		{
			BankID:   "BN002",
			BankName: "BNI",
		},
		{
			BankID:   "BN003",
			BankName: "BRI",
		},
		{
			BankID:   "BN004",
			BankName: "Mandiri",
		},
		{
			BankID:   "BN005",
			BankName: "CIMB Niaga",
		},
		{
			BankID:   "BN006",
			BankName: "Maybank",
		},
		{
			BankID:   "BN007",
			BankName: "OCBC NISP",
		},
	}

	db.Create(&banks)

	creditCards := []models.CreditCard{
		{
			ID:           "CC001",
			UserID:       "US001",
			CardNumber:   "1234567890123456",
			BankID:       "BN001",
			ExpiredMonth: 12,
			ExpiredYear:  2026,
			CVV:          "123",
		},
	}

	db.Create(&creditCards)

	promos := []models.Promo{
		{
			PromoID:       "PR001",
			PromoCode:     "232MANTAPEUY",
			DiscountValue: 50,
			ImageLink:     "https://firebasestorage.googleapis.com/v0/b/travelohi-abb3f.appspot.com/o/promo-images%2F232MANTAPEUY.jpg?alt=media&token=113121ed-b025-4c12-bae2-392050fc7c40",
		},
		{
			PromoID:       "PR002",
			PromoCode:     "MANTAPSEKALI",
			DiscountValue: 70,
			ImageLink:     "https://firebasestorage.googleapis.com/v0/b/travelohi-abb3f.appspot.com/o/promo-images%2FMANTAPSEKALI?alt=media&token=08e9ec65-bca3-4927-8f27-16d717a93b65",
		},
		{
			PromoID:       "PR003",
			PromoCode:     "TESTINGMANTAP",
			DiscountValue: 80,
			ImageLink:     "https://firebasestorage.googleapis.com/v0/b/travelohi-abb3f.appspot.com/o/promo-images%2FTESTINGMANTAP?alt=media&token=f627c141-4d68-4e86-a68d-972285a939a7",
		},
		{
			PromoID:       "PR004",
			PromoCode:     "TPAWEBGACOR",
			DiscountValue: 90,
			ImageLink:     "https://firebasestorage.googleapis.com/v0/b/travelohi-abb3f.appspot.com/o/promo-images%2FTPAWEBGACOR.png?alt=media&token=a373c9bc-6727-40bf-9528-e8f3f024a108",
		},
	}

	db.Create(&promos)

	locations := []models.Location{
		{
			LocationID:  "LO001",
			CityName:    "Jakarta Selatan",
			CountryName: "Indonesia",
			Address:     "Jl. DR. Ide Anak Agung Gde Agung Kav.E.1.1 No.1, RT.5/RW.2, Kuningan, Kuningan Tim., Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12950",
		},
		{
			LocationID:  "LO002",
			CityName:    "Bandung",
			CountryName: "Indonesia",
			Address:     "Jl. Asia Afrika No. 65, Bandung Wetan, Kota Bandung, Jawa Barat 40111",
		},
		{
			LocationID:  "LO003",
			CityName:    "Yogyakarta",
			CountryName: "Indonesia",
			Address:     "Jl. Laksda Adisucipto No.Km 6,5, Terban, Gondokusuman, Kec. Gondokusuman, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55281",
		},
		{
			LocationID:  "LO004",
			CityName:    "Surabaya",
			CountryName: "Indonesia",
			Address:     "Jl. Mayjen Sungkono No.120, Dukuh Pakis, Kec. Dukuhpakis, Kota SBY, Jawa Timur 60225",
		},
		{
			LocationID:  "LO005",
			CityName:    "Bali",
			CountryName: "Indonesia",
			Address:     "Jl. Raya Nusa Dua Selatan, Kawasan Sawangan, Benoa, Kec. Kuta Sel., Kabupaten Badung, Bali 80363",
		},
		{
			LocationID:  "LO006",
			CityName:    "Tangerang",
			CountryName: "Indonesia",
			Address:     "Soekarno Hatta International Airport",
		},
		{
			LocationID:  "LO007",
			CityName:    "Bandung",
			CountryName: "Indonesia",
			Address:     "Husein Sastranegara International Airport",
		},
	}

	db.Create(&locations)

	hotels := []models.Hotel{
		{
			HotelID:     "HT001",
			HotelName:   "The Ritz-Carlton Jakarta, Mega Kuningan",
			Description: "The Ritz-Carlton Jakarta, Mega Kuningan offers a luxury hotel experience in Indonesia, with spacious rooms and suites, a spa and exceptional dining.",
			LocationID:  "LO001",
			ImageLink:   "https://firebasestorage.googleapis.com/v0/b/travelohi-abb3f.appspot.com/o/hotel-images%2FScreenshot%202024-01-01%20at%2015.50.36.png?alt=media&token=37b16f5d-eb97-4673-8e77-0f997476b756",
			AC: true,
			SwimmingPool: true,
			WiFi: true,
			Restaurant: true,
			Elevator: true,
		},
		{
			HotelID:     "HT002",
			HotelName:   "Sheraton Bandung Hotel & Towers",
			Description: "Sheraton Bandung Hotel & Towers offers an upscale accommodation option in Bandung, featuring modern amenities and breathtaking views of the city.",
			LocationID:  "LO002",
			ImageLink:   "https://firebasestorage.googleapis.com/v0/b/travelohi-abb3f.appspot.com/o/hotel-images%2FS__12558345.jpg?alt=media&token=3e8e3092-03a0-4331-9db4-7d708aef4caa",
			AC: false,
			SwimmingPool: false,
			WiFi: false,
			Restaurant: true,
			Elevator: true,
		},
		{
			HotelID:     "HT003",
			HotelName:   "Hyatt Regency Yogyakarta",
			Description: "Hyatt Regency Yogyakarta provides guests with a tranquil retreat in the heart of Yogyakarta, boasting luxurious rooms, lush gardens, and authentic dining experiences.",
			LocationID:  "LO003",
			ImageLink:   "https://firebasestorage.googleapis.com/v0/b/travelohi-abb3f.appspot.com/o/hotel-images%2FScreenshot%202023-09-27%20at%2010.47.39.png?alt=media&token=b8505679-b3c0-4828-886b-3d1468b96795",
			AC: true,
			SwimmingPool: true,
			WiFi: true,
			Restaurant: true,
			Elevator: false,
		},
		{
			HotelID:     "HT004",
			HotelName:   "Shangri-La Hotel Surabaya",
			Description: "Shangri-La Hotel Surabaya offers elegant accommodations and exceptional service in Surabaya, perfect for both business and leisure travelers.",
			LocationID:  "LO004",
			ImageLink:   "https://firebasestorage.googleapis.com/v0/b/travelohi-abb3f.appspot.com/o/hotel-images%2FScreenshot%202024-02-28%20at%2010.12.26.png?alt=media&token=8670a382-d706-4f46-a7a6-4f38b624a1ff",
			AC: true,
			SwimmingPool: true,
			WiFi: false,
			Restaurant: true,
			Elevator: true,
		},
		{
			HotelID:     "HT005",
			HotelName:   "The Ritz-Carlton Bali",
			Description: "The Ritz-Carlton Bali provides guests with a luxurious escape in Bali, featuring stunning ocean views, exquisite dining options, and world-class amenities.",
			LocationID:  "LO005",
			ImageLink:   "https://firebasestorage.googleapis.com/v0/b/travelohi-abb3f.appspot.com/o/hotel-images%2FScreenshot%202024-01-05%20at%2013.53.32.png?alt=media&token=ed365af0-7b10-482e-807c-5665e6e25e6b",
			AC: true,
			SwimmingPool: true,
			WiFi: true,
			Restaurant: true,
			Elevator: true,
		},
	}

	db.Create(&hotels)

	reviewTypes := []models.ReviewType{
		{
			ReviewTypeID: "RT001",
			ReviewType:   "Cleanliness",
		},
		{
			ReviewTypeID: "RT002",
			ReviewType:   "Comfort",
		},
		{
			ReviewTypeID: "RT003",
			ReviewType:   "Location",
		},
		{
			ReviewTypeID: "RT004",
			ReviewType:   "Service",
		},
	}

	db.Create(&reviewTypes)

	reviews := []models.Review{
		{
			ReviewID:     "RV001",
			UserID:       "US002",
			HotelID:      "HT001",
			ReviewTypeID: "RT001",
			Rating:       5,
			ReviewDesc:   "The room is very clean and tidy, I love it!",
			IsAnonymous:  true,
		},
		{
			ReviewID:     "RV002",
			UserID:       "US002",
			HotelID:      "HT001",
			ReviewTypeID: "RT002",
			Rating:       4,
			ReviewDesc:   "The room is very comfortable, I can sleep well!",
			IsAnonymous:  false,
		},
	}

	db.Create(&reviews)

	historySearches := []models.SearchHistory{
		{
			UserID:   "US001",
			SearchID: "SH001",
			Query:    "Jakarta",
		},
		{
			UserID:   "US002",
			SearchID: "SH002",
			Query:    "Surabaya",
		},
	}

	db.Create(&historySearches)

	searches := []models.Search{
		{
			Query: "Jakarta",
			Count: 1,
		},
		{
			Query: "Surabaya",
			Count: 1,
		},
	}

	db.Create(&searches)

	airports := []models.Airport{
		{
			AirportCode: "CGK",
			AirportName: "Soekarno-Hatta International Airport",
			LocationID:  "LO006",
		},
		{
			AirportCode: "BDO",
			AirportName: "Husein Sastranegara International Airport",
			LocationID:  "LO007",
		},
	}

	db.Create(&airports)

	airlines := []models.Airline{
		{
			AirlineCode: "GA",
			AirlineName: "Garuda Indonesia",
			ImageLink:   "https://firebasestorage.googleapis.com/v0/b/travelohi-abb3f.appspot.com/o/airline-images%2FGaruda_Indonesia.png?alt=media&token=48de9f69-32e1-4be1-990f-0cfd9f97f68e",
		},
		{
			AirlineCode: "SQ",
			AirlineName: "Singapore Airlines",
			ImageLink:   "https://firebasestorage.googleapis.com/v0/b/travelohi-abb3f.appspot.com/o/airline-images%2FSingapore_Airlines.png?alt=media&token=cb813ca4-bad5-43e8-ab30-28837eda5534",
		},
	}

	db.Create(&airlines)

	flights := []models.Flight{
		{
			FlightID:               "FL001",
			AirlineCode:            "GA",
			AirlineNumber:          "182",
			DestinationAirportCode: "CGK",
			OriginAirportCode:      "BDO",
			DepartureTime:          time.Date(2024, 3, 1, 8, 0, 0, 0, time.UTC),
			ArrivalTime:            time.Date(2024, 3, 1, 9, 0, 0, 0, time.UTC),
			SeatTotal:              96,
			Price:                  1000,
		},
		{
			FlightID:               "FL002",
			AirlineCode:            "GA",
			AirlineNumber:          "183",
			DestinationAirportCode: "BDO",
			OriginAirportCode:      "CGK",
			DepartureTime:          time.Date(2024, 4, 1, 10, 0, 0, 0, time.UTC),
			ArrivalTime:            time.Date(2024, 4, 1, 11, 0, 0, 0, time.UTC),
			SeatTotal:              96,
			Price:                  1000,
		},
		{
			FlightID:               "FL003",
			AirlineCode:            "SQ",
			AirlineNumber:          "182",
			DestinationAirportCode: "CGK",
			OriginAirportCode:      "BDO",
			DepartureTime:          time.Date(2024, 4, 1, 8, 0, 0, 0, time.UTC),
			ArrivalTime:            time.Date(2024, 4, 1, 9, 0, 0, 0, time.UTC),
			SeatTotal:              96,
			Price:                  1000,
		},
		{
			FlightID:               "FL004",
			AirlineCode:            "SQ",
			AirlineNumber:          "183",
			DestinationAirportCode: "BDO",
			OriginAirportCode:      "CGK",
			DepartureTime:          time.Date(2024, 4, 1, 10, 0, 0, 0, time.UTC),
			ArrivalTime:            time.Date(2024, 4, 1, 11, 0, 0, 0, time.UTC),
			SeatTotal:              96,
			Price:                  1000,
		},
		{
			FlightID:               "FL005",
			AirlineCode:            "GA",
			AirlineNumber:          "182",
			DestinationAirportCode: "CGK",
			OriginAirportCode:      "BDO",
			DepartureTime:          time.Date(2024, 4, 2, 8, 0, 0, 0, time.UTC),
			ArrivalTime:            time.Date(2024, 4, 2, 9, 0, 0, 0, time.UTC),
			SeatTotal:              96,
			Price:                  1000,
		},
	}

	db.Create(&flights)

	roomTypes := []models.RoomType{
		{
			RoomTypeID: "RT001",
			RoomType:   "Deluxe Room",
			HotelID:    "HT001",
			Price:      1000,
			Stock:      100,
			ImageLink:  "",
		},
	}

	db.Create(&roomTypes)

	hotelTickets := []models.HotelTicket{
		{
			TicketID:     "TK001",
			UserID:       "US002",
			HotelID:      "HT001",
			RoomTypeID:   "RT001",
			CheckInDate:  time.Date(2024, 3, 1, 14, 0, 0, 0, time.UTC),
			CheckOutDate: time.Date(2024, 3, 3, 12, 0, 0, 0, time.UTC),
		},
		{
			TicketID:     "TK002",
			UserID:       "US002",
			HotelID:      "HT001",
			RoomTypeID:   "RT001",
			CheckInDate:  time.Date(2024, 4, 7, 14, 0, 0, 0, time.UTC),
			CheckOutDate: time.Date(2024, 4, 9, 12, 0, 0, 0, time.UTC),
		},
	}

	db.Create(&hotelTickets)

	flightTickets := []models.FlightTicket{
		{
			TicketID:   "TK001",
			UserID:     "US002",
			FlightID:   "FL001",
			SeatNumber: 11,
		},
	}

	db.Create(&flightTickets)
}
