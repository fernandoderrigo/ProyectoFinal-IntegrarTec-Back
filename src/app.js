import express from 'express';
import userRoutes from './routes/userRoutes.js';
import userHistoryRoutes from './routes/userHistoryRoutes.js';
import verifyMiddleware from './middlewares/verifyMiddleware.js';
import songRoutes from './routes/songRoutes.js';
import artistRoutes from './routes/artistRoutes.js';
import albumRoutes from './routes/albumRoutes.js';
import playlistRoutes from './routes/playlistRoutes.js';
import preferences from './routes/preferenceRoutes.js';
import HTTP_STATUS from './helpers/httpstatus.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', (req, res) => {
    const responseServer = {
        status: 200,
        app: "Escucha Facil",
        routes: {
            index: "/api",
            getSongs: "/songs",
            getArtists: "/artists",
            getAlbums: "/albums",
            getPlaylists: "/playlists",
            getUsers: "/users",
            getUserHistory: "/user-history",
        }
    };
    res.status(HTTP_STATUS.OK).json(responseServer)
})
app.use('/users', userRoutes);
app.use('/user-history', verifyMiddleware, userHistoryRoutes);
app.use('/songs', verifyMiddleware, songRoutes);
app.use('/artists', artistRoutes);
app.use('/albums', albumRoutes);
app.use('/playlists', verifyMiddleware, playlistRoutes)
app.use('/preferences-user', verifyMiddleware, preferences)

export default app;