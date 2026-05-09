# CampusHub

CampusHub is a frontend-first student marketplace for buying, selling, renting, and exchanging products and rooms within a campus community.

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

From the project root you can also run:

```bash
npm run frontend
npm run backend
```

## Run Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Edit `backend/.env` and replace `<db_password>` in `MONGO_URI` with your MongoDB Atlas password.

Seed demo data after configuring `.env`:

```bash
npm run seed
```

Demo account:

- Seller: `seller@campushub.in`
- Password: `password123`

The backend includes JWT auth, MongoDB models, product APIs, room APIs, protected seller routes, inquiry APIs, and a mock room listing payment flow that publishes rooms only after the ₹500 listing fee succeeds.
