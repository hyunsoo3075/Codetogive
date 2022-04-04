package main

import (
	"os"

	"server/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	port := os.Getenv("PORT")

	if port == "" {
		port = "8000"
	}

	router := gin.New()
	router.Use(gin.Logger())

	router.Use(cors.Default())

	// these are the endpoints
	//C
	router.POST("/class/create", routes.AddClass)
	router.GET("/class", routes.GetClass)
	router.DELETE("/class/delete/:id", routes.DeleteClass)
	router.Run(":" + port)
}
