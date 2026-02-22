# 1. Use Node.js version 18 (Stable)
FROM node:18

# 2. Set working directory
WORKDIR /app

# 3. Copy package files first (better caching)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the code
COPY . .

# 6. Start the server
CMD ["npm", "start"]
