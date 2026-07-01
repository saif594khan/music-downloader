FROM node:18-slim

# Install system dependencies (Python3, ffmpeg, aur atomicparsley thumbnail embedding ke liye)
RUN apt-get update && apt-get install -y \
    python3 \
    ffmpeg \
    atomicparsley \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080

# Make sure aapki script ka naam 'server_3.js' hi ho, warna ise badal dein!
CMD [ "node", "server_3.js" ]