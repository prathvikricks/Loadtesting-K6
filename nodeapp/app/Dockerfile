# Use the Node.js official image as a base
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY code/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY code/ .

# Expose the application port
EXPOSE 3000

# Define the command to run the app
CMD ["node", "server.js"]
