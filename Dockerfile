FROM alpine:3.20 AS source

ARG REPO_URL=https://github.com/queziajesuinod/cassiamarylp.git
ARG REPO_REF=main

WORKDIR /tmp

RUN apk add --no-cache git
RUN git clone --depth 1 --branch "${REPO_REF}" "${REPO_URL}" project

FROM nginx:1.27-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=source /tmp/project/index.html /usr/share/nginx/html/index.html
COPY --from=source /tmp/project/assets /usr/share/nginx/html/assets

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/healthz || exit 1
