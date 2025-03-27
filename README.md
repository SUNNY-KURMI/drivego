# DriveGo Frontend

A modern web application for connecting professional drivers with customers, built with React, Vite, and Material-UI.

## Features

- User authentication and registration
- Driver registration and management
- Booking system for rides
- Real-time driver tracking
- Responsive design for all devices

## Tech Stack

- React 18
- Vite
- Material-UI
- React Router
- Axios for API calls
- Emotion for styling
- Vitest for testing

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/drivego-frontend.git
cd drivego-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```bash
VITE_API_URL=your_api_url_here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run coverage` - Run tests with coverage report

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── pages/         # Page components
  ├── assets/        # Static assets
  ├── theme.js       # Material-UI theme configuration
  ├── App.jsx        # Main application component
  └── main.jsx       # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
