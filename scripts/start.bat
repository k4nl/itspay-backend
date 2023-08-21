@echo off

echo "Creating migration..."
prisma migrate dev --name init
prisma db seed

echo "Building the server..."
tsc --build tsconfig.json

echo "Starting..."
npm start