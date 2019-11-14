FROM node:10.15.3-alpine

EXPOSE 10011

COPY . /app

WORKDIR /app

RUN for d in ./*/ ; do (cd "$d" && npm install); done

CMD node index.js