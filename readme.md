## Api Whatsapp
Esta es una api no oficial de whatsapp
- Se recomienda usar pnpm

## Librerias

- [x] @bot-whatsapp/bot
- [x] @bot-whatsapp/provider-baileys

## Comando para iniciar

    pnpm run dev

## Requerimientos de despliegue

- Ubuntu 20.04
- nginx
- node
- pnpm
- pm2
- ssl

## Comandos de despliegue

- instalar nginx

    sudo apt install nginx

- instalar node

    sudo apt install nodejs

- instalar npm

    sudo apt install npm

- instalar pnpm

    npm install -g pnpm

- instalar tsm

    npm install -g tsm

- instalar pm2

    npm install -g pm2

## configurar nginx

- instala cerbot y su plugin de nginx

    sudo apt install certbot python3-certbot-nginx -y

- comando para crear el archivo de configuracion

    sudo nano /etc/nginx/sites-available/midominio.com

- agregar esta configuración reemplazar midominio.com por tu nombre de dominio propio

    server {
        listen 80;
        server_name midominio.com;

        location / {
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $host;
            proxy_set_header X-NginX-Proxy true;

            proxy_pass http://localhost:3000;  # Redirige al servicio en localhost:3000
            proxy_redirect off;
        }

        access_log /var/log/nginx/midominio.com.access.log;
        error_log /var/log/nginx/midominio.com.error.log debug;
    }

- crea el enlace simbólico de la configuración

    sudo ln -s /etc/nginx/sites-available/midominio.com /etc/nginx/sites-enabled/

- reinicia nginx

    sudo systemctl restart nginx

- obtener el certificado ssl

    sudo certbot --nginx -d midominio.com

- verificar renovación de certificado

    sudo certbot renew --dry-run

## Iniciar despliegue

- correr api

    pm2 start --interpreter npx --name "nombre-de-tu-app" tsm -- ./src/app.ts

- comando para guardar e iniciar el api al arrancar el servidor
    
    pm2 save
    pm2 startup

- comando para listar las aplicaciones que están corriendo

    pm2 list

- comando para parar una aplicación

    pm2 stop nombre-de-tu-app

- comando para eliminar una aplicacion

    pm2 delete nombre-de-tu-app
