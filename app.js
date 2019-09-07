const express =  require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const app = express();

startmongo = () => {
  mongoose.set('useCreateIndex', true)
  mongoose.set('unique', true)
  mongoose.connect('mongodb://localhost:27017/explore-grapghQL', {
    useNewUrlParser: true
  }).then(() => {
    console.log('Successfully connected to the database')
  }).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err)
  });
}


app.use('/graphql', graphqlHTTP({
  schema,
  graphiql:true
}));

app.listen(4000, () => {
    console.log("listening to port 4000 for requests");
    startmongo();
});