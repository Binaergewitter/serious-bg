# Build stage
FROM ghcr.io/gohugoio/hugo:v0.154.2 AS builder

WORKDIR /src
COPY . .

# Build the site (generates index.json and podcast feeds via _content.gotmpl)
# Most of the build's peak memory is garbage from parsing the Sprechzeit
# transcripts. Go collects it only near the soft cap: the build peaks at about
# 1.2 GB and spends no time on GC while there is room.
RUN GOGC=off GOMEMLIMIT=900MiB hugo --minify

# Final stage
# Install nginx and its Brotli module together so their versions match.
FROM alpine:3.23
RUN apk add --no-cache nginx nginx-mod-http-brotli brotli \
    && mkdir -p /run/nginx \
    && ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

# Copy custom nginx config
COPY nginx.conf /etc/nginx/http.d/default.conf

# Copy the built site from the builder stage
COPY --from=builder /src/public /usr/share/nginx/html

# Level 9 is smaller and faster than gzip -9 without level 11's build cost.
RUN brotli -k -q 9 /usr/share/nginx/html/index.json \
    /usr/share/nginx/html/sprechzeit/data.*.json \
    /usr/share/nginx/html/sprechzeit/words.*.txt

EXPOSE 8080
STOPSIGNAL SIGQUIT
CMD ["nginx", "-g", "daemon off;"]
