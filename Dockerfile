# build stage
FROM node:22-alpine AS build-stage
ENV NPM_CONFIG_LOGLEVEL=warn
ENV CI=true
ENV NPM_CONFIG_REGISTRY=https://registry.npmmirror.com
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# 固定 packageManager 版本，避免 npm -g 装到最新 pnpm 后校验 linux 二进制失败
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate && pnpm i --frozen-lockfile
COPY . .
RUN pnpm build

# production stage（slim 去掉 njs/xslt 等模块，体积约小 70MB）
FROM nginx:stable-alpine-slim AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 校验 gzip_static 可用，避免配置写了模块却未编译进二进制
RUN nginx -t
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
