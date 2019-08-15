const axios = require("axios");
const Dev = require("../models/Dev");

module.exports = {
    async index(req, res) {
        const {
            user
        } = req.headers;

        const loggedDev = await Dev.findById(user);

        if (!loggedDev) {
            return res.status(400).json({
                message: 'Dev does not exists'
            });
        }

        try {
            const users = await Dev.find({
                $and: [{
                    _id: {
                        $ne: user
                    }
                }, {
                    _id: {
                        $nin: loggedDev.likes
                    }
                }, {
                    _id: {
                        $nin: loggedDev.dislikes
                    }
                }]
            });

            return res.json(users);
        } catch (error) {
            return error;
        }
    },
    async show(req, res) {
        const id = req.params.id;

        const user = await Dev.findById(id);

        return res.status(200).json(user);
    },
    async store(req, res) {
        const {
            username
        } = req.body;

        const userExists = await Dev.findOne({
            user: username
        });

        if (userExists) {
            return res.json(userExists);
        }

        try {
            const response = await axios.get(
                `https://api.github.com/users/${username}`
            );

            if (response.data.message) {
                return res.status(404).json({
                    message
                });
            }
            const {
                name,
                bio,
                avatar_url: avatar
            } = response.data;

            const dev = await Dev.create({
                name,
                user: username,
                bio,
                avatar
            });
        } catch (error) {
            return res.status(400).send({
                message: error.response.data.message
            });
        }

        return res.status(201).json(dev);
    }
};