# MediZen Healthcare Platform 🏥

A full-stack healthcare management system connecting patients, doctors, and administrators.

## Live Demos 🌐
- **Patient Portal**: [medisin.vercel.app](https://medisin.vercel.app)
- **Admin/Doctor Panel**: [medisin-panel.vercel.app](https://medisin-panel.vercel.app)

## Features ✨

### Patient Features
```mermaid
graph TD
    A[Patient Portal] --> B[Appointment Booking]
    A --> C[Doctor Search]
    A --> D[Medical History Access]
    A --> E[Prescription Management]
```

### Admin Features
```mermaid
graph TD
    F[Admin Panel] --> G[Doctor Management]
    F --> H[Appointment Tracking]
    F --> I[Analytics Dashboard]
    F --> J[User Management]
```

### Doctor Features
```mermaid
graph TD
    K[Doctor Portal] --> L[Appointment Management]
    K --> M[Patient Records]
    K --> N[Prescription System]
    K --> O[Availability Schedule]
```

## Tech Stack 💻

```mermaid
pie
    title Technology Stack
    "React" : 35
    "Node.js" : 30
    "MongoDB" : 20
    "Tailwind CSS" : 15
```

## Installation 🛠️

### Prerequisites
- Node.js ≥16.x
- MongoDB Atlas account
- Cloudinary account

### Setup Steps

1. **Clone Repository**
```bash
git clone https://github.com/your-username/medizen.git
cd medizen
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Fill environment variables
npm start
```

3. **Frontend Setup (Patient)**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

4. **Admin Panel Setup**
```bash
cd admin
npm install
cp .env.example .env
npm run dev
```

## Environment Variables 🔒

Create `.env` files with these variables:

**Backend**
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_SECRET_KEY=your_admin_secret
```

**Frontend**
```env
VITE_BACKEND_URL=your_backend_url
```

## Deployment 🚀

```mermaid
sequenceDiagram
    participant Local
    participant GitHub
    participant Vercel
    Local->>GitHub: Push code
    GitHub->>Vercel: Auto-deploy
    Vercel->>Production: Live Deployment
```

## Contributing 🤝
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📄
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
