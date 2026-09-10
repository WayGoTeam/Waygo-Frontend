# Build stage
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
RUN npm run build

# Production stage
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx/app.conf /etc/nginx/waygo-app.conf
# Staged, not active: 20-waygo-tls.sh installs it only if a certificate exists.
COPY nginx/tls.conf /etc/nginx/waygo-tls.conf.disabled
COPY nginx/20-waygo-tls.sh /docker-entrypoint.d/20-waygo-tls.sh
RUN chmod +x /docker-entrypoint.d/20-waygo-tls.sh
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
