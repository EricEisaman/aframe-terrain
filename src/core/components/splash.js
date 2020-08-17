export default(()=>{

AFRAME.registerComponent('splash', {
  schema: {
	  waterlevel: {default: 28},
    soundin: {default:'https://cdn.glitch.com/7d8a1e47-5d85-4a86-8736-7461b2a17688%2Fsplash.mp3?v=1565827421579'},
    soundout: {default:'https://cdn.glitch.com/7d8a1e47-5d85-4a86-8736-7461b2a17688%2Fsplash.mp3?v=1565827421579'}
  },
  
  init: function(){
    
    const water = document.querySelector('a-water');
    CS1.waterlevel = (water) ? water.object3D.position.y  : this.data.waterlevel;
    
    CS1.splashIn = new Audio(this.data.soundin);
    CS1.splashIn.addEventListener('load',e=>{
      CS1.splashIn.volume = 0.01;
    });
    
    CS1.splashOut = new Audio(this.data.soundout);
    CS1.splashOut.addEventListener('load',e=>{
      CS1.splashOUt.volume = 0.01;
    });
    
    CS1.playerIsUnderWater = false;
    
    CS1.env = document.querySelector('[environment]');
 
     
    
  },
  
  
  tick: (t,dt)=>{

  if(!(CS1&&CS1.myPlayer&&CS1.myPlayer.object3D&&CS1.game.hasBegun))return;  
  const py = CS1.myPlayer.object3D.position.y;
  if(CS1.playerIsUnderWater && py>CS1.waterlevel){
     CS1.splashOut.play();
     if(CS1.env)CS1.env.setAttribute('environment','fog:0.25');
     if(CS1.bgm)CS1.bgm.play(1);
  }else if(!CS1.playerIsUnderWater && py<CS1.waterlevel){
     CS1.splashIn.play();
     if(CS1.env)CS1.env.setAttribute('environment','fog:0.9');
     if(CS1.bgm)CS1.bgm.play(0);
  }
  if(py<CS1.waterlevel){
    CS1.playerIsUnderWater = true;
  }else{
    CS1.playerIsUnderWater = false;
  }
    
    
    
    
  }
  
  
  
  
  
  
  
});
  
})()