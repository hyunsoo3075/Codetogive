package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// class/event json format
type Class struct {
	ID          primitive.ObjectID `bson:"_id"`
	Name        *string            `json:"name" binding:"required"`
	Description *string            `json:"description" binding:"required"`
	Date        *string            `json:"date" binding:"required"`
	Type        *string            `json:"type" binding:"required"`
	Points      *string            `json:"points" binding:"required"`
}
