FROM node:24-slim

RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends ca-certificates curl && rm -rf /var/lib/apt/lists/*
# temporatiorily install npm to fix npm issues
RUN curl -qL https://www.npmjs.com/install.sh | sh


RUN mkdir -p /app
WORKDIR /app

COPY package*.json /app/
COPY src ./src/

# Limpar cache do npm
RUN npm cache clean --force

RUN echo '#### Run development ####';
RUN if [ -f "/app/package-lock.json" ]; then\
    echo '>>> Running npm ci';\
    npm ci;\
  else\
    # if [ -f "/app/package.json" ]; then\
      echo '>>> Running npm install';\
      npm i;\
      # touch '/app/new-lock';\
    # fi\
  fi

USER node

# CMD ["npm", "run", "dev"]
CMD ["npm", "start"]