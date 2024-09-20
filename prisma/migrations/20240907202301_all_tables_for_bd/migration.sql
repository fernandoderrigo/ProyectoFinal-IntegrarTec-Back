-- CreateTable
CREATE TABLE "playlists" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "created_At_Datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At_Datetime" TIMESTAMP(3),

    CONSTRAINT "playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "songs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "release_Date" TIMESTAMP(3) NOT NULL,
    "state" TEXT NOT NULL DEFAULT '1',

    CONSTRAINT "songs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "song_in_playlist" (
    "id_Playlist" INTEGER NOT NULL,
    "id_Song" INTEGER NOT NULL,

    CONSTRAINT "song_in_playlist_pkey" PRIMARY KEY ("id_Playlist","id_Song")
);

-- CreateTable
CREATE TABLE "history_user" (
    "id_user" INTEGER NOT NULL,
    "id_song" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "history_user_pkey" PRIMARY KEY ("id_user","id_song","date")
);

-- CreateTable
CREATE TABLE "voice_command" (
    "id" SERIAL NOT NULL,
    "command" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "interpretation" TEXT NOT NULL,

    CONSTRAINT "voice_command_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "playlists" ADD CONSTRAINT "playlists_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song_in_playlist" ADD CONSTRAINT "song_in_playlist_id_Playlist_fkey" FOREIGN KEY ("id_Playlist") REFERENCES "playlists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song_in_playlist" ADD CONSTRAINT "song_in_playlist_id_Song_fkey" FOREIGN KEY ("id_Song") REFERENCES "songs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history_user" ADD CONSTRAINT "history_user_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history_user" ADD CONSTRAINT "history_user_id_song_fkey" FOREIGN KEY ("id_song") REFERENCES "songs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
