# Flight Booking UI

A modern, responsive Flight Booking Frontend Application built using Angular.
This application allows users to register, login, search flights, and view available flight details in a clean, user-friendly interface.

## Features

## Authentication

	•	User Registration with form validations
	•	User Login using JWT-based authentication
	•	Secure token handling using localStorage
	•	Dynamic UI updates based on login state (Login / Logout)

  
## Flight Search

  •	Search flights by:
	    •	Origin
	    •	Destination
	    •	Travel Date
  
  •	Uses Reactive Forms for robust validation
  •	Communicates with backend services via API Gateway
  •	Sends Bearer Token for secured endpoints

## Flight Results Display

  •	Airline name
	•	Departure time & location
	•	Arrival time & location
	•	Trip type (ONEWAY / ROUNDTRIP)
	•	Duration between flights
	•	Price
  
## UI & Design
	•	Modern card-based layout
	•	Background image with overlay for readability
	•	Responsive and readable color palette
	•	Clean typography and spacing
	•	Designed with real airline booking UX principles

## Authentication Flow
	1.	User registers via Register page
	2.	User logs in via Login page
	3.	JWT token is stored in localStorage
	4.	Token is attached as Authorization: Bearer <token> for secured APIs
	5.	UI updates automatically using BehaviorSubject

## API Integration
The frontend communicates with backend microservices through an API Gateway.

Example Endpoints:
	•	POST /auth-service/auth/signup
	•	POST /auth-service/auth/signin
	•	POST /flight-service/api/flight/search

## Validation & Error Handling
	•	Client-side form validations using Angular Validators
	•	Clear validation messages for each field
	•	Graceful handling of:
	  •	Unauthorized access
	  •	No available flights
	  •	Network/API failures

## Screens 
	•	Register
  
  <img width="2870" height="1614" alt="image" src="https://github.com/user-attachments/assets/6c458cba-385b-4306-a138-3f754519ebdf" />

  •	Login
  
  <img width="2878" height="1624" alt="image" src="https://github.com/user-attachments/assets/b577506d-38bd-471b-b946-3eab20155d66" />

  •	Search Flights
  
  <img width="2862" height="1468" alt="image" src="https://github.com/user-attachments/assets/46affc4f-dd6e-4e76-941c-49882065c2ce" />

  •	No Flights Available
  
  <img width="2852" height="1474" alt="image" src="https://github.com/user-attachments/assets/a6838384-19a7-4280-9178-769077a0ac21" />




