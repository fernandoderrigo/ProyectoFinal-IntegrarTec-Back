import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

cron.schedule('0 0 * * *', async () => {
  console.log('Starting daily task to collect and update user preferences...');

  try {
    const users = await prisma.users.findMany();

    for (const user of users) {

      const history = await prisma.history_user.findMany({
        where: { id_user: user.id },
        include: {
          songs: {
            include: {
              artists_on_songs: {
                include: {
                  artists: true 
                }
              }
            }
          }
        }
      });


      if (!history || history.length === 0) {
        console.log(`No history found for user with id: ${user.id}`);
        continue; 
      }

      const songGenres = history
        .filter(h => h.songs)  
        .map(h => h.songs.gender);
        
      const favoriteGenres = getTopTwoGenres(songGenres);

      const songArtistIds = history.flatMap((h) => {
        if (h.songs && h.songs.artists_on_songs) {
          return h.songs.artists_on_songs.map((artistOnSong) => artistOnSong.artistId);
        }
        return []; 
      });     
      
      const favoriteArtists = await getTopTwoArtists(songArtistIds);

      const favoriteSongs = getTopTwoSongs(history); 

      await prisma.preferences.upsert({
        where: { id_user: user.id },
        update: {
            genders_fav: favoriteGenres,
            artists_fav: favoriteArtists,
            songs: { set: favoriteSongs.map(song => ({ id: song.id })) } 
        },
        create: {
            id_user: user.id,
            genders_fav: favoriteGenres,
            artists_fav: favoriteArtists,
            songs: { connect: favoriteSongs.map(song => ({ id: song.id })) } 
        }
    });    
    }

    console.log('Preferences successfully updated for all users.');
  } catch (error) {
    console.error('Error updating preferences:', error);
  }
});

function getTopTwoGenres(genres) {
  const genreCount = genres.reduce((acc, genre) => {
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {});

  return Object.keys(genreCount)
    .sort((a, b) => genreCount[b] - genreCount[a])
    .slice(0, 2);
}

async function getTopTwoArtists(artistIds) {
  const artistCount = artistIds.reduce((acc, artistId) => {
    acc[artistId] = (acc[artistId] || 0) + 1;
    return acc;
  }, {});

  const topArtistIds = Object.keys(artistCount)
    .sort((a, b) => artistCount[b] - artistCount[a])
    .slice(0, 2);

  const topArtists = await prisma.artists.findMany({
    where: { id: { in: topArtistIds.map(Number) } }
  });

  return topArtists.map(artist => artist.name);
}

function getTopTwoSongs(history) {
  const songCount = history.reduce((acc, h) => {
    acc[h.id_song] = (acc[h.id_song] || 0) + 1;
    return acc;
  }, {});

  const topSongIds = Object.keys(songCount)
    .sort((a, b) => songCount[b] - songCount[a])
    .slice(0, 2);

  return history
    .filter(h => topSongIds.includes(h.id_song.toString()))
    .map(h => h.songs);
}

