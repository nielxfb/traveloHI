package controllers

import (
	"errors"
	"fmt"
	"math/rand"
	"net/http"
	"net/smtp"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/nielxfb/TPA-Web-TraveloHI/database"
	"github.com/nielxfb/TPA-Web-TraveloHI/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func isEmailFormat(email string) (bool, error) {
	emailRegex := `^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`
	return regexp.MatchString(emailRegex, email)
}

func containsSymbol(string string) bool {
	symbolRegex := `[\W_]`
	return regexp.MustCompile(symbolRegex).MatchString(string)
}

func validatePassword(password string) bool {
	passwordRegex := `^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,30}$`
	return regexp.MustCompile(passwordRegex).MatchString(password)
}

func obtainAge(dob time.Time) int {
	currentTime := time.Now()

	if dob.After(currentTime) {
		return -1
	}

	age := currentTime.Year() - dob.Year()

	if currentTime.YearDay() < dob.YearDay() {
		age--
	}

	return age
}

func sendEmail(email string, subject string, body string) error {
	from := os.Getenv("AUTH_EMAIL")
	password := os.Getenv("AUTH_PASSWORD")
	to := []string{email}
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")

	auth := smtp.PlainAuth("", from, password, smtpHost)

	message := []byte("Subject: " + subject + "\n\n" + body)

	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, message)

	return err
}

func SignUp(ctx *gin.Context) {

	var body struct {
		Email                     string
		Password                  string
		FirstName                 string
		LastName                  string
		PhoneNumber               string
		DOB                       string
		Address                   string
		Gender                    string
		ProfilePictureLink        string
		PersonalSecurityQuestions []struct {
			QuestionID int
			Answer     string
		}
		Subscribe bool
	}

	err := ctx.Bind(&body)

	if err != nil {

		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})

		return
	}

	dob, err := time.Parse("2006-01-02", body.DOB)
	if err != nil {

		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to parse date",
		})

		return
	}

	if body.Email == "" || body.Password == "" || body.FirstName == "" || body.LastName == "" || body.PhoneNumber == "" || body.DOB == "" || body.Address == "" || body.Gender == "" || body.ProfilePictureLink == "" || body.PersonalSecurityQuestions == nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "All fields are required",
		})

		return
	}

	if emailValid, _ := isEmailFormat(body.Email); !emailValid {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid email format",
		})

		return
	}

	if len(body.FirstName) < 5 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "First name must be at least 5 characters",
		})

		return
	}

	if len(body.LastName) < 5 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Last name must be at least 5 characters",
		})

		return
	}

	if containsSymbol(body.FirstName) {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "First name cannot contain symbols",
		})

		return
	}

	if containsSymbol(body.LastName) {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Last name cannot contain symbols",
		})

		return
	}

	if obtainAge(dob) < 13 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "User must be at least 13 years old",
		})

		return
	}

	if !validatePassword(body.Password) {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Password contains invalid characters",
		})

		return
	}

	if body.Gender != "Male" && body.Gender != "Female" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid gender",
		})

		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), 10)

	if err != nil {

		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to hash password",
		})

		return
	}

	db := database.Connection()

	var users []models.User

	if err := db.Where("email = ?", body.Email).Find(&users).Error; err != nil {

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error while retrieving users",
		})

		return
	}

	if len(users) > 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "User already registered",
		})

		return
	}

	var lastUser models.User

	newUser := false

	if err := db.Order("id desc").Limit(1).Find(&lastUser).Error; err != nil {

		if errors.Is(err, gorm.ErrRecordNotFound) {
			newUser = true
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Error while retrieving user",
			})
			return
		}
	}

	latestID := lastUser.ID

	var latestNumber int

	if newUser || latestID == "" {
		latestNumber = 0
	} else {
		numberPart := strings.TrimPrefix(latestID, "US")

		latestNumber, err = strconv.Atoi(numberPart)
		if err != nil {

			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Error while generating ID",
			})
		}
	}

	latestNumber++

	ID := fmt.Sprintf("US%03d", latestNumber)

	user := models.User{
		ID:                 ID,
		Email:              body.Email,
		Password:           string(hash),
		FirstName:          body.FirstName,
		LastName:           body.LastName,
		PhoneNumber:        body.PhoneNumber,
		DOB:                dob,
		Address:            body.Address,
		Gender:             body.Gender,
		Role:               "user",
		ProfilePictureLink: body.ProfilePictureLink,
		Subscribe:          body.Subscribe,
		LoggedIn:           false,
		IsBanned:           false,
	}

	result := db.Create(&user)

	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create user",
		})

		return
	}

	var personalSecurityQuestions []models.PersonalSecurityQuestion

	for _, question := range body.PersonalSecurityQuestions {
		personalSecurityQuestions = append(personalSecurityQuestions, models.PersonalSecurityQuestion{
			QuestionID: question.QuestionID,
			Answer:     question.Answer,
			UserID:     ID,
		})
	}

	result = db.Create(&personalSecurityQuestions)

	if result.Error != nil {

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to upload personal security questions",
		})

		return
	}

	userWallet := models.Wallet{
		UserID:  ID,
		Balance: 0,
	}

	db.Create(&userWallet)

	err = sendEmail(body.Email, "Thank you for registering!", "Sign Up Success! Welcome to traveloHI")
	if err != nil {

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to send email",
		})

		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Successfully created new user!",
	})

}

