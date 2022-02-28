const mongoose = require("mongoose");

/* jshint -W119 */
const dbConnection = async () => {

    try {
        await mongoose.connect( process.env.BD_CNN);
        console.log('DB Online');
    } catch (error) {
        console.log(error);
        throw new Error('Error to start DB');
    }

};

module.exports = {
    dbConnection
};