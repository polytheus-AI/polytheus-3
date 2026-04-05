Pour construire l'infrastructure de développement : 
```bash
docker compose up
```
*(Cela démarre automatiquement l'infrastructure de développement)*

Pour démarrer l'infrastructure de développement (si elle est déjà construite) : 
```bash
docker compose start
```

Pour arrêter l'infrastructure de développement : 
```bash
docker compose stop
```

Pour détruire l'infrastructure de développement : 
```bash
docker compose down --rmi all
```

Pour avoir accès aux logs d'un service: 
```bash
docker compose logs -f <service_name>
```

Exemple (avoir accès aux logs de l'application web): 
```bash
docker compose logs -f app-dev
```

pour avoir accès aux logs de tous les services: 
```bash
docker compose logs -f
```

