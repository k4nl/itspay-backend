# Criando a migração
Write-Host "Creating migration..."
prisma migrate dev --name init

# Semeando o banco de dados
Write-Host "Seeding the database..."
prisma db seed

# Construindo o servidor
Write-Host "Building the server..."
tsc --build tsconfig.json

# Iniciando o servidor
Write-Host "Starting..."
npm start