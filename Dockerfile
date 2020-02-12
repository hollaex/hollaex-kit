FROM bitholla/hollaex-core:1.20.7

RUN rm -rf /app/mail

COPY ./mail /app/mail

COPY ./plugins /app/plugins

EXPOSE 10011

RUN cd plugins && for d in ./*/ ; do (cd "$d" && npm install); done

RUN cd mail && npm install
