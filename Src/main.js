import Phaser from "phaser";
import Assests from "./Scenes/essentials";

const config ={
    width: 800,
    height: 500,
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
}

const game = new Phaser.Game(config)

game.scene.add('Assests',Assests, true)
