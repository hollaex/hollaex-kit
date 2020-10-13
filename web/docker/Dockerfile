# build environment
FROM node:12.18.3-alpine as build
ENV NODE_OPTIONS=--max_old_space_size=3072
WORKDIR /app
COPY package.json /app/package.json
RUN npm install --loglevel=error
COPY . /app
RUN npm run build

FROM nginx:1.16.0-alpine
RUN apk add --update \
    curl \
    && rm -rf /var/cache/apk/*
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]



