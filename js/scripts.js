$(()=> {
	let url = new URL(window.location.href);
	let s = url.searchParams.get('s');

	$.getJSON('https://api.scryfall.com/sets', function(res) {
		let sets = res.data;
		let html = '';
		for(let set of sets) {
			html += `<div class="set" tabindex="0" title="${set.name}" onclick="openSet('${set.search_uri}', '${set.icon_svg_uri}', '${set.code}', '${set.name}')">
				<img src="${set.icon_svg_uri}" width="32px">
				<p class="set-code">${set.code.toUpperCase()}</p>
				<p class="set-name">${set.name}</p>
			</div>`;
		}
		$('#sets').append(html);
		$('#loading').hide();

		if(s) {
			for(let set of sets) {
				if(set.code.toUpperCase()==s.toUpperCase()) {
					openSet(set.search_uri, set.icon_svg_uri, set.code, set.name);
					break;
				}
			}
			// setTimeout(()=> $(`.set .set-code:contains("${s.toUpperCase()}")`).click(), 1000);
		}
	});


	// when enter key is pressed, click focused element
	$(document).keyup(e=> { if(e.keyCode==13) document.activeElement.click(); });

});

function openSet(uri, icon, code, name) {
	history.replaceState({}, '', '?s=' + code.toUpperCase());
	$('#loading').show();
	$.getJSON(uri, function(res) {
		let set = res.data;
		let html = `<img src="${icon}" width="32px">
		<p class="set-code">${code.toUpperCase()}</p>
		<p class="set-name">${name}</p>`;
		let errorCards = [];
		// todo: sorting and searching (using name, colors, rarity, mana cost)
		// todo: click to get art crop
		// todo: card size view options
		// todo: filter types of sets (main sets, promos, etc)
		// console.log(set[0].name);
		// console.log(set[0].colors);
		// console.log(set[0].rarity);
		// console.log(set[0].mana_cost);
		// console.log(set[0].image_uris.art_crop);
		// console.log(set[0].image_uris.border_crop);
		// console.log(set[0].image_uris.large);
		// console.log(set[0].image_uris.normal);
		// console.log(set[0].image_uris.small);
		const art_only = $('#art-checkbox').is(':checked');
		for(let card of set) {
			// console.log(card);
			// console.log(card.image_uris);
			// console.log(card.image_uris.large);
			// console.log(card.image_uris.normal);
			// console.log(card.image_uris.small);
			if(!card.image_uris) {
				console.error('could not find image uris:', card, card.image_uris);
				errorCards.push(card.name);
				continue;
			}
			if(art_only) html += `<img title="${card.name}" class="card" src="${card.image_uris.art_crop}">`
			else if(card.image_uris.normal) html += `<img title="${card.name}" class="card" src="${card.image_uris.normal}">`;
			else if(card.image_uris.large) html += `<img title="${card.name}" class="card" src="${card.image_uris.large}">`;
			else if(card.image_uris.small) html += `<img title="${card.name}" class="card" src="${card.image_uris.small}">`;
		}
		if(errorCards.length!=0) html += `<p>The following card images could not be found: ${errorCards.join(', ')}</p>`;
		$('body').append(`<div class="overlay"><button class="close" onclick="closeOverlay()" tabindex="0">&times;</button>${html}</div>`);
		$('#sets').hide();
		$('#loading').hide();
	}).catch(err => {
		$('#loading').hide();
		closeOverlay();
		console.log(err);
		window.alert('An error occured. Could not get set info. Error ' + err.status);
	});
}

function closeOverlay() {
	$('.overlay').remove();
	$('#sets').fadeIn();
	history.replaceState({}, '', '?s=');
}