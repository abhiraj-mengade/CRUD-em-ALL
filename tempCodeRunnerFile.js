const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://abhiraj:1a2a3a@main.uk6xc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
mongoose.connection.once('open', () => {
    console.log('conneted to database');
});