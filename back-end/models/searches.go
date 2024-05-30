package models

type SearchHistory struct {
	SearchID string `gorm:"primaryKey"`
	UserID   string
	Query    string
}

type Search struct {
	Query string `gorm:"primaryKey"`
	Count int
}
