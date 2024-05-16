#!bin/bash

touch .restart
chmod 755 docker-entrypoint.sh
chmod 766 .restart
mkdir -p static
chown -R app:app static