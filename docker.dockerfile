# Use nginx to serve static HTML files
FROM nginx:alpine

# Copy HTML files to nginx web directory
COPY *.html /usr/share/nginx/html/
COPY *.jpg /usr/share/nginx/html/
COPY *.jpeg /usr/share/nginx/html/
COPY *.png /usr/share/nginx/html/
COPY *.avif /usr/share/nginx/html/
COPY *.webp /usr/share/nginx/html/

# Create nginx configuration for SPA routing
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index mainpage.html; \
    location / { \
        try_files $uri $uri/ /mainpage.html; \
    } \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]