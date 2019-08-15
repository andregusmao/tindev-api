const express = require('express');
const DevController = require('./controllers/DevController');
const LikeController = require('./controllers/LikeController');
const DislikeController = require('./controllers/DislikeController');

const routes = express.Router();

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);
routes.get('/devs/:id', DevController.show);
routes.post('/devs/:devId/like', LikeController.store);
routes.post('/devs/:devId/dislike', LikeController.store);

module.exports = routes;