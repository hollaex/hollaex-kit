FROM bitholla/hollaex-core:1.20.3

RUN rm -rf /app/mail

COPY ./mail /app/mail

COPY ./plugins /app/plugins

