# Étape 1 : build de l'application React
FROM node:20-alpine AS build
WORKDIR /app

# Installer dépendances
COPY package*.json ./
RUN npm install

# Copier le reste des fichiers
COPY . .

# Déclarer les ARG pour recevoir les variables d'environnement au build
ARG VITE_API_URL
ARG VITE_JWT_STORAGE_KEY
ARG VITE_JWT_REFRESH_KEY
ARG VITE_API_TIMEOUT
ARG VITE_API_RETRY_ATTEMPTS

# Les convertir en variables d'environnement pour Vite
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_JWT_STORAGE_KEY=$VITE_JWT_STORAGE_KEY
ENV VITE_JWT_REFRESH_KEY=$VITE_JWT_REFRESH_KEY
ENV VITE_API_TIMEOUT=$VITE_API_TIMEOUT
ENV VITE_API_RETRY_ATTEMPTS=$VITE_API_RETRY_ATTEMPTS

# Build de l'app avec les variables d'environnement
RUN npm run build

# Étape 2 : nginx pour servir les fichiers statiques
FROM nginx:alpine

# Supprimer la page par défaut de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copier les fichiers de build vers nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port attendu par Fly.io
EXPOSE 8080

# Modifier nginx pour écouter sur le bon port
RUN sed -i 's/80;/8080;/g' /etc/nginx/conf.d/default.conf

# Lancer nginx
CMD ["nginx", "-g", "daemon off;"]
