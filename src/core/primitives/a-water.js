export default(()=>{
  
  
  //By Ada Rose Cannon
AFRAME.registerComponent('wobble-normal', {
	schema: {},
  init: function(){
    this.el.setAttribute('rotation','-90 0 0');
  },
	tick: function (t) {
		if (!this.el.components.material.material.normalMap) return;
		this.el.components.material.material.normalMap.offset.x += 0.0001 * Math.sin(t/5000);
		this.el.components.material.material.normalMap.offset.y += 0.0001 * Math.cos(t/4000);
		this.el.components.material.material.normalScale.x = 0.5 + 0.5 * Math.cos(t/500);
		this.el.components.material.material.normalScale.x = 0.5 + 0.5 * Math.sin(t/600);
	}
})
//By Ada Rose Cannon
AFRAME.registerPrimitive('a-water', {
	defaultComponents: {
		geometry: {
			primitive: 'plane',
			height: 1000,
			width: 1000
		},
		rotation: '0 0 0',
		material: {
			shader: 'standard',
			color: '#8ab39f',
			metalness: 1,
			roughness: 0.2,
			normalMap: 'url(https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/waternormals.jpg)',
			normalTextureRepeat: '50 50',
			normalTextureOffset: '0 0',
			normalScale: '0.5 0.5',
			opacity: 0.8
		},
		'wobble-normal': {}
	},
});


  
})()


