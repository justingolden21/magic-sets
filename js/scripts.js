$(()=> {
	$.getJSON('https://api.scryfall.com/sets', function(res) {
		let sets = res.data;
		let html = '';
		for(let set of sets) {
			html += `<div class="set" title="${set.name}" onclick="openSet('${set.search_uri}', '${set.icon_svg_uri}', '${set.code}', '${set.name}')">
				<img src="${set.icon_svg_uri}" width="32px">
				<p class="set-code">${set.code.toUpperCase()}</p>
				<p class="set-name">${set.name}</p>
			</div>`;
		}
		$('#sets').append(html);
		$('#loading').hide();
	});

});

function openSet(uri, icon, code, name) {
	$('#loading').show();
	$.getJSON(uri, function(res) {
		let set = res.data;
		let html = `<img src="${icon}" width="32px">
		<p class="set-code">${code.toUpperCase()}</p>
		<p class="set-name">${name}</p>`;
		// console.log(set[0].name);
		// console.log(set[0].colors);
		// console.log(set[0].rarity);
		// console.log(set[0].mana_cost);
		// console.log(set[0].image_uris.art_crop);
		// console.log(set[0].image_uris.border_crop);
		// console.log(set[0].image_uris.large);
		// console.log(set[0].image_uris.normal);
		// console.log(set[0].image_uris.small);
		for(let card of set) {
			// console.log(card);
			// console.log(card.image_uris);
			// console.log(card.image_uris.large);
			// console.log(card.image_uris.normal);
			// console.log(card.image_uris.small);
			if(!card.image_uris) {
				console.error('could not find image uris:', card, card.image_uris);
				continue;
			}
			if(card.image_uris.normal) html += `<img class="card" src="${card.image_uris.normal}">`;
			else if(card.image_uris.large) html += `<img class="card" src="${card.image_uris.large}">`;
			else if(card.image_uris.small) html += `<img class="card" src="${card.image_uris.small}">`;
		}
		$('body').append(`<div class="overlay"><button class="close" onclick="closeOverlay()">&times;</button>${html}</div>`);
		$('#sets').hide();
		$('#loading').hide();
	});
}

function closeOverlay() {
	$('.overlay').remove();
	$('#sets').fadeIn();
}