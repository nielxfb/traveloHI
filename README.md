# TraveloHI

TraveloHI is a travel booking application similar to Traveloka, allowing users to reserve hotels and tickets. Additionally, TraveloHI features a unique multiplayer game developed using HTML Canvas.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Hotel Reservation:** Book hotels with ease, view available rooms, and make reservations.
- **Ticket Booking:** Book tickets for flights, trains, and other travel options.
- **Multiplayer Game:** Enjoy a built-in multiplayer game created with HTML Canvas.
- **User Authentication:** Secure login and registration system.

## Tech Stack

**Front End:**

- React (Vite)
- HTML Canvas (for the game)
- CSS (Tailwind CSS or other styling libraries)

**Back End:**

- Go
- GORM (Object-Relational Mapping)
- Gin (HTTP web framework)
- MySQL/PostgreSQL (or any other relational database)

## Installation

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm or yarn
- Go
- PostgreSQL

### Clone the Repository

```bash
git clone https://github.com/yourusername/TraveloHI.git
cd TraveloHI
```

### Front End Setup
1. Navigate to the frontend directory:

```bash
cd front-end
```

2. Install the dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Back End Setup
1. Navigate to the backend directory:
```bash
cd back-end
```

2. Install the dependencies:
```bash
go mod download
```
3. Set up your database and update the configuration in .env.

4. Run the server:
```bash
go run main.go
```

### Usage
- Access the front end application at http://localhost:5173.
- The back end server will run on http://localhost:8080.
- Playing the Multiplayer Game
- Navigate to the game section in the application to start playing the multiplayer game.
