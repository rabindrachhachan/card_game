import React from 'react';
import './App.css';
import{ Deck ,Player ,Game}from "./utility/helper";

const newDeck = new Deck();
var game ;

const styles = {
    playButton:{ height: 50,width:200,margin:10}
}

const Card = ({suit,value})=>{
    return(
        <div className={'card'} >
            <div className={'value'}>
                {value}
            </div>
            <div className={`suit ${suit}`}>
            </div>
        </div>
    )
}

const PlayerCard =({player})=>{
    const { name, cards,combination} = player;
    return(
        <div key ={name} style={{flexDirection:'row',margin:50,}} >
        {cards.length ? cards.map((card)=>{
            return(
                <Card key={`${card['Suit']}${card['Value']}`} suit ={card['Suit']} value ={card['Value']} />
            )
        }): <div style={{height:'80%',width:'80%'}}> </div>}
        <div style={{marginTop:10}}>
            {`${name  } : ${combination}`}
        </div>    
    </div>
    )

}

class GameContainer extends React.Component{
    constructor(props) {
        super(props);
        this.state ={
            players:[],
            started: false,
        }
    }

    
    initialiseGame =()=>{
        if(!this.state.initialise){
            let players = []
            const deck = newDeck.getDeck();
            for(let i = 1;i<5;i++){
                let player= `player${i}`;
                player = new Player(player);
                players.push(player)
            }
            game = new Game(players,deck);
            game.initialiseGame()
            this.setState({initialise:true})
        }
    }

    showCards =()=>{
        if(this.state.started){
            const players = game.showCard();
            const winner = game.getWinner(players)
            this.setState({players:players,winner,started:false});
        }
    }

    startGame =()=> {
        if(!this.state.started){
            this.initialiseGame()
            game.startGame();
            this.setState({started:true});
        }
    }
    
    render() {
        return (
            <div>
                <div style={{flexDirection:'row',margin:50,}}>
                    {this.state.players.length ? this.state.players.map((player,index)=>{
                        return(
                            <PlayerCard player={player} key={index.toString()}/>
                        )
                    }): <div style={{height:'80%',width:'80%'}}> </div>}    
                </div>
                <button 
                    onClick={()=>this.startGame()}
                    style={styles.playButton}>
                    {`Start Game`}
                </button>
                <button
                    onClick={()=>this.showCards()}
                    style={styles.playButton}>
                    {`Show Card`}
                </button>
                {typeof this.state.winner!=='undefined' && <div style={{margin:20}}>
                    {`Winner is : ${this.state.winner.name}`}
                </div>}
                
            </div>
        )
    }
}

export default GameContainer;
