# Curated Collections

**Curated Collections** is a web platform that allows users to explore, curate, and manage virtual art exhibitions. It fetches artwork data from multiple museum/university APIs, enabling users to create personalized exhibitions and browse through collections.

**Features:**

1. Search artworks across Victoria & Albert Museum and The Metropolitan Museum of Art.
2. Browse these artworks, from a list and card view, with pagination.
3. Filter artworks by artist.
4. Display images and details for each individual artwork.
5. Users can create, add, and remove items from personal exhibition collections.
6. Users can view their exhibitions and saved items within each collection.

## Hosted Site

You can try the plaform for yourself on web:
https://curated-collections.netlify.app/

(As it is hosted for free, it may take a minute or two for the host to spin up)

## Getting Started

To run the project locally, follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/enterthestream/curated-collections.git
cd curated-collections
```

### 2. Backend Setup

Navigate to backend project folder and install dependencies:

```bash
cd backend
npm install
```

To start the backend in development mode:

```bash
npm run dev
```

### 3. Frontend Setup

Navigate to frontend project folder and install dependencies:

```bash
cd frontend
npm install
```

To start the development server and bundler:

```bash
npm run start
```

For web:

```bash
Copy
Edit
npm run web
```

For Android/iOS:

```bash
Copy
Edit
npm run android
npm run ios
```

#### Environment Variables

Request SECRET_KEY to be sent via a secure channel from the platform holder.

Navigate to the .env.example file in the backend directory and replace with the value of the key where it is indicated.
Rename

```bash
.env.example
```

to

```bash
.env
```

##### Build distribution backend

Navigate to backend project folder and build:

```bash
cd frontend
npm build
```

##### Build distribution frontend

Navigate to frontend project folder and build:

```bash
cd frontend
npx build
```
