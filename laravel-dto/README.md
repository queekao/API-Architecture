## Requirement

Laravel v10.3.0
PHP v8.2
MySQL v5.7

## Install packages for production server

```
# Install apache
$ sudo apt install apache2

# Install mysql-client
$ sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 467B942D3A79BD29
$ sudo apt update
$ sudo apt install -f mysql-client=5.7*

# Install other packages
$ sudo apt install imagemagick
$ sudo apt install composer

# Install php 8.2
$ sudo apt install lsb-release gnupg2 ca-certificates apt-transport-https software-properties-common
$ sudo apt install php8.2 php8.2-cli php8.2-common php8.2-mysql php8.2-zip php8.2-gd php8.2-mbstring php8.2-curl php8.2-xml php8.2-bcmath php8.2-zip php8.2-imagick
```

## Init Laravel

Link the storage folder to public

```
$ php artisan storage:link
```

## Migrate database

Link the storage folder to public

```
$ php artisan migrate
```

## Create admin user

Link the storage folder to public

```
$ php artisan app:create-admin
```

## Generate application encryption key

Link the storage folder to public

```
$ php artisan key:generate
```

## Enable necessary apache modules

```
$ sudo a2enmod rewrite
$ sudo a2enmod headers
$ sudo systemctl restart apache2
```

## Hide "Server" header

```
$ sudo apt install libapache2-mod-security2
$ sudo a2enmod security2
$ sudo vim /etc/apache2/conf-enabled/security.conf
```

Set following values

```
ServerTokens Prod
ServerSignature Off
SecServerSignature " "
```

```
$ sudo systemctl restart apache2
```

## Run for development

```
I expect you already have install apache, mysql5.7 and php8.2.

# Install composer
$ sudo apt install composer

# Install nvm
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Install node v18.14.0(LTS)
$ nvm install v18.14.0
$ nvm alias default v18.14.0

# Install php libraries
$ composer install

# Install node modules
$ npm install

# Prepare config
$ cp .env.example .env
$ vim .env

# Run web server
$ php artisan serve

# Run vite for React development
$ npm run dev

# The open url http://localhost:8000 you can see the web page.
```
