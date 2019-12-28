
// Deck constructor

export function Deck(){
    this.suits =  ["spades", "diamonds", "clubs", "hearts"];
    this.values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    this.deck = []
    
}

// player constructor
export function Player(name){
    this.name = name;
    this.cards = [];
    this.combination = '';
}

// game constructor

export function Game(players,deck){
    this.start = false;
    this.players = players; 
    this.deck = deck;
    this.putCards = [];
}

Deck.prototype.getDeck = function(){
    let deck = [];
    for(var i = 0; i < this.suits.length; i++){
        for(var x = 0; x < this.values.length; x++){
            var card = {Value: this.values[x], Suit: this.suits[i],value:0};
            switch(this.values[x]){
                case "A":
                    card.value = 14;
                break
                case "J":
                    card.value = 11;
                break
                case "Q":
                    card.value = 12;
                break
                case "K":
                    card.value = 13;
                break
                default:
                    card.value = parseInt(this.values[x]);
                break;
            }
            deck.push(card);
            this.deck = deck;
        }
    }
    return deck;
}


Player.prototype.distribute = function(deck){
    for(let i =0;i<3;i++){
        const card = deck.pop(); 
        this.cards.push(card)
    }
    return deck;
}

Player.prototype.putCard = function(putCards){
    putCards.push(this.cards.pop());
    return putCards;
}


Player.prototype.pickCard = function(deck){
    const card = deck.shift();
    this.cards.push(card);
    this.arrangeCard();
    return deck;
}

Player.prototype.arrangeCard = function(){
    const cards = this.cards.sort((a,b)=> a['value'] - b['value'])
    this.cards = cards;
    if((cards[0]['value'] === cards[1]['value']) && (cards[0]['value']=== cards[2]['value']) && (cards[1]['value']=== cards[2]['value'])){
        // 1.samekind
        this.combination = 'samekind';
        return
    }
    if((cards[0]['value'] +1 === cards[1]['value']) &&  (cards[1]['value']=== cards[2]['value']-1)){
         //2.sequence : 1
        this.combination = 'sequence';
        return
    }
    if( (cards[0]['value'] === cards[1]['value']) || (cards[0]['value'] === cards[2]['value']) || (cards[1]['value'] === cards[2]['value'])){
         //3.pairs
        this.combination = 'pairs';
        return 
    }else{
        //4.hightest card
        this.combination = 'topcard';
    }
}


Game.prototype.initialiseGame =function(){
    let players = this.players;
    for(let i = 0; i < players.length;i++){
        let player = players[i];
        this.deck = player.distribute(this.deck);
    }
}

Game.prototype.startGame = function(){
    this.shuffle();
    this.start = true;
    let players = this.players;
    while(this.start && this.deck.length){

        for(let i = 0; i < players.length;i++){
            let player = players[i];
            this.putCards = player.putCard(this.putCards);
            player.pickCard(this.deck);
        }
    }
}


Game.prototype.shuffle = function(){
    for (var i = 0; i < 1000; i++){
        var location1 = Math.floor((Math.random() * this.deck.length));
        var location2 = Math.floor((Math.random() * this.deck.length));
        var tmp = this.deck[location1];
        this.deck[location1] = this.deck[location2];
        this.deck[location2] = tmp;
    }
}

Game.prototype.getWinner =function (players){
    const samekindList = players.filter((winner)=> winner['combination'] ==='samekind' );
    if(samekindList.length){
         //1.samekind :
        let max_sum = 0;
        let winner;
        for(let i = 0; i < samekindList.length;i++){
            let sum = 0;
            for(let j = 0 ; j<3;j++ ){
                sum+= samekindList[i].cards[j]['value'];
            }
            if(sum > max_sum){
                max_sum = sum;
                winner = samekindList[i];
            }
        }
        return winner;
    }

     //2.sequence : 
    const sequenceList = players.filter((winner)=> winner['combination'] ==='sequence' )
    if(sequenceList.length){
        let max_sum = 0;
        let winner;
        for(let i = 0; i < sequenceList.length;i++){
            let sum = 0;
            for(let j = 0 ; j<3;j++ ){
                sum+= sequenceList[i].cards[j]['value'];
            }
            if(sum > max_sum){
                max_sum = sum;
                winner = sequenceList[i];
            }
        }
        return winner;
    }

      //3.pairs
    const pairsList = players.filter((winner)=> winner['combination'] ==='pairs' );
    if(pairsList.length){
        let max_sum = 0;
        let winner;
        for(let i = 0; i < pairsList.length;i++){
            let sum = 0;
            for(let j = 1 ; j<3;j++ ){
                if(pairsList[i].cards[j-1]['value'] === pairsList[i].cards[j]['value']){
                    sum+= pairsList[i].cards[j-1]['value'];
                }
            }
            if(sum > max_sum){
                max_sum = sum;
                winner = pairsList[i];
            }
        }
        return winner;

    }else{
            //4.top card
            const topcardList = players.filter((winner)=> winner['combination'] ==='topcard');
            let max_sum = 0;
            let winner;
            for(let i = 0; i < topcardList.length;i++){
                let sum = topcardList[i].cards[2]['value'];
                if(sum >= max_sum){
                    max_sum = sum;
                    winner = topcardList[i];
                }
            }
            return winner;
    }
}

Game.prototype.showCard = function(){
    this.start = false;
    let list  = [];
    for(let i = 0; i < this.players.length;i++){
        let player = this.players[i]
        player.arrangeCard(player);
        list.push(player)
    }
    return list
}




