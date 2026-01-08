# Build stage
FROM klakegg/hugo:0.111.3-ext-alpine AS builder

# Install wget if needed (though not for search anymore)
RUN apk add --no-cache wget

WORKDIR /src
COPY . .

# Build the site (this generates index.json and podcast feeds)
# Content Adapters and Search Output are handled natively by Hugo
RUN hugo --minify

# Compress the search index for faster loading
RUN gzip -k public/index.json

# Final stage
FROM ghcr.io/fly-apps/hello-static:latest

# Copy the built site from the builder stage
COPY --from=builder /src/public /site
