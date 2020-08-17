export default(()=>{

AFRAME.registerComponent('terrain-walk', {
  schema: {
	  heightmap: {default:'https://cdn.glitch.com/7d8a1e47-5d85-4a86-8736-7461b2a17688%2Fheightmap.png?v=1565387568467'},
    scale: {default: 100/255}
  },
  
  dependencies: ['terrain'],
  
  init: function(){
    let self = this;
    let c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');
    let heightmap = new Image();
    heightmap.crossOrigin = "Anonymous";
    heightmap.onload = function () {
      ctx.drawImage(heightmap, 0, 0);
      self.iData = ctx.getImageData(0, 0, 512, 512).data;
      self.iData = self.iData.filter((v,i)=>{return i%4===0});
      //CS1.iData = self.iData;
    };
    heightmap.src = this.data.heightmap;
    this.nextPos = new THREE.Vector3();
  },
  
  tick: function(t,dt){
    
    if(!(CS1 && CS1.myPlayer && this.iData))return;
    const x = CS1.myPlayer.object3D.position.x;
    const z = CS1.myPlayer.object3D.position.z;
    if(CS1.game.totalSteps%6===0){
    const n = Number(  (  256+  Math.round(z)  )*512  + (   255+   Math.round(x)   )    );
    //console.table({x:x,z:z,n:n,"this.iData[n]":this.iData[n]});
    const y = this.iData[n]*this.data.scale+2;
    this.nextY = y;
    CS1.myPlayer.object3D.position.lerp(new THREE.Vector3(x,y,z), 0.167);
      
    }else{
      CS1.myPlayer.object3D.position.lerp(new THREE.Vector3(x,this.nextY,z), (CS1.game.totalSteps%6) * 0.167);
    }
    
    
  
  }
  
  
  
});
  
})()