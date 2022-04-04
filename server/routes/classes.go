package routes

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"server/models"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var validate = validator.New()

//collection of classes/events. now somehow use mongos' api to manipulate this data
var classCollection *mongo.Collection = OpenCollection(Client, "class")

//add an classes/events POST
func AddClass(c *gin.Context) {
	//context used to cut off the service if it takes way to long
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	//instantiate class models.class struct
	var class models.Class
	//bind returns a pointer to the POST body message to the address of the var called "class", if theres an error, it returns nil
	if err := c.BindJSON(&class); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	//validates the structure of received body message to match with our predefined class.go in models
	validationErr := validate.Struct(class)
	if validationErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
		fmt.Println(validationErr)
		return
	}
	//generate object id
	class.ID = primitive.NewObjectID()
	//mongos api inserone() insert a object into their database
	result, insertErr := classCollection.InsertOne(ctx, class)
	if insertErr != nil {
		msg := fmt.Sprintf("class item was not created")
		c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
		fmt.Println(insertErr)
		return
	}

	//defer statements delay the execution of the function or method or an anonymous method until the nearby functions returns
	defer cancel()

	c.JSON(http.StatusOK, result)
}

//get all classes/events GET
func GetClass(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	var class []bson.M
	cursor, err := classCollection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	if err = cursor.All(ctx, &class); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	defer cancel()

	fmt.Println(class)
	c.JSON(http.StatusOK, class)
}

//delete a class/event given the id
func DeleteClass(c *gin.Context) {

	orderID := c.Params.ByName("id")
	docID, _ := primitive.ObjectIDFromHex(orderID)

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	result, err := classCollection.DeleteOne(ctx, bson.M{"_id": docID})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	defer cancel()

	c.JSON(http.StatusOK, result.DeletedCount)

}
