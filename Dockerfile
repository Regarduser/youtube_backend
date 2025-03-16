# Use official Node.js image
FROM node:22

# Install required system packages
RUN apt-get update && apt-get install -y curl ffmpeg

# Install yt-dlp globally using curl
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

# Set the working directory
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN npm install

# Expose the port your app runs on (if needed)
EXPOSE 4000

# Start the app
CMD ["npm", "start"]