func Login(ctx *gin.Context) {

	var body struct {
		Email    string
		Password string
	}

	err := ctx.Bind(&body)

	if err != nil {

		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})

		return
	}

	if body.Email == "" || body.Password == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Email and password are required",
		})

		return
	}

	if emailValid, _ := isEmailFormat(body.Email); !emailValid {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid email format",
		})

		return
	}

	db := database.Connection()

	var user models.User

	result := db.Where("email = ?", body.Email).First(&user)

	if result.Error != nil {

		if result.Error.Error() == "record not found" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "User not found",
			})

			return
		}

		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to query database",
		})

		return
	}

	if user.IsBanned {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "User is banned",
		})

		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))

	if err != nil {

		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid password",
		})

		return
	}

	if user.LoggedIn {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "User is logged in!",
		})

		return
	}

	firstName := user.FirstName
	lastName := user.LastName
	phoneNumber := user.PhoneNumber
	dob := user.DOB
	address := user.Address
	gender := user.Gender
	role := user.Role
	profilePictureLink := user.ProfilePictureLink
	isBanned := user.IsBanned
	loggedIn := user.LoggedIn
	subscribe := user.Subscribe

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":                user.ID,
		"exp":                time.Now().Add(time.Hour * 24).Unix(),
		"Email":              body.Email,
		"FirstName":          firstName,
		"LastName":           lastName,
		"PhoneNumber":        phoneNumber,
		"DOB":                dob,
		"Address":            address,
		"Gender":             gender,
		"Role":               role,
		"ProfilePictureLink": profilePictureLink,
		"IsBanned":           isBanned,
		"LoggedIn":           loggedIn,
		"Subscribe":          subscribe,
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET_KEY")))

	if err != nil {

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to generate token",
		})

		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"token": tokenString,
	})

	user.LoggedIn = true

	db.Save(&user)
}
// LogOut godoc
// @Summary Log out user
// @Description Log out user
// @Tags User
// @Accept json
// @Produce json
// @Param id body string true "ID"
// @Success 200 {string} string
// @Router /logout [put]
func LogOut(ctx *gin.Context) {
	var body struct {
		ID string
	}

	ctx.Bind(&body)

	if body.ID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "ID is required",
		})

		return
	}

	db := database.Connection()

	var user models.User

	result := db.Where("id = ?", body.ID).First(&user)

	if result.Error != nil {

		if result.Error.Error() == "record not found" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "User not found",
			})

			return
		}

		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to query database",
		})

		return
	}

	user.LoggedIn = false

	db.Save(&user)

	ctx.JSON(http.StatusOK, gin.H{
		"message": "User logged out",
	})
}

// GetUsers godoc
// @Summary Get all users
// @Description Get all users
// @Tags User
// @Accept json
// @Produce json
// @Success 200 {object} []models.User
// @Router /users [get]
func GetUsers(ctx *gin.Context) {
	db := database.Connection()

	var users []models.User

	result := db.Find(&users)

	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve users",
		})

		return
	}

	ctx.JSON(http.StatusOK, users)
}

