module.exports = {
	name: 'buy',
	aliases: [
		'buy',
		'purchase'
	],
	description: 'This command works with the broker.',
	execute(msg, args, embed) {

		const fn = require('../functions.js');
		const fs = require('fs');

		const today = new Date(new Date().toUTCString());
		const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

		let dialogue = require('../dialogue.json');

		let msgContent = msg.content.split(' ');

		msgContent = msgContent.filter( arg => {
			return ! arg.match(/<[^>]*>/g) && arg !== module.exports.name;
		} );

		let index = msgContent.filter( arg => {
			return ! isNaN( arg );
		} );

		if ( Array.isArray(index) ) {
			index = index[0];
		}

		let magic = require('../magic.json');

		magic = magic.filter( item => {

			if ( item['rarity'] === 'Legendary' ) {
				return false;
			}

			if ( item['Type'] === 'Spell Scrolls' ) {
				return false;
			}

			if ( item['exclude'] ) {
				return false;
			}

			return true;
		} );

		let transferQty = require('../transferQty.json');

		let stockQty = JSON.parse( fs.readFileSync('stockQty.json') );

		if (typeof stockQty[date][index-1] === 'undefined') {
			msg.reply( fn.formatDialogue( fn.arrayRand( dialogue.error_generic ) ) );

		    return;
		}

		if ( stockQty[date][index-1] < 1 ) {
			msg.reply( fn.formatDialogue( fn.arrayRand( dialogue.stock_sold_out ) ) );

			return;
		}


		let itemsForDay = fn.itemsForDay(magic, transferQty, today).filter( item => !("formula" in item) );

		stockQty[date][index-1] = stockQty[date][index-1] - 1;

		let stockDialogue = fn.arrayRand(dialogue.stock_last_one);

		if ( stockQty[date][index-1] > 0 ) {
			stockDialogue = fn.arrayRand(dialogue.stock_left);
		}

		fs.writeFile( 'stockQty.json', JSON.stringify(stockQty), 'utf-8', function (err) {
			if (err) throw err;

			msg.reply( fn.formatDialogue( fn.arrayRand( dialogue.buy ) + ' ' + stockDialogue, [itemsForDay[index-1].item, itemsForDay[index-1].dmpg, stockQty[date][index-1]] ) );
		} );

        return true;

	},
};
