const { response } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

/* jshint -W119 */
const createUSer = async (req, res = response) => {

    const { name, email, password } = req.body;

    try {
        // verified email is unique
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'user exists with that email'
            });
        }

        // create user with our model
        const dbUser = new User(req.body);

        // hashear the password
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync(password, salt);

        // generated the JWT
        const token = await generateJWT(dbUser.id, name);

        // create DB user
        await dbUser.save();

        // generated success response

        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            email,
            token
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'please talk with the admin',
        });
    }

};

const loginUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const dbUser = await User.findOne({ email });

        if (!dbUser) {
            return res.status(400).json({
                ok: false,
                msg: "The email is wrong"
            });
        }

        // confirm match password
        const validPassword = bcrypt.compareSync(password, dbUser.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: "The password is wrong"
            });
        }

        // Generated JWT
        const token = await generateJWT(dbUser.id, dbUser.name);

        //response service
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token
        });


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Talk to the ADMIN'
        });
    }
};

const reValueToken = async (req, res) => {


    const { uid } = req;

    //read database
    const dbUser = await User.findById( uid );

    // Generated JWT
    const token = await generateJWT(uid, dbUser.name);


    return res.json({
        ok: true,
        msg: 'renew',
        uid,
        name: dbUser.name,
        email: dbUser.email,
        token
    });
};


module.exports = {
    createUser: createUSer,
    loginUser,
    reValueToken
};