func BanUser(ctx *gin.Context) {
	var body struct {
		Email string
	}

	err := ctx.Bind(&body)

	if err != nil {

		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})

		return
	}

	if body.Email == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Email is required",
		})

		return
	}

	db := database.Connection()

	var user models.User

	result := db.Where("email = ?", body.Email).First(&user)

	if result.Error != nil {

		if result.Error.Error() == "record not found" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "User not found",
			})

			return
		}

		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to query database",
		})

		return
	}

	user.IsBanned = true

	db.Save(&user)

	ctx.JSON(http.StatusOK, gin.H{
		"message": "User has been banned",
	})
}

func SendEmail(ctx *gin.Context) {
	var body struct {
		Subject string
		Message string
	}

	err := ctx.Bind(&body)

	if err != nil {

		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})

		return
	}

	if body.Subject == "" || body.Message == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Subject and message are required",
		})

		return
	}

	var receiverEmails []string

	db := database.Connection()

	var users []models.User

	result := db.Where("subscribe = ?", true).Find(&users)

	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to query subscribed users",
		})
		return
	}

	for _, user := range users {
		receiverEmails = append(receiverEmails, user.Email)
	}

	for _, receiver := range receiverEmails {
		err = sendEmail(receiver, body.Subject, body.Message)

		if err != nil {

			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to send email",
			})

			return
		}
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Email sent successfully",
	})

}

func isNumeric(s string) bool {
	numericRegex := regexp.MustCompile(`^[0-9]+$`)
	return numericRegex.MatchString(s)
}

func UpdateUser(ctx *gin.Context) {
	type UserResponse struct {
		Email                     string
		Password                  string
		FirstName                 string
		LastName                  string
		PhoneNumber               string
		DOB                       string
		Address                   string
		Gender                    string
		ProfilePictureLink        string
		PersonalSecurityQuestions []struct {
			Question string
			Answer   string
		}
		Subscribe bool
	}

	type RequestBody struct {
		Sub  string       `json:"sub"`
		User UserResponse `json:"user"`
	}

	var body RequestBody

	if err := ctx.ShouldBindJSON(&body); err != nil {

		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})

		return
	}

	if body.Sub == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "User ID is required",
		})

		return
	}

	if body.User.Email == "" || body.User.FirstName == "" || body.User.LastName == "" || body.User.PhoneNumber == "" || body.User.DOB == "" || body.User.Address == "" || body.User.Gender == "" || body.User.ProfilePictureLink == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "All fields are required",
		})

		return
	}

	if emailValid, _ := isEmailFormat(body.User.Email); !emailValid {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid email format",
		})

		return
	}

	if len(body.User.FirstName) < 5 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "First name must be at least 5 characters",
		})

		return
	}

	if len(body.User.LastName) < 5 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Last name must be at least 5 characters",
		})

		return
	}

	if containsSymbol(body.User.FirstName) {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "First name cannot contain symbols",
		})

		return
	}

	if containsSymbol(body.User.LastName) {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Last name cannot contain symbols",
		})

		return
	}

	dob, err := time.Parse("2006-01-02", body.User.DOB)

	if err != nil {

		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to parse date",
		})

		return
	}

	if obtainAge(dob) < 13 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "User must be at least 13 years old",
		})

		return
	}

	if !isNumeric(body.User.PhoneNumber) {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Phone number must be numeric",
		})

		return
	}

	db := database.Connection()

	var user models.User

	result := db.Where("id = ?", body.Sub).First(&user)

	if result.Error != nil {

		if result.Error.Error() == "record not found" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "User not found",
			})

			return
		}

		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to query database",
		})

		return
	}

	user.Email = body.User.Email
	user.FirstName = body.User.FirstName
	user.LastName = body.User.LastName
	user.PhoneNumber = body.User.PhoneNumber
	user.DOB = dob
	user.Address = body.User.Address
	user.Gender = body.User.Gender
	user.ProfilePictureLink = body.User.ProfilePictureLink
	user.Subscribe = body.User.Subscribe

	db.Save(&user)

	ctx.JSON(http.StatusOK, gin.H{
		"message": "User updated successfully",
	})
}

