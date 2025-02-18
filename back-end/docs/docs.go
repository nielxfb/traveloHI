// Package docs Code generated by swaggo/swag. DO NOT EDIT
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "termsOfService": "http://swagger.io/terms/",
        "contact": {
            "name": "API Support",
            "url": "http://www.swagger.io/support",
            "email": "support@swagger.io"
        },
        "license": {
            "name": "Apache 2.0",
            "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
        },
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/delete-user/{id}": {
            "delete": {
                "description": "Delete user",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "User"
                ],
                "summary": "Delete user",
                "parameters": [
                    {
                        "type": "string",
                        "description": "ID",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/fetch-questions": {
            "post": {
                "description": "Fetch security questions",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "User"
                ],
                "summary": "Fetch security questions",
                "parameters": [
                    {
                        "description": "Email",
                        "name": "email",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "type": "integer"
                            }
                        }
                    }
                }
            }
        },
        "/logout": {
            "put": {
                "description": "Log out user",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "User"
                ],
                "summary": "Log out user",
                "parameters": [
                    {
                        "description": "ID",
                        "name": "id",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/users": {
            "get": {
                "description": "Get all users",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "User"
                ],
                "summary": "Get all users",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/models.User"
                            }
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "models.Bank": {
            "type": "object",
            "properties": {
                "bankID": {
                    "type": "string"
                },
                "bankName": {
                    "type": "string"
                },
                "creditCards": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.CreditCard"
                    }
                }
            }
        },
        "models.CartFlightTicket": {
            "type": "object",
            "properties": {
                "cartID": {
                    "type": "string"
                },
                "flight": {
                    "$ref": "#/definitions/models.Flight"
                },
                "flightID": {
                    "type": "string"
                },
                "seatNumber": {
                    "type": "integer"
                },
                "userID": {
                    "type": "string"
                }
            }
        },
        "models.CartHotelTicket": {
            "type": "object",
            "properties": {
                "cartID": {
                    "type": "string"
                },
                "checkInDate": {
                    "type": "string"
                },
                "checkOutDate": {
                    "type": "string"
                },
                "hotel": {
                    "$ref": "#/definitions/models.Hotel"
                },
                "hotelID": {
                    "type": "string"
                },
                "roomType": {
                    "$ref": "#/definitions/models.RoomType"
                },
                "roomTypeID": {
                    "type": "string"
                },
                "userID": {
                    "type": "string"
                }
            }
        },
        "models.CreditCard": {
            "type": "object",
            "properties": {
                "bank": {
                    "$ref": "#/definitions/models.Bank"
                },
                "bankID": {
                    "type": "string"
                },
                "cardNumber": {
                    "type": "string"
                },
                "cvv": {
                    "type": "string"
                },
                "expiredMonth": {
                    "type": "integer"
                },
                "expiredYear": {
                    "type": "integer"
                },
                "id": {
                    "type": "string"
                },
                "userID": {
                    "type": "string"
                }
            }
        },
        "models.Flight": {
            "type": "object",
            "properties": {
                "airlineCode": {
                    "type": "string"
                },
                "airlineNumber": {
                    "type": "string"
                },
                "arrivalTime": {
                    "type": "string"
                },
                "cartFlights": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.CartFlightTicket"
                    }
                },
                "departureTime": {
                    "type": "string"
                },
                "destinationAirportCode": {
                    "type": "string"
                },
                "flightID": {
                    "type": "string"
                },
                "originAirportCode": {
                    "type": "string"
                },
                "price": {
                    "type": "number"
                },
                "reservedSeats": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.ReservedSeat"
                    }
                },
                "seatTotal": {
                    "type": "integer"
                }
            }
        },
        "models.Hotel": {
            "type": "object",
            "properties": {
                "ac": {
                    "type": "boolean"
                },
                "cartHotels": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.CartHotelTicket"
                    }
                },
                "description": {
                    "type": "string"
                },
                "elevator": {
                    "type": "boolean"
                },
                "hotelID": {
                    "type": "string"
                },
                "hotelName": {
                    "type": "string"
                },
                "imageLink": {
                    "type": "string"
                },
                "location": {
                    "$ref": "#/definitions/models.Location"
                },
                "locationID": {
                    "type": "string"
                },
                "restaurant": {
                    "type": "boolean"
                },
                "reviews": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.Review"
                    }
                },
                "roomTypes": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.RoomType"
                    }
                },
                "swimmingPool": {
                    "type": "boolean"
                },
                "wiFi": {
                    "type": "boolean"
                }
            }
        },
        "models.Location": {
            "type": "object",
            "properties": {
                "address": {
                    "type": "string"
                },
                "cityName": {
                    "type": "string"
                },
                "countryName": {
                    "type": "string"
                },
                "locationID": {
                    "type": "string"
                }
            }
        },
        "models.ReservedSeat": {
            "type": "object",
            "properties": {
                "flightID": {
                    "type": "string"
                },
                "seatID": {
                    "type": "string"
                },
                "seatNumber": {
                    "type": "integer"
                }
            }
        },
        "models.Review": {
            "type": "object",
            "properties": {
                "hotelID": {
                    "type": "string"
                },
                "isAnonymous": {
                    "type": "boolean"
                },
                "rating": {
                    "type": "number"
                },
                "reviewDesc": {
                    "type": "string"
                },
                "reviewID": {
                    "type": "string"
                },
                "reviewType": {
                    "$ref": "#/definitions/models.ReviewType"
                },
                "reviewTypeID": {
                    "type": "string"
                },
                "userID": {
                    "type": "string"
                }
            }
        },
        "models.ReviewType": {
            "type": "object",
            "properties": {
                "reviewType": {
                    "type": "string"
                },
                "reviewTypeID": {
                    "type": "string"
                }
            }
        },
        "models.RoomType": {
            "type": "object",
            "properties": {
                "cartRooms": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.CartHotelTicket"
                    }
                },
                "hotelID": {
                    "type": "string"
                },
                "imageLink": {
                    "type": "string"
                },
                "price": {
                    "type": "number"
                },
                "roomType": {
                    "type": "string"
                },
                "roomTypeID": {
                    "type": "string"
                },
                "stock": {
                    "type": "integer"
                }
            }
        },
        "models.User": {
            "type": "object",
            "properties": {
                "address": {
                    "type": "string"
                },
                "creditCards": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.CreditCard"
                    }
                },
                "dob": {
                    "type": "string"
                },
                "email": {
                    "type": "string"
                },
                "firstName": {
                    "type": "string"
                },
                "flightCarts": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.CartFlightTicket"
                    }
                },
                "gender": {
                    "type": "string"
                },
                "hotelCarts": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.CartHotelTicket"
                    }
                },
                "id": {
                    "type": "string"
                },
                "isBanned": {
                    "type": "boolean"
                },
                "lastName": {
                    "type": "string"
                },
                "loggedIn": {
                    "type": "boolean"
                },
                "otpcode": {
                    "type": "string"
                },
                "otpcreatedAt": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                },
                "phoneNumber": {
                    "type": "string"
                },
                "profilePictureLink": {
                    "type": "string"
                },
                "role": {
                    "type": "string"
                },
                "subscribe": {
                    "type": "boolean"
                },
                "walletBalance": {
                    "type": "number"
                }
            }
        }
    },
    "securityDefinitions": {
        "BasicAuth": {
            "type": "basic"
        }
    },
    "externalDocs": {
        "description": "OpenAPI",
        "url": "https://swagger.io/resources/open-api/"
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "1.0",
	Host:             "localhost:3000",
	BasePath:         "/api",
	Schemes:          []string{},
	Title:            "TraveloHI API Documentation",
	Description:      "API Documentation for Web Programming TPA 23-2.",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
