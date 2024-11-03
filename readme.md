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

    ```bash
    sudo apt install nginx

- instalar node

    ```bash
    sudo apt install nodejs

- instalar npm

    ```bash
    sudo apt install npm

- instalar pnpm

    ```bash
    npm install -g pnpm

- instalar tsm

    ```bash
    npm install -g tsm

- instalar pm2

    ```bash
    npm install -g pm2

## configurar nginx

- instala cerbot y su plugin de nginx

    ```bash
    sudo apt install certbot python3-certbot-nginx -y

- comando para crear el archivo de configuracion

    ```bash
    sudo nano /etc/nginx/sites-available/midominio.com

- agregar esta configuración reemplazar midominio.com por tu nombre de dominio propio

    ```bash
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

    ```bash
    sudo ln -s /etc/nginx/sites-available/midominio.com /etc/nginx/sites-enabled/

- reinicia nginx

    ```bash
    sudo systemctl restart nginx

- obtener el certificado ssl

    ```bash
    sudo certbot --nginx -d midominio.com

- verificar renovación de certificado

    ```bash
    sudo certbot renew --dry-run

## Iniciar despliegue

- correr api

    ```bash
    pm2 start --interpreter npx --name "nombre-de-tu-app" tsm -- ./src/app.ts

- comando para guardar e iniciar el api al arrancar el servidor
    
    ```bash
    pm2 save
    pm2 startup

- comando para listar las aplicaciones que están corriendo

    ```bash
    pm2 list

- comando para parar una aplicación

    ```bash
    pm2 stop nombre-de-tu-app

- comando para eliminar una aplicacion

    ```bash
    pm2 delete nombre-de-tu-app