func SendOTP(ctx *gin.Context) {
	var body struct {
		Email string
	}

	err := ctx.Bind(&body)

	if err != nil {

		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})

		return
	}

	if body.Email == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Email is required",
		})

		return
	}

	if emailValid, _ := isEmailFormat(body.Email); !emailValid {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid email format",
		})

		return
	}

	var user models.User

	db := database.Connection()

	result := db.Where("email = ?", body.Email).First(&user)

	if result.Error != nil {
		if result.Error.Error() == "record not found" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "User not found",
			})

			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to query database",
		})

		return
	}

	if user.IsBanned {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "User is banned",
		})

		return
	}

	source := rand.NewSource(time.Now().UnixNano())

	random := rand.New(source)

	randomNumber := random.Intn(900000) + 100000

	user.OTPCode = strconv.Itoa(randomNumber)

	user.OTPCreatedAt = time.Now()

	db.Save(&user)

	err = sendEmail(body.Email, "Your OTP Code", "Your OTP Code is "+user.OTPCode+" and will expire in 5 minutes.")

	if err != nil {

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to send email",
		})

		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "OTP sent successfully",
	})
}

func ValidateOTP(ctx *gin.Context) {
	var body struct {
		Email string
		OTP   string
	}

	err := ctx.Bind(&body)

	if err != nil {

		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})

		return
	}

	if body.Email == "" || body.OTP == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Email and OTP are required",
		})

		return
	}

	if len(body.OTP) != 6 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "OTP must be 6 digits",
		})

		return
	}

	if !isNumeric(body.OTP) {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "OTP must be numeric",
		})

		return
	}

	db := database.Connection()

	var user models.User

	result := db.Where("email = ?", body.Email).First(&user)

	if result.Error != nil {
		if result.Error.Error() == "record not found" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "User not found",
			})

			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to query database",
		})

		return
	}

	if user.OTPCode != body.OTP {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid OTP",
		})

		return
	}

	if time.Since(user.OTPCreatedAt).Minutes() > 5 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "OTP has expired",
		})

		return
	}

	firstName := user.FirstName
	lastName := user.LastName
	phoneNumber := user.PhoneNumber
	dob := user.DOB
	address := user.Address
	gender := user.Gender
	role := user.Role
	profilePictureLink := user.ProfilePictureLink
	isBanned := user.IsBanned
	loggedIn := user.LoggedIn
	subscribe := user.Subscribe

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":                user.ID,
		"exp":                time.Now().Add(time.Hour * 24).Unix(),
		"Email":              body.Email,
		"FirstName":          firstName,
		"LastName":           lastName,
		"PhoneNumber":        phoneNumber,
		"DOB":                dob,
		"Address":            address,
		"Gender":             gender,
		"Role":               role,
		"ProfilePictureLink": profilePictureLink,
		"IsBanned":           isBanned,
		"LoggedIn":           loggedIn,
		"Subscribe":          subscribe,
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET_KEY")))

	if err != nil {

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to generate token",
		})

		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"token": tokenString,
	})

	user.LoggedIn = true

	db.Save(&user)
}

// FetchQuestions godoc
// @Summary Fetch security questions
// @Description Fetch security questions
// @Tags User
// @Accept json
// @Produce json
// @Param email body string true "Email"
// @Success 200 {object} []int
// @Router /fetch-questions [post]
func FetchQuestions(ctx *gin.Context) {
	var body struct {
		Email string
	}

	err := ctx.Bind(&body)

	if err != nil {

		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})

		return
	}

	db := database.Connection()

	var user models.User

	result := db.Where("email = ?", body.Email).First(&user)

	if result.Error != nil {
		if result.Error.Error() == "record not found" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "User not found",
			})

			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to query database",
		})

		return
	}

	if user.IsBanned {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "User is banned",
		})

		return
	}

	var personalSecurityQuestions []models.PersonalSecurityQuestion

	result = db.Where("user_id = ?", user.ID).Find(&personalSecurityQuestions)

	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve personal security questions",
		})

		return
	}

	var questionIDS []int

	for _, question := range personalSecurityQuestions {
		questionIDS = append(questionIDS, question.QuestionID)
	}

	ctx.JSON(http.StatusOK, questionIDS)
}

