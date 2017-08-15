# LEER ANTES

### INSTALACION
Primero se deben instalar las dependencias utilizando el comando siguiente:
```
bundle install
```

Luego debe correr las migraciones:
```
rails db:migrate
```

**Estas listo para probar la aplicacion usando el comando:**
```
rails s
```

### NOTAS
- Esta aplicacion solamente ha sido probada en un ambiente windows.
- Dependiendo del hashtag ingresado puede ser que el request se caiga por las limitaciones del API de Twitter.
