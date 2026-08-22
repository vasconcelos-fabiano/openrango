FROM node:24

WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY institutional/package*.json ./institutional/

RUN npm ci
RUN npm --prefix frontend ci
RUN npm --prefix institutional ci

COPY . .

EXPOSE 4200 4201 4202

CMD ["npm", "run", "or"]
