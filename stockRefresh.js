require('dotenv').config();

const fs = require('fs');

const transferQty = require('./transferQty.json');


for ( let key in transferQty ) {

    let seed = Math.floor((new Date(new Date().toUTCString()) - new Date(process.env.STARTDATE)) / (24 * 60 * 60 * 1000));

    if ( (seed + transferQty[key].offset) % transferQty[key].interval === 0 ) {

        console.log( transferQty[key].items );

    }


};
