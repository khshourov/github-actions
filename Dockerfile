FROM node:22

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY demo-project/package*.json ./
RUN npm install

# Bundle app source
COPY demo-project .

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
