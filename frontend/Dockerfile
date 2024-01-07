FROM node:18 AS build_stage

WORKDIR /usr/src/app

COPY . .

# Change npm ci to npm install since we are going to be in development mode
RUN npm ci

RUN npm run build



FROM build_stage AS serve_stage

COPY --chown=node:node . .

RUN npm install -g serve

USER node
CMD ["serve", "-s", "dist", "-p", "5173"]