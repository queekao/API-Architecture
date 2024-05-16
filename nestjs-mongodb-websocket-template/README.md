## if there is a big revison please upgrade the docker-compose image version

    - Upgrade docker version when the development feature complete
    - Upgrade package version when you add more package

## How to use?

1. Copy .env.example to .env
2. If there is any database revision, you can adjust `prisma/schema.prisma`,then remove migrations and rerun the migration [prisma schema](https://www.prisma.io/docs/concepts/components/prisma-schema)
3. Install package：
   ```bash
   $ npm install
   ```
4. Start the server
   ```bash
   $ ./start.sh
   ```

## Database Migrations

View more details [prisma migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)

```bash
$ docker exec -u root -it ${CONTAINER_NAME} npx prisma migrate dev
```

Deployment:

```bash
$ sudo /bin/bash start.sh
```

## License

Nest is [MIT licensed](LICENSE).
