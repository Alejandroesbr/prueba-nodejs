
# STEP 1: Build (TypeScript Compilation)

FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency configuration files
COPY package*.json tsconfig.json ./

# Install all dependencies (including devDependencies for compilation)
RUN npm install

# Copy the source code
COPY src ./src

# Compile TypeScript to JavaScript (creates the dist/ folder)
RUN npm run build

# STEP 2: Runner (Production Execution)

FROM node:20-alpine AS runner

# Set production environment
ENV NODE_ENV=production

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install ONLY production dependencies (skip devDependencies)
RUN npm install --omit=dev && npm cache clean --force

# Copy the compiled code from the build stage
COPY --from=builder /app/dist ./dist

# Create a non-root user for security
USER node

# Expose the default port (mapped via your .env file)
EXPOSE 3000

# Command to start the application in production
CMD ["node", "dist/index.js"]
