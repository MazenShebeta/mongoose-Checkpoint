const express = require('express');
const app = express();
const routes = require('./router/routes');
const cors = require('cors');

app.use(cors()); app.use(express.json()); 
app.use(express.urlencoded({ extended : true}));


// app.set('view engine', 'ejs');
// app.set('views', './views');

app.use('/', routes);



app.listen(3000, ()=>{
    console.log(`listening on 3000`);

})
