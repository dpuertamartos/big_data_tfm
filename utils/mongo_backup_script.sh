#!/bin/bash
BACKUPDIRECTORY=/home/ubuntu/Desktop/backups_mongo
# Obtener la fecha actual en el formato Año_Mes_Día
CURRENT_DATE=$(date +%Y_%m_%d)

# Ejecutar el comando de backup con la fecha en el nombre del archivo
docker run --rm -v big_data_tfm_mongodb-data:/data -v $BACKUPDIRECTORY:/backup ubuntu tar czvf /backup/mongodb-volume-backup_$CURRENT_DATE.tar.gz -C /data .
