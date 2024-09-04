# Tasklist
- [] Conexion con prisma y db
- [] Modelos prisma
- [] Metodos para controladores
- [] Validaciones Joi - Schemas
- [] Validacion de schemas
- [] Tokens
- []

## Models
```prisma
model Users {
id               Int              @id @default(autoincrement())
firstName        String
lastName         String
nickName         String
birthday         Date
email            String           @unique
password         String
state            String           @default("1")
createdAt        DateTime         @default(now())
updatedAt        DateTime?        @updatedAt
}
model Songs {
id               Int            @id @default(autoincrement())
name             String
artist           String
album            String
duration         Int
gender           String
image            String
releaseDate      Date
state            String         @default("1")
createdAt        DateTime       @default(now())
updatedAt        DateTime?      @updatedAt
}

model Playlist{
id               Int            @id @default(autoincrement())
name             String
id_user          Int            @relation(fields: [id_user], references: [id])
createdAt        DateTime       @default(now())
updatedAt        DateTime?      @updatedAt
}

model VoiceCommand{
id               Int             @id @default(autoincrement())
command          String
interpretation   String
date             timestamp
}

model HistoryUser{
id_User          Int            @relation(fields: [id_User], references: [id])
id_Song          Int            @relation(fields: [id_Song], references: [id])
date             timestamp
}

model SongInPlaylist{
id_Playlist      Int            @relation(fields: [id_Playlist], references: [id])
id_Song          Int            @relation(fields: [id_Song], references: [id])
}

model Preferences{
id_User          Int            @relation(fields: [id_User], references: [id])
id_Song          Int            @relation(fields: [id_Song], references: [id])
gerder_fav       String
artist_fav       String
}
```


