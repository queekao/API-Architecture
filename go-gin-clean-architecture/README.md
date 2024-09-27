# Golang Gin Gorm With Clean Architecture

## Directory / Layers

- **Config** is aims to be directly related to things outside the code. An example is a database, etc. Configuration files play a crucial role in customizing the behavior of software applications. A well-structured config file can simplify the process of fine-tuning various settings to meet specific project requirements
- **Constants** constant is a directory that deals with things that cannot be changed, in other words it is always constant and is usually called repeatedly
- **Middleware** is an intermediary layer that serves to process and modify HTTP requests as they pass through the server before reaching the actual routes or actions. Middleware can be used to perform various tasks such as user authentication, data validation, logging, session management, response compression, and many more. It helps separate different functionalities within the API application and enables consistent processing for each incoming HTTP request.
- **Controller** is a component or part of the application responsible for managing incoming HTTP requests from clients (such as browsers or mobile applications). The controller controls the flow of data between the client and the server and determines the actions to be taken based on the received requests. In other words, a controller is a crucial part of the REST API architecture that governs the interaction between the client and the server, ensuring that client requests are processed correctly according to predefined business rules.
- **Service** refers to a component responsible for executing specific business logic or operations requested by clients through HTTP requests. The service acts as an intermediary layer between the controller and data storage, fetching data from storage or performing the relevant business operations, and then returning the results to the controller to be sent as an HTTP response to the client. The significance of service in REST API architecture is to separate the business logic from the controller, making the application more modular, testable, and adaptable. In other words, service enable the separation of responsibilities between receiving HTTP requests (by the controller) and executing the corresponding business actions. This helps maintain clean and structured code in the development of RESTful applications.
- **Repository** is a component or layer responsible for interacting with data storage, such as a database or file storage, to retrieve, store, or manage data. The repository serves as a bridge between service and the actual data storage. The primary function of a repository is to abstract database or storage-related operations from business logic and HTTP request handling. In other words, the repository provides an interface for accessing and manipulating data, allowing service to focus on business logic without needing to know the technical details of data storage underneath. In the architecture of a REST API, the use of repositories helps maintain separation of concerns between different tasks in the application, making development, testing, and code maintenance more manageable.
- **Utils** is short for "utility functions" or "utility tools." It refers to a collection of functions or tools used for common tasks such as data validation, string manipulation, security, error handling, database connection management, and more. Utils help avoid code duplication, improve code readability, and make application development more efficient by providing commonly used and reusable functions.

## Prerequisite

- Go Version `>= go 1.20`
- PostgreSQL Version `>= version 15.0`

## How To Use 🤔

```
1. cp .env.example .env
2. configure .env with your postgres
DB_HOST = localhost
DB_USER = <user_role>
DB_PASS = password
DB_NAME = golang_template
DB_PORT = 5432
3. Open terminal, follow the steps below:
- if you haven't downloaded postgres, you can download it first
- Run -> psql -U <user_role> -d golang_template
- Run -> Create database according to what you put in .env
- \c (your database)
- Run -> CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
- Run -> Exit
4. go run main.go
```
