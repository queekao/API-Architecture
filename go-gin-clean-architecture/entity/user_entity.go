package entity

import (
	"github.com/google/uuid"
	"github.com/queekao/go-gin-clean-template/helpers"
	"gorm.io/gorm"
)

type User struct {
	ID         uuid.UUID `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	Name       string    `json:"name"`
	TelpNumber string    `json:"telp_number"`
	Email      string    `json:"email"`
	Password   string    `json:"password"`
	Role       string    `json:"role"`
	ImageUrl   string    `json:"image_url"`
	IsVerified bool      `json:"is_verified"`

	Timestamp
}

// `BeforeCreate` This is a GORM hook that runs before a new record
func (u *User) BeforeCreate(tx *gorm.DB) error {
	var err error
	u.Password, err = helpers.HashPassword(u.Password)
	if err != nil {
		return err
	}
	return nil
}
