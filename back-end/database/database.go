package database

import (
	"fmt"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func Connection() *gorm.DB {

	if db == nil {
		dsn := os.Getenv("DB")
		var err error
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

		if err != nil {
			panic("Failed to connect to database!" + fmt.Sprint(err))
		}
	}

	return db
}
