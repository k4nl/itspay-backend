# create migration
echo "Creating migration..."
prisma generate
prisma migrate dev --name init
prisma db seed

echo "Building the server..."
# build server
tsc --build tsconfig.json

echo "Starting..."
# start server
npm start