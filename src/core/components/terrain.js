export default(()=>{

AFRAME.registerComponent('terrain', {
  schema: {
	  ocean: {default:'https://cdn.glitch.com/7e6b3197-5c1e-4085-b6f9-b585ec0f94cd%2Fcartoon_desert_soil1.jpg?v=1565735566070'},
    sand: {default:'https://cdn.glitch.com/7e6b3197-5c1e-4085-b6f9-b585ec0f94cd%2Fcartoon_sand2.png?v=1565735753925'},
    grass: {default:'https://cdn.glitch.com/7e6b3197-5c1e-4085-b6f9-b585ec0f94cd%2Fcartoon_grass3.jpg'},
    rock: {default:'https://cdn.glitch.com/7e6b3197-5c1e-4085-b6f9-b585ec0f94cd%2Fcartoon_rock_1.jpg?v=1565734703001'},
    snow: {default:'https://cdn.glitch.com/7d8a1e47-5d85-4a86-8736-7461b2a17688%2Fsnow-512.jpg?v=1565387895694'},
    heightmap: {default:'https://cdn.glitch.com/7d8a1e47-5d85-4a86-8736-7461b2a17688%2Fheightmap.png?v=1565387568467'},
    water: {default:'https://cdn.glitch.com/7d8a1e47-5d85-4a86-8736-7461b2a17688%2Fwater512.jpg?v=1565388458934'},
    scale: {default:1.0},
    addwater: {default:true},
    waterlevel: {default:5.0}
  },
  
  init: function(){
    
  const self = this;
    
      
    	// texture used to generate "bumpiness"
	var bumpTexture = new THREE.TextureLoader().load( self.data.heightmap );
	//bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping; 
	// magnitude of normal displacement
	var bumpScale   = 100*this.data.scale;
	
	var oceanTexture = new THREE.TextureLoader().load( self.data.ocean );
	oceanTexture.wrapS = oceanTexture.wrapT = THREE.RepeatWrapping; 
	
	var sandyTexture = new THREE.TextureLoader().load( self.data.sand );
	sandyTexture.wrapS = sandyTexture.wrapT = THREE.RepeatWrapping; 
	
	var grassTexture = new THREE.TextureLoader().load( self.data.grass );
	grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping; 
	
	var rockyTexture = new THREE.TextureLoader().load( self.data.rock );
	rockyTexture.wrapS = rockyTexture.wrapT = THREE.RepeatWrapping; 
	
	var snowyTexture = new THREE.TextureLoader().load( self.data.snow );
	snowyTexture.wrapS = snowyTexture.wrapT = THREE.RepeatWrapping; 
	
	// use "this." to create global object
	this.customUniforms = {
		bumpTexture:	{ type: "t", value: bumpTexture },
		bumpScale:	    { type: "f", value: bumpScale },
		oceanTexture:	{ type: "t", value: oceanTexture },
		sandyTexture:	{ type: "t", value: sandyTexture },
		grassTexture:	{ type: "t", value: grassTexture },
		rockyTexture:	{ type: "t", value: rockyTexture },
		snowyTexture:	{ type: "t", value: snowyTexture },
	};
    
  const vertexShader = `

uniform sampler2D bumpTexture;
uniform float bumpScale;
varying float vAmount;
varying vec2 vUV;
void main() 
{ 
	vUV = uv;
	vec4 bumpData = texture2D( bumpTexture, uv );
	
	vAmount = bumpData.r; // assuming map is grayscale it doesn't matter if you use r, g, or b.
	
	// move the position along the normal
    vec3 newPosition = position + normal * bumpScale * vAmount;
	
	gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}



`;  
    
    
  const fragmentShader = `

uniform sampler2D oceanTexture;
uniform sampler2D sandyTexture;
uniform sampler2D grassTexture;
uniform sampler2D rockyTexture;
uniform sampler2D snowyTexture;
varying vec2 vUV;
varying float vAmount;
void main() 
{
	vec4 water = (smoothstep(0.01, 0.25, vAmount) - smoothstep(0.24, 0.26, vAmount)) * texture2D( oceanTexture, vUV * 10.0 );
	vec4 sandy = (smoothstep(0.24, 0.27, vAmount) - smoothstep(0.28, 0.31, vAmount)) * texture2D( sandyTexture, vUV * 10.0 );
	vec4 grass = (smoothstep(0.28, 0.32, vAmount) - smoothstep(0.35, 0.40, vAmount)) * texture2D( grassTexture, vUV * 20.0 );
	vec4 rocky = (smoothstep(0.30, 0.50, vAmount) - smoothstep(0.40, 0.70, vAmount)) * texture2D( rockyTexture, vUV * 20.0 );
	vec4 snowy = (smoothstep(0.50, 0.65, vAmount))                                   * texture2D( snowyTexture, vUV * 10.0 );
	gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0) + water + sandy + grass + rocky + snowy; //, 1.0);
}  


`;  
	
	// create custom material from the shader code above
	//   that is within specially labelled script tags
	const customMaterial = new THREE.ShaderMaterial( 
	{
	  uniforms: this.customUniforms,
		vertexShader:   vertexShader,
		fragmentShader: fragmentShader,
		// side: THREE.DoubleSide
	}   );
    
	
  const scene = AFRAME.scenes[0].object3D;  
	const planeGeo = new THREE.PlaneGeometry( 512, 512, 512, 512 );
	let plane = new THREE.Mesh(	planeGeo, customMaterial );
	plane.rotation.x = -Math.PI / 2;
	plane.position.y = 0;
	scene.add( plane );
  if(self.data.addwater){
    const waterGeo = new THREE.PlaneGeometry( 512, 512, 1, 1 );
    let waterTex = new THREE.TextureLoader().load( self.data.water );
    waterTex.wrapS = waterTex.wrapT = THREE.RepeatWrapping; 
    waterTex.repeat.set(5,5);
    const waterMat = new THREE.MeshBasicMaterial( {map: waterTex, transparent:true, opacity:0.40} );
    let water = new THREE.Mesh(	planeGeo, waterMat );
    water.rotation.x = -Math.PI / 2;
    water.position.y = this.data.waterlevel;
    scene.add( water);
  }
	
    
  }
  
  
  
  
});
  
})()