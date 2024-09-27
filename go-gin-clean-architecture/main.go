package main

import (
	"log"
	"os"

	"github.com/queekao/go-gin-clean-template/config"
	"github.com/queekao/go-gin-clean-template/controller"
	"github.com/queekao/go-gin-clean-template/middleware"
	"github.com/queekao/go-gin-clean-template/migrations"
	"github.com/queekao/go-gin-clean-template/repository"
	"github.com/queekao/go-gin-clean-template/routes"
	"github.com/queekao/go-gin-clean-template/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func main() {
	var (
		db             *gorm.DB                  = config.SetUpDatabaseConnection()
		jwtService     service.JWTService        = service.NewJWTService()
		userRepository repository.UserRepository = repository.NewUserRepository(db)
		userService    service.UserService       = service.NewUserService(userRepository, jwtService)
		userController controller.UserController = controller.NewUserController(userService)
	)

	server := gin.Default()
	server.SetTrustedProxies([]string{"127.0.0.1", "::1"})
	server.Use(middleware.CORSMiddleware())
	routes.User(server, userController, jwtService)

	if err := migrations.Migrate(db); err != nil {
		log.Fatalf("error migration: %v", err)
	}

	if err := migrations.Seeder(db); err != nil {
		log.Fatalf("error migration seeder: %v", err)
	}

	server.Static("/assets", "./assets")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8888"
	}

	if err := server.Run(":" + port); err != nil {
		log.Fatalf("error running server: %v", err)
	}
}
