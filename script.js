var list_data = {
	all : {
		id : 0,
		first : 1,
		last : 140
	},
	gen1 : {
		id : 1,
		first : 1,
		last : 140
	},
	gen2 : {
		id: 2,
		first : 152,
		last : 251
	},
	gen3 : {
		id : 3,
		first : 252,
		last : 386
	},
	gen4 : {
		id : 4,
		first : 387,
		last : 493
	},
	gen5 : {
		id : 5,
		first : 494,
		last : 649
	},
	gen6 : {
		id : 6,
		first : 650,
		last : 721
	},
	gen7 : {
		id : 7,
		first : 722,
		last : 809
	},
	gen8 : {
		id : 8,
		first : 810,
		last : 898
	},
	test: {
		id : 9,
		first : 1,
		last : 12
	},
	Subspecies: {
		id : 'B',
		gen : 1,
		contents : ['B5','B12','B24','B31','B32','B33','B35','B37','B39','B40','B45','B46','B48','B49','B55','B58','B61','B62','B64','B65','B71','B72','B75','B76','B80','B81','B83','B84','B85','B86','B88','B89','B90','B91','B92','B93','B95','B96','B97','B99','B101','B102','B104','B105','B110','B112','B116']
  }
};



var maxPokemon = list_data.all.last;
var pokemonList = [];
var topGridImgArray = document.querySelectorAll('#grid img');
var TESTING = false;
var imagePath = 'images/'

Array.removeRandom = function(array) {
	var _randIndex = Math.floor(Math.random() * array.length);
	return array.splice(_randIndex, 1)[0];
}

//recursive method to load each image
function loadImage(index) {
	if(index > maxPokemon) { //reached last image
		document.getElementById('loader-screen').style.display = 'none';
		document.getElementById('game').style.display = 'block';
		document.getElementById('settings').style.display = 'inline-block';
		return;
	}
	
	var _tmpImage = new Image();
	_tmpImage.onload = function() {
		
		//update progress bar
		var _percentageNode = document.getElementById('percentage').querySelector('span');
		var _fillNode = document.getElementById('percentage-fill');
		
		_percentageNode.innerText = index/maxPokemon*100;
		_fillNode.style.width = ''+index/maxPokemon*100+'%';
		loadImage(index + 1);
	};
		_tmpImage.src = imagePath + index + '.png';
}

function createIntegerArray(startValue, endValue) {
	var _array = [];
	for(j = startValue; j <= endValue; j++) {
		_array.push(j);
	}
	return _array;
}

//returns a List containing the pokemon selected based on which settings are checked
function getPokemonList() {
	var list = [];
	
	if(TESTING) {
		return createIntegerArray(list_data.test.first, list_data.test.last);
	}
	//all gens
	list = createIntegerArray(list_data.all.first, list_data.all.last);

	//add each form set that is checked to the list based on criteria
	if(document.querySelector('input[name="forms-radio"]:checked').value == 'poke'){//add forms by pokemon
		//add forms based on already included pokemon
		list = list.concat(list_data['Subspecies'].contents);
	}
	
	return list;
}

//returns an array of all elements of arrayA that have a matching string of numbers in arrayB
function matchPokemon(sourceArray,dictionaryArray){
	var matchArray = [];
	for(j = 0; j < sourceArray.length; j++){
			if(dictionaryArray.includes(Number(sourceArray[j].replace(/\D/g,'')))){
				matchArray.push(sourceArray[j]);
			}
	}
	console.log(matchArray);
	return matchArray;
}

initilizeGame = function() {
	//preload pokemon images
	//loadImage(1);
	document.getElementById('loader-screen').style.display = 'none';
	document.getElementById('game').style.display = 'block';
	document.getElementById('settings').style.display = 'block';

	//set event handlers
	var nodes = document.getElementsByClassName('egg');
	for(i = 0; i < nodes.length; i++) {
		nodes[i].onclick = startGame;	
	}
	
	
	document.getElementById('button-skip').onclick = skip;
	document.getElementById('button-undo').onclick = undo;
	document.getElementById('button-reset').onclick = resetGame;
}

displayPokemon = function() {
	if(TESTING) {
		console.log('------- length: ' + pokemonList.length);
	}
	var _myListElement = document.getElementById('pkmnList');
	_myListElement.innerHTML = '';
	for(i = 0; i < pokemonList.length; i++) {
		var tmpNode = document.createElement('li');
		tmpNode.innerHTML = pokemonList[i];
		_myListElement.appendChild(tmpNode);
		if(TESTING)
			console.log(pokemonList[i]);
	}
	
}

