🎥 YouTube-Backend
A robust Node.js + Express.js backend powering a YouTube-like video platform—complete with uploads, likes/dislikes, comments, subscriptions, authentication, cloud storage, and more.

🛠️ Technologies
Node.js + Express.js

MongoDB (via Mongoose)

JWT for secure user authentication

bcrypt for password hashing

Multer for handling AVI, MP4 uploads

Cloudinary for cloud-based media storage

(Optionally) AWS S3 or Firebase for media hosting

🚀 Features
User Auth – Sign up, log in/out with JWT-based security

Video Uploads – Streamlined file handling and storage

CRUD Video Ops – Create, read, update, delete videos

Engagements – Like/dislike videos; add and manage comments

Subscriptions – Follow channels and fetch their latest content

Search & Trends – Find videos by title; see trending selections

Random Video Picks – Surprise content with “Feeling Lucky” functionality

📥 Setup & Run Locally
Clone the repo:

bash
Copy
Edit
git clone https://github.com/SahilKhanWDC/youtube-backend.git
cd youtube-backend
Install dependencies:

bash
Copy
Edit
npm install
Configure environment variables:
Create a .env at repo root with:

env
Copy
Edit
PORT=5000
MONGO_URL=<Your MongoDB URI>
JWT_SECRET=<YourSecretKey>
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>
Start the server:

bash
Copy
Edit
npm run dev
Server listens by default on http://localhost:5000.

🔄 API Endpoints
Auth

POST /auth/register

POST /auth/login

Users

PUT /users/:id – Update profile

GET /users/:id – Get user data

Videos

POST /videos/ – Upload

PUT /videos/:id – Edit

DELETE /videos/:id – Remove

GET /videos/:id – View details

GET /videos/trending – Top videos

GET /videos/random – Surprise

GET /videos/subscriptions – Feed from followed channels

GET /videos/tags – Filter by tag(s)

GET /videos/search – Query by title

Interactions

PUT /videos/like/:id – Like a video

PUT /videos/dislike/:id – Dislike

POST /comments/ – Add

DELETE /comments/:id – Remove

GET /comments/:videoId – List comments

🔒 Middleware
authMiddleware – Verifies JWTs

errorHandler – Graceful error responses

uploadMiddleware – Multer setup + Cloudinary integration

🧪 Testing with Postman
Include sample collections:

Register ➝ Login ➝ Upload video ➝ Like/dislike ➝ Comment ➝ Fetch trending/random/subscription feed

🚀 Deployment Tips
Use Heroku, Render.com, or DigitalOcean to deploy (with NODE_ENV=production)

Set up MongoDB Atlas

Use Cloudinary or AWS S3 for file/media hosting

📚 Learn More
Understand auth/register & auth/login in [auth controller]

Multer + Cloudinary logic in [upload middleware]

Business rules found in respective controllers/routes (e.g. likes, subscriptions)

DB schema defined with Mongoose in /models

🤝 Contribute
Feel free to open a PR! Whether it’s:

Enhancing features (e.g. video thumbnails, view counts)

Adding new search filters or pagination

Improving tests, documentation, error handling

📞 Contact
Sahil Khan — full-stack developer in the making
📧 sk.sahilkhan543@gmail.com
📎 Portfolio: https://sahil-s-portfolio-pearl.vercel.app/

