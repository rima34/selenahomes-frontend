FROM node:18-alpine AS deps

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

#================
# Build Step 
#====================== 
FROM deps AS builder

WORKDIR /app

COPY . .

COPY --from=deps /app/node_modules ./node_modules

ARG VITE_API_BASE_URL

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN yarn build

#======================
# Prod Step 
#====================== 
FROM builder AS prod

RUN yarn global add serve

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist

EXPOSE 3030

CMD serve -l 3030 -s dist

#======================
# Dev Step 
#====================== 
FROM node:18-alpine AS dev

WORKDIR /app

ENV NODE_ENV=development

COPY . .
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3030

CMD ["yarn", "dev", "--host"]