skip = function() {
	var _dexNumber = document.querySelector('#pkm2 img').getAttribute('dexnumber');
	pokemonList.push(_dexNumber);
	generatePokemon(document.querySelector('#pkm1 img'), false);
}

undo = function() {
		/* remove most recent node from undoList
		
	   check if the savedChoice id number matches the randomly generated
	   number for either choice
			if it does, then do not add the matchingChoice back into the list
			otherwise, add both currentChoices into the list
	
		next update the src of each location's choice
	
		check if we are at the top 10 choices and update that number as well
		
		update elminated text
		
		check if we need to disable the undo button (list is null)
	*/
	var _history = undoArray.pop();
	var _pkm1 = document.querySelector('#pkm1 img');
	var _pkm2 = document.querySelector('#pkm2 img');
	
	_history.saved = _history[1];
	_history.deleted = _history[0];
	
	//check if we need to remove the saved pokemon from the array (to prevent duplicates)
	if(_history.saved.value != _pkm1.getAttribute('dexnumber') &&
	   _history.saved.value != _pkm2.getAttribute('dexnumber')) {
	   pokemonList.splice(pokemonList.indexOf(_history.saved.value), 1);
	}
	
	//check if we need to add the currently displayed pokemon back into the array
	if(_history.saved.value != _pkm1.getAttribute('dexnumber') &&
		_history.deleted.value != _pkm1.getAttribute('dexnumber')) {
		pokemonList.push(_pkm1.getAttribute('dexnumber'));
	}
	if(_history.saved.value != _pkm2.getAttribute('dexnumber') &&
		_history.deleted.value != _pkm2.getAttribute('dexnumber')) {
		pokemonList.push(_pkm2.getAttribute('dexnumber'));
	}
  

   //update the top 10 grid
   if(pokemonList.length + 1 <= topGridImgArray.length)
	{
		topGridImgArray[pokemonList.length].src = 'images/fill.png';
	}
   
   //update the eliminated count
   document.querySelector('#choice span#remaining').innerText = maxPokemon - pokemonList.length - 2;
   
   
   //pokemonList, etc. should be ready now, so let's update the pokemon
   if(document.getElementById('sprites').checked && imagePath+_history.saved.value <= 721)
			document.querySelector('#' + _history.saved.sourceId + ' img').src = 'images/'+_history.saved.value + '.png';
	 else
			document.querySelector('#' + _history.saved.sourceId + ' img').src = imagePath+_history.saved.value + '.png';
			
   document.querySelector('#' + _history.saved.sourceId + ' img').setAttribute('dexnumber', _history.saved.value);
   document.querySelector('#' + _history.saved.sourceId + ' img').title = _history.saved.value;
   
      if(document.getElementById('sprites').checked && imagePath+_history.deleted.value <= 721)
			document.querySelector('#' + _history.deleted.sourceId + ' img').src = 'images/'+_history.deleted.value + '.png';
	 else
			document.querySelector('#' + _history.deleted.sourceId + ' img').src = imagePath+_history.deleted.value + '.png';

   document.querySelector('#' + _history.deleted.sourceId + ' img').setAttribute('dexnumber', _history.deleted.value);
   document.querySelector('#' + _history.deleted.sourceId + ' img').title = _history.deleted.value;
   
   if(undoArray.length == 0)
   		document.getElementById('button-undo').disabled = true;
   
   if(TESTING) {
	   console.log('action: undo pressed');
	   console.log(_history.deleted.value + '  ' + _history.saved.value);
	   displayPokemon();
   }
}

startGame = function() {

	//set imagepath variable

	imagePath = 'images/'

	//generate the pokemon list we will use.
	pokemonList = getPokemonList();
	
	//show the playing board
	document.getElementById('settings').style.display = 'none';
	document.getElementById('grid').style.display = 'block';
	document.getElementById('button-reset').style.display = 'block';
	
	//update the maximum pokemon number
	maxPokemon = pokemonList.length;
	document.querySelector('#choice span#total').innerText = maxPokemon;
	//update the minimum pokemon number
	document.querySelector('#choice span#remaining').innerText = maxPokemon - pokemonList.length;
	
	//set the eggs to two random pokemon
	generatePokemon(document.querySelector('#pkm1 img'), false);
	
	//enable the skip and undo buttons
	document.getElementById('button-skip').removeAttribute('disabled');
}

