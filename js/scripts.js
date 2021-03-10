$(()=> {
	console.log('page loaded');

	$.getJSON('https://api.scryfall.com/sets', function(res) {
		let sets = res.data;
		let html = '';
		for(let set of sets) {
			html += `<div class="set" title="${set.name}" onclick="openSet('${set.search_uri}')">
				<img src="${set.icon_svg_uri}" width="32px">
				<span class="set-code">${set.code.toUpperCase()}</span>
				<span class="set-name">${set.name}</span>
			</div>`;
		}
		$('#sets').append(html);
	});

});

function openSet(uri) {
	console.log(uri);
}