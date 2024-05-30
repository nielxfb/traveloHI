package models

type ReviewType struct {
	ReviewTypeID string `gorm:"primaryKey"`
	ReviewType   string
}