resetGame = function() {
	document.getElementById('grid').style.display = 'none';
	document.getElementById('remaining').innerHTML = '---';
	document.getElementById('total').innerHTML = '---';
	document.getElementById('settings').style.display = 'inherit';
	document.getElementById('button-reset').style.display = 'none';
	document.getElementById('button-skip').disabled = true;
	document.getElementById('button-undo').disabled = true;
	document.querySelector('#pkm1 img').src = 'images/egg.png';
	document.querySelector('#pkm2 img').src = 'images/egg.png';
	document.querySelector('#pkm1 img').onclick = startGame;
	document.querySelector('#pkm2 img').onclick = startGame;
	document.querySelector('#pkm1 img').className = 'egg';
	document.querySelector('#pkm2 img').className = 'egg';
	document.querySelector('#pkm1 img').removeAttribute('dexnumber');
	document.querySelector('#pkm2 img').removeAttribute('dexnumber');
	topGridImgArray[0].src = 'images/fill.png';
	topGridImgArray[1].src = 'images/fill.png';
	topGridImgArray[2].src = 'images/fill.png';
	topGridImgArray[3].src = 'images/fill.png';
	topGridImgArray[4].src = 'images/fill.png';
	topGridImgArray[5].src = 'images/fill.png';
	topGridImgArray[6].src = 'images/fill.png';
	topGridImgArray[7].src = 'images/fill.png';
	topGridImgArray[8].src = 'images/fill.png';
	pokemonList = [];
	undoArray = [];
}

/*undoArray[ {value: 1, action: 'delete', sourceId: callLocation},
			 {value: 1, action: 'save', sourceId: callLocation} ]
	 );

	value: dexnumber
	action: 'delete' or 'save'
	sourceId: 'pkm1' or 'pkm2'
*/
var undoArray = [];

generatePokemon = function(callLocation, updateUndo) {	
	
	var uncalledLocation;
	
	if(callLocation.parentNode.id == 'pkm1') 
		uncalledLocation = document.querySelector('#pkm2 img');
	else if(callLocation.parentNode.id == 'pkm2') {
		uncalledLocation = document.querySelector('#pkm1 img');
	}
	
	
	//update the undo list
	if(updateUndo) {
		var unlikedPkm = {
			value: uncalledLocation.getAttribute('dexnumber'),
			action: 'delete',
			sourceId: uncalledLocation.parentNode.id
		};
		
		var likedPkm = {
			value: callLocation.getAttribute('dexnumber'),
			action: 'save',
			sourceId: callLocation.parentNode.id	
		};
		
		undoArray.push([unlikedPkm, likedPkm]);
	} else {
		callLocation.className = '';
		uncalledLocation.className ='';
	}
	
	//need to update the top list before changing the displayed src
	if(pokemonList.length + 1 <= topGridImgArray.length)
	{
		topGridImgArray[pokemonList.length].src = uncalledLocation.src;
	}
	
	if(pokemonList.length > 0) {
		
		var pkmId = Array.removeRandom(pokemonList);
		
		//add the liked pokemon back into the list
		if(callLocation.getAttribute('dexnumber')) {
			pokemonList.push(callLocation.getAttribute('dexnumber'));
		}
		
		//update pkm1 and pkm2
		callLocation.src = imagePath + pkmId + '.png';
			
		callLocation.setAttribute('dexnumber', pkmId);
		callLocation.onclick = function(e) { generatePokemon(this, true); };
		callLocation.title = callLocation.getAttribute('dexnumber');
		
		pkmId = Array.removeRandom(pokemonList);
		
		uncalledLocation.src = imagePath + pkmId + '.png';
			
		uncalledLocation.setAttribute('dexnumber', pkmId);
		uncalledLocation.onclick = function(e) { generatePokemon(this, true); };
		uncalledLocation.title = uncalledLocation.getAttribute('dexnumber');
		
		//update pokemon remaining
		document.querySelector('#choice span#remaining').innerText = maxPokemon - pokemonList.length - 2;
		if(TESTING) {
			console.log('action: generated pokemon');
			console.log(callLocation.getAttribute('dexnumber') + '  ' + uncalledLocation.getAttribute('dexnumber'));
			displayPokemon();
		}
	} else {
		//no pokemon left in list
		callLocation.onclick = '';
		uncalledLocation.onclick = '';
		uncalledLocation.className = 'hidden';
		document.querySelector('#choice span#remaining').innerText = maxPokemon;
	}
	
	if(document.getElementById('button-undo').disabled && undoArray.length > 0)
		document.getElementById('button-undo').disabled = false;
	
}

document.body.onload = initilizeGame();

