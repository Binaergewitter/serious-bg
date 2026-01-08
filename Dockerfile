# Build stage
FROM ghcr.io/gohugoio/hugo:v0.154.2 AS builder

WORKDIR /src
COPY . .

# Build the site (generates index.json and podcast feeds via _content.gotmpl)
RUN hugo --minify

# Compress the search index for faster loading
RUN gzip -k public/index.json

# Final stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built site from the builder stage
COPY --from=builder /src/public /usr/share/nginx/html
