let blackJackAssets={
	'you':{'scoreSpan':'#you-score','div':'#your-box','score':0},
	'dealer':{'scoreSpan':'#dealer-score','div':'#dealer-box','score':0},
	'cards':['2','3','4','5','6','7','8','9','10','K','J','Q','A'],
	'cardsMap':{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':10,'J':10,'Q':10,'A':[1,11]},
	'wins':0,
	'losess':0,
	'draws':0,
	'isStand':false,
	'turnOver':false
};
const YOU=blackJackAssets['you'];
const DEALER=blackJackAssets['dealer'];
const hitSound=new Audio('sounds/swish.m4a');
const winSound=new Audio('sounds/cash.mp3');
const lossSound=new Audio('sounds/aww.mp3');

document.querySelector('#btn-hit').addEventListener('click',blackjackHit);
document.querySelector('#btn-stand').addEventListener('click',dealerLogic);
document.querySelector('#btn-deal').addEventListener('click',blackjackDeal);

function blackjackHit(){
	if(blackJackAssets['isStand']==false){
		let card=randomCards();
		showCard(card,YOU);
		updateScore(card,YOU);
		showScore(YOU);
	}
}
function randomCards(){
	let card=Math.floor(Math.random()*13)
	return blackJackAssets['cards'][card];
}
function showCard(card,selectedUser){
	if(selectedUser['score']<=21){
		let yourimage=document.createElement('img');
		yourimage.src=`images/${card}.png`;
		document.querySelector(selectedUser['div']).appendChild(yourimage);
		hitSound.play();
	}
}
function blackjackDeal(){

	if(blackJackAssets['turnOver']==true){
		blackJackAssets['isStand']=false;
		let yourImages=document.querySelector(YOU['div']).querySelectorAll('img');
		let dealerImages=document.querySelector(DEALER['div']).querySelectorAll('img');

		for(let i =0;i<yourImages.length;i++){
			yourImages[i].remove();
		}
		for(let i =0;i<dealerImages.length;i++){
			dealerImages[i].remove();
		}
		YOU['score']=0;
		DEALER['score']=0;

		document.querySelector('#you-score').textContent=0;
		document.querySelector('#you-score').style.color = '#ffffff';
		document.querySelector('#dealer-score').textContent=0;
		document.querySelector('#dealer-score').style.color = '#ffffff';
		document.querySelector('#res-header').textContent = "Lets's Play";
		document.querySelector('#res-header').style.color = 'black';
		
		blackJackAssets['turnOver']=false;

	}
	
}
function updateScore(card,selectedUser){
	if(card=='A'){
		if(selectedUser['score'] + blackJackAssets['cardsMap'][card][1]<=21){
			selectedUser['score'] += blackJackAssets['cardsMap'][card][1]
		}else{
			selectedUser['score'] += blackJackAssets['cardsMap'][card][0]
		}
	}else{
		selectedUser['score'] += blackJackAssets['cardsMap'][card]
	}
}
function showScore(selectedUser){
	if(selectedUser['score']>21){
		document.querySelector(selectedUser['scoreSpan']).textContent = 'BUST!';
		document.querySelector(selectedUser['scoreSpan']).style.color  = 'red';
	}
	else{
		document.querySelector(selectedUser['scoreSpan']).textContent = selectedUser['score'];
	}
}
function sleep(ms){
	return new Promise(resolve => setTimeout(resolve,ms))
}
async function dealerLogic(){
	blackJackAssets['isStand']=true;
	while(DEALER['score']<16 && blackJackAssets['isStand']===true){
		let card=randomCards();
		showCard(card,DEALER);
		updateScore(card,DEALER);
		showScore(DEALER);
		await sleep(1000);
	}
	
	blackJackAssets['turnOver']=true;
	showResult(decideWinner());
	
}
function decideWinner(){
	let winner;
	if(YOU['score']<=21){
		if(YOU['score']>DEALER['score'] || DEALER['score']>21){
			console.log('You win!');
			blackJackAssets['wins']++;
			winner=YOU;
		}else if (DEALER['score']>YOU['score']) {
			console.log('You lost!');
			blackJackAssets['losess']++;
			winner=DEALER;
		}else if (YOU['score']===DEALER['score']) {
			console.log('You drew!');
			blackJackAssets['draws']++;
		}
	}else if (YOU['score']>21 && DEALER['score']<=21) {
		console.log('You lost!');
		blackJackAssets['losess']++;
		winner=DEALER;
	}else if (YOU['score']>21 && DEALER['score']>21) {
		console.log('You drew!');
		blackJackAssets['draws']++;
	}
	console.log(winner);
	return winner;
}
function showResult(winner){
	let msg,msgcolor;
	if(blackJackAssets['turnOver']==true){
		if(winner===YOU){
			document.querySelector('#Wins').textContent=blackJackAssets['wins'];
			msg='You Win!'
			msgcolor='green';
			winSound.play();
		}else if (winner===DEALER) {
			document.querySelector('#Losess').textContent=blackJackAssets['losess'];
			msg='You Lost!';
			msgcolor='red';
			lossSound.play();
		}else{
			document.querySelector('#Draws').textContent=blackJackAssets['draws'];
			msg='Yor Drew!';
			msgcolor='yellow';
		}
		document.querySelector('#res-header').textContent=msg;
		document.querySelector('#res-header').style.color = msgcolor;
	}
}