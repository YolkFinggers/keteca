FROM node:24-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
# This step is cached, so it only re-runs if your dependencies change.
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your application's source code to the container
COPY . .

# Document that the app listens on this port
EXPOSE 5000

# Specify the command to run when the container starts
CMD ["node", "server.js"]
