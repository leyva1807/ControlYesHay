FROM php:8.2-fpm

# Argumentos para la compilación
ARG user=laravel
ARG uid=1000

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    supervisor

# Limpiar caché
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar extensiones PHP
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Configurar PHP para aumentar límites de memoria
RUN echo "memory_limit = 1G" > /usr/local/etc/php/conf.d/memory-limit.ini
RUN echo "upload_max_filesize = 100M" >> /usr/local/etc/php/conf.d/memory-limit.ini
RUN echo "post_max_size = 100M" >> /usr/local/etc/php/conf.d/memory-limit.ini
RUN echo "max_execution_time = 120" >> /usr/local/etc/php/conf.d/memory-limit.ini

# Obtener Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Crear usuario del sistema
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

# Configurar directorio de trabajo
WORKDIR /var/www

# Copiar archivos de configuración personalizados
COPY docker/php/local.ini /usr/local/etc/php/conf.d/local.ini
COPY docker/php/www.conf /usr/local/etc/php-fpm.d/www.conf

# Usuario para los siguientes comandos
USER $user

# Puerto de exposición del contenedor
EXPOSE 9000

# Comando para iniciar PHP-FPM
CMD ["php-fpm"]
