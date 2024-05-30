package models

type Questions struct {
	ID       int `gorm:"primaryKey"`
	Question string
}
