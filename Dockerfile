ROM nginx:stable-alpine AS production
COPY  ./dist /usr/share/nginx/html
COPY  ./default.conf /etc/nginx/conf.d
EXPOSE 8888

CMD ["nginx", "-g", "daemon off;"]