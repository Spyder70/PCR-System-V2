FROM node:14

ENV NODE_OPTIONS ="--unhandled-rejections=strict"

WORKDIR /app

COPY package.json .

RUN npm install --legacy-peer-deps

RUN npm i eslint@latest --legacy-peer-deps

RUN npm i eslint-config-react-app -D --legacy-peer-deps

RUN npm audit fix --force

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]