#  1: Build compilator TS

FROM node:20-alpine AS builder

WORKDIR /app

# Copy the file from dependecies
COPY package*.json ./

# Install the files from depencies
RUN npm ci

# Copy the rest of the project
COPY . .

# Compilate TypeScript to JavaScript (/dist)
RUN npm run build


# 2: Producction (Run the API)

FROM node:20-alpine AS production

WORKDIR /app

# Copy the files from dependecies
COPY package*.json ./

# Install only the dependecies from producction to reduce the size of the img
RUN npm ci --only=production

# Copy the files compilates from stage 1
COPY --from=builder /app/dist ./dist

# Expose the port by default(mapping with the .env from docker compose)
EXPOSE 3000

# Start
CMD ["npm", "start"]