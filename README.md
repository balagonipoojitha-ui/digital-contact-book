# Digital Contact Book

A full-stack contact manager built with React + Vite, Java Spring Boot REST API, Spring Data JPA, and MySQL.

## Features
- Add contacts with name, phone, and email
- List saved contacts
- Search by name (case-insensitive, partial match)
- Edit and delete contacts
- Required-field and email-format validation in frontend and backend
- MySQL persistence across browser refreshes
- Helpful empty-search and error messages

## Requirements
- Java 17+
- Maven 3.9+
- Node.js 20+
- MySQL 8+

## 1. Create database
Run in MySQL:
```sql
CREATE DATABASE contact_book;
```

## 2. Configure backend
Edit `backend/src/main/resources/application.properties` and set your MySQL username/password, or set environment variables:
- `DB_USERNAME` (default `root`)
- `DB_PASSWORD` (default `password`)

## 3. Run backend
From a terminal:
```bash
cd backend
mvn spring-boot:run
```
Backend runs at `http://localhost:8080`.
Test health: `http://localhost:8080/api/health`

## 4. Run frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal (usually `http://localhost:5173`).

## API
- `GET /api/contacts` — list contacts
- `GET /api/contacts?name=ana` — search contacts by name
- `GET /api/contacts/{id}` — get one contact
- `POST /api/contacts` — create contact
- `PUT /api/contacts/{id}` — update contact
- `DELETE /api/contacts/{id}` — delete contact

JSON example:
```json
{
  "name": "Ravi Kumar",
  "phone": "+91 9876543210",
  "email": "ravi@example.com"
}
```

## Notes
- Contact data is stored in MySQL, not browser local storage.
- Keep database credentials private; use environment variables for deployment.
- This starter app is intended for local development. Add authentication and HTTPS before exposing private contact data publicly.
