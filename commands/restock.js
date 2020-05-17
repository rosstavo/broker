module.exports = {
	name: 'restock',
	aliases: [
		'restock'
	],
	description: 'This command works with the broker.',
	execute(msg, args, embed) {

		const fn = require('../functions.js');
		const fs = require('fs');

		const today = new Date(new Date().toUTCString());
		const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

        const transferQty = require('../transferQty.json');

        let stockQty = JSON.parse( fs.readFileSync('stockQty.json') );

        let newQty = fn.getQtys( transferQty );

        if ( args.length ) {
            newQty = JSON.parse( `[${args[0].split('').join(',')}]`)
        }

        if ( newQty.length !== 9 ) {
            msg.reply( 'Syntax error.' );
        }

        stockQty[date] = newQty;

		fs.writeFile( 'stockQty.json', JSON.stringify(stockQty), 'utf-8', (err) => {
			if (err) throw err;
		} );

        return true;

	},
};
