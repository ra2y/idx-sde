# IDX Property Search

A full-stack property search application built as part of the IDX Exchange Software Development Engineering internship.

## Features

- Property listings
- City, ZIP, price, beds, and baths filters
- Pagination
- Property sorting
- Favorite properties
- Property detail pages
- Image carousel and gallery
- Google Maps integration
- Open house schedules

## Tech Stack

### Frontend

- React
- React Router
- JavaScript
- React Testing Library

### Backend

- Node.js
- Express
- MySQL2

### Database

- MySQL 8
- Docker

### Testing

- Jest
- React Testing Library
- Supertest

## Architecture

Browser / React
        |
        | HTTP
        v
Express REST API
        |
        | SQL
        v
MySQL 8

React never connects directly to MySQL.

## Local Setup

### 1. Clone the repository

...

### 2. Start MySQL

...

### 3. Configure environment variables

...

### 4. Start the backend

...

### 5. Start the frontend

...

## API Reference

### GET /api/properties

Returns paginated property listings.

Query parameters:

| Parameter | Description |
| --- | --- |
| city | City filter |
| zipcode | ZIP code |
| minPrice | Minimum price |
| maxPrice | Maximum price |
| beds | Minimum bedrooms |
| baths | Minimum bathrooms |
| limit | Results per page |
| offset | Number of records to skip |
| sortBy | Property field to sort by |
| sortOrder | asc or desc |

Example:

GET /api/properties?city=Los%20Angeles&minPrice=300000&beds=3

### GET /api/properties/:id

Returns one property.

### GET /api/properties/:id/openhouses

Returns open houses for a property.

## Database

### rets_property

Stores property listings.

Important columns include:

- L_ListingID
- L_Address
- L_City
- L_State
- L_Zip
- L_SystemPrice
- L_Keyword2
- LM_Dec_3
- LM_Int2_3
- L_Photos

### rets_openhouse

Stores open-house events associated with properties through L_ListingID.

## Testing

Backend:

npm test

Frontend:

npm test

## Known Issues

- Some MLS image URLs expire and may return 404 responses.
- Some properties have missing latitude/longitude values.
- Some property photo data may be malformed or missing.

## Future Improvements

- Deployment
- Improved responsive design
- Additional property filters
- Authentication and server-side favorites