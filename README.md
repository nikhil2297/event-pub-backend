# Event-Pub Backend

A Node.js backend application built with TypeScript following Hexagonal Architecture (Ports and Adapters) pattern. The application handles real-time event publishing using Redis Pub/Sub and Server-Sent Events (SSE).

## 🏗️ Architecture Overview

This project implements Hexagonal Architecture (also known as Ports and Adapters pattern) which divides the application into three main layers:

### Domain Layer
The innermost layer containing business logic and domain entities:
- `domain/entities`: Core business entities (e.g., `IUser`)
- `domain/dtos`: Data Transfer Objects for domain entities

### Application Layer
The middle layer that orchestrates the flow of data and implements use cases:
- `application/ports`: Interfaces that define how the application interacts with external services
- `application/usecases`: Implementation of business use cases
- `application/validators`: Validation rules for input data

### Infrastructure Layer
The outermost layer that handles external concerns:
- `infrastructure/adapters/input`: Handles incoming requests (HTTP routes, SSE)
- `infrastructure/adapters/output`: Implements data persistence (MongoDB repositories)
- `infrastructure/config`: Application configuration
- `infrastructure/services`: External service implementations (Redis, JWT)

## 🔄 Application Flow

Here's how the application flows from startup to handling requests:

1. **Application Bootstrap** (`index.ts`):
   ```typescript
   ApplicationBootstrap.start()
   └── Application instance created
       ├── Services initialized
       │   ├── MongoDB connection
       │   ├── Redis connection
       │   └── SSE service
       └── Express server started
   ```

2. **Request Handling Flow**:
   ```
   Client Request
   └── Infrastructure Layer (Express Routes)
       └── Application Layer (Use Cases)
           └── Domain Layer (Business Logic)
               └── Infrastructure Layer (Repositories)
                   └── Response
   ```

3. **Real-time Updates Flow**:
   ```
   Event Trigger
   └── Redis Publisher
       └── Redis Subscriber
           └── SSE Service
               └── Client Browser
   ```

## 🔌 Key Components

### Redis Service
Handles pub/sub messaging for real-time communication:
```typescript
interface IRedisService {
    publish(channel: string, message: any): Promise<void>;
    subscribe(channel: string, callback: Function): Promise<void>;
    unsubscribe(channel: string): Promise<void>;
}
```

### SSE Service
Manages Server-Sent Events connections:
```typescript
interface ISSEService {
    initializeConnection(username: string, res: Response): void;
    closeConnection(username: string): void;
    broadcastToUsers(usernames: string[], data: any): Promise<void>;
}
```

### Authentication
Implements multiple strategies using Passport.js:
- Local authentication with JWT
- Google OAuth2.0
- Session management

## 🛠️ Technical Stack

- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB
- **Caching & Pub/Sub**: Redis
- **Authentication**: Passport.js
- **Real-time**: Server-Sent Events (SSE)
- **Architecture**: Hexagonal (Ports & Adapters)

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/event-pub-backend.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   PORT=4000
   NODE_ENV=development
   MONGO_URL=mongodb://localhost:27017
   MONGO_DB_NAME=eventdb
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📦 Project Structure

```
event-pub-backend/
├── src/
│   ├── application/           # Application business rules
│   │   ├── ports/            # Interface definitions
│   │   ├── usecases/         # Use case implementations
│   │   └── validators/       # Input validation
│   ├── domain/               # Enterprise business rules
│   │   ├── dtos/            # Data Transfer Objects
│   │   └── entities/        # Domain entities
│   ├── infrastructure/       # Frameworks & tools
│   │   ├── adapters/        # Interface adapters
│   │   ├── config/          # Configurations
│   │   ├── database/        # Database setup
│   │   ├── middleware/      # Express middleware
│   │   └── services/        # External services
│   └── shared/              # Shared utilities
│       ├── errors/          # Error handling
│       └── utils/           # Utility functions
```

## 🔐 Security

- JWT-based authentication
- HTTP-only cookies
- CORS configuration
- Input validation
- Error handling middleware
- Secure session configuration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
