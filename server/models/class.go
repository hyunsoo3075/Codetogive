package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// class/event json format
type Class struct {
	ID          primitive.ObjectID `bson:"_id"`
	Name        *string            `json:"name" binding:"required"`
	Type        *string            `json:"type" binding:"required"`
	Description *string            `json:"description" binding:"required"`
}