func ValidateQuestionAndAnswer(ctx *gin.Context) {
	var body struct {
		Email      string
		QuestionID int
		Answer     string
	}

	err := ctx.Bind(&body)

	if err != nil {

		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})

		return
	}

	if body.Email == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Email is required",
		})

		return
	}

	if body.QuestionID == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Question ID is required",
		})

		return
	}

	if body.Answer == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Answer is required",
		})

		return
	}

	db := database.Connection()

	var user models.User

	result := db.Where("email = ?", body.Email).First(&user)

	if result.Error != nil {
		if result.Error.Error() == "record not found" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "User not found",
			})

			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to query database",
		})

		return
	}

	if user.IsBanned {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "User is banned",
		})

		return
	}

	var personalSecurityQuestion models.PersonalSecurityQuestion

	result = db.Where("user_id = ? AND question_id = ?", user.ID, body.QuestionID).First(&personalSecurityQuestion)

	if result.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve personal security question",
		})

		return
	}

	if personalSecurityQuestion.Answer != body.Answer {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid answer",
		})

		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Answer is valid",
	})
}

func UpdatePassword(ctx *gin.Context) {
	var body struct {
		Email    string
		Password string
	}

	err := ctx.Bind(&body)

	if err != nil {

		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})

		return
	}

	if body.Email == "" || body.Password == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Email and password are required",
		})

		return
	}

	if emailValid, _ := isEmailFormat(body.Email); !emailValid {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid email format",
		})

		return
	}

	if !validatePassword(body.Password) {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Password contains invalid characters",
		})

		return
	}

	db := database.Connection()

	var user models.User

	result := db.Where("email = ?", body.Email).First(&user)

	if result.Error != nil {
		if result.Error.Error() == "record not found" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "User not found",
			})

			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to query database",
		})

		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))

	if err == nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "New password cannot be the same as the old password",
		})

		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), 10)

	if err != nil {

		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to hash password",
		})

		return
	}

	user.Password = string(hash)

	db.Save(&user)

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Password updated successfully",
	})
}

func FetchUserWallet(ctx *gin.Context){
	id := ctx.Param("id")

	db := database.Connection()

	var userWallet models.Wallet

	result := db.Where("user_id = ?", id).First(&userWallet)

	if result.Error != nil {
		if result.Error.Error() == "record not found" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "User not found",
			})

			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to query database",
		})

		return
	}

	ctx.JSON(http.StatusOK, userWallet.Balance)
}

func UpdateWalletBalance(ctx *gin.Context) {
	var body struct {
		UserID        string
		WalletBalance float64
	}

	if err := ctx.Bind(&body); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	if body.UserID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "User ID is required",
		})
		return
	}

	if body.WalletBalance < 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Wallet balance cannot be negative",
		})
		return
	}

	db := database.Connection()

	var userWallet models.Wallet

	result := db.Where("user_id = ?", body.UserID).First(&userWallet)

	if result.Error != nil {
		if result.Error.Error() == "record not found" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "User not found",
			})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to query database",
		})
		return
	}

	userWallet.Balance = body.WalletBalance

	db.Save(&userWallet)

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Wallet balance updated successfully",
	})
}

// DeleteUser godoc
// @Summary Delete user
// @Description Delete user
// @Tags User
// @Accept json
// @Produce json
// @Param id path string true "ID"
// @Success 200 {string} string
// @Router /delete-user/{id} [delete]
func DeleteUser(ctx *gin.Context) {
	id := ctx.Param("id")
	
	db := database.Connection()

	var user models.User

	result := db.Where("id = ?", id).First(&user)

	if result.Error != nil {
		if result.Error.Error() == "record not found" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "User not found",
			})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to query database",
		})
		return
	}

	db.Delete(&user)

	ctx.JSON(http.StatusOK, gin.H{
		"message": "User deleted successfully",
	})
}
