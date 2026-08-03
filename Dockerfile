# build stage
FROM node:22-alpine AS build-stage
ENV NPM_CONFIG_LOGLEVEL=warn
ENV CI=true
ENV NPM_CONFIG_REGISTRY=https://registry.npmmirror.com
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm i --frozen-lockfile
COPY . .
RUN pnpm build

# production stage（slim 去掉 njs/xslt 等模块，体积约小 70MB）
FROM nginx:stable-alpine-slim AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
