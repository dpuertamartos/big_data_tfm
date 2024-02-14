#!/bin/bash

# Navigate to your docker-compose project directory
cd /home/ubuntu/web/big_data_tfm

# Run certbot for renewal
docker-compose run --rm certbot renew --webroot --webroot-path=/var/www/certbot

# Reload nginx to apply any renewed certificates
docker-compose exec nginx nginx -s reload
