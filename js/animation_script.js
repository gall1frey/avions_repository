class Scene
{
	constructor(model)
	{
		this.views = [
			{ bottom: 0, height: 1 },
			{ bottom: 0, height: 0 }
		];

		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true
		});

		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.setPixelRatio(window.devicePixelRatio);

		document.body.appendChild( this.renderer.domElement );

		// scene

		this.scene = new THREE.Scene();

		for ( var ii = 0; ii < this.views.length; ++ ii ) {

			var view = this.views[ ii ];
			var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
			camera.position.fromArray([0, 0, 180] );
			camera.layers.disableAll();
			camera.layers.enable( ii );
			view.camera = camera;
			camera.lookAt(new THREE.Vector3(0, 5, 0));
		}

		//light

		this.light = new THREE.PointLight( 0xffffff, 0.75 );
		this.light.position.z = 150;
		this.light.position.x = 70;
		this.light.position.y = -20;
		this.scene.add( this.light );

		this.softLight = new THREE.AmbientLight( 0xffffff, 1.5 );
		this.scene.add(this.softLight)

		// group

		this.onResize();
		window.addEventListener( 'resize', this.onResize, false );

		var edges = new THREE.EdgesGeometry( model.children[ 0 ].geometry );
		let line = new THREE.LineSegments( edges );
		line.material.depthTest = false;
		line.material.opacity = 0.5;
		line.material.transparent = true;
		line.position.x = 0.5;
		line.position.z = -1;
		line.position.y = 0.2;

    this.modelGroup = new THREE.Group();

		model.layers.set( 0 );
		line.layers.set( 1 );

		this.modelGroup.add(model);
		this.modelGroup.add(line);
    this.scene.scale.set(0.05, 0.05, 0.05);
		this.scene.add(this.modelGroup);
	}

	render = () =>
	{
		for ( var ii = 0; ii < this.views.length; ++ ii ) {

			var view = this.views[ ii ];
			var camera = view.camera;

			var bottom = Math.floor( this.h * view.bottom );
			var height = Math.floor( this.h * view.height );

			this.renderer.setViewport( 0, 0, this.w, this.h );
			this.renderer.setScissor( 0, bottom, this.w, height );
			this.renderer.setScissorTest( true );

			camera.aspect = this.w / this.h;
			this.renderer.render( this.scene, camera );
		}
	}

	onResize = () =>
	{
		this.w = window.innerWidth;
		this.h = window.innerHeight;

		for ( var ii = 0; ii < this.views.length; ++ ii ) {
			var view = this.views[ ii ];
			var camera = view.camera;
			camera.aspect = this.w / this.h;
			let camZ = (screen.width - (this.w * 1)) / 3;
			camera.position.z = camZ < 180 ? 180 : camZ;
			camera.updateProjectionMatrix();
		}

		this.renderer.setSize( this.w, this.h );
		this.render();
	}
}

function loadModel()
{
	gsap.registerPlugin(ScrollTrigger);


	var object;

	function onModelLoaded() {
		object.traverse( function ( child ) {
			let mat = new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0xD0CBC7, shininess: 5, flatShading: true, wireframe: true, opacity: 0.3 } );
			child.material = mat;
		});

		setupAnimation(object);
	}

	var manager = new THREE.LoadingManager( onModelLoaded );
	manager.onProgress = ( item, loaded, total ) => console.log( item, loaded, total );

	var loader = new THREE.OBJLoader( manager );
	loader.load( 'gs://avions-test.appspot.com/Airplane.obj', function ( obj ) { object = obj; });
}

function setupAnimation(model)
{
	let scene = new Scene(model);
	let plane = scene.modelGroup;

	gsap.set("#home", { scale: 1 });
	gsap.timeline()
	    .from("#home", { duration: 3, opacity: 0, delay: 0.2 })

	gsap.fromTo('canvas',{x: "50%", autoAlpha: 0},  {duration: 1, x: "0%", autoAlpha: 1});
	gsap.to('.loading', {autoAlpha: 0})
	gsap.to('.scroll-cta', {opacity: 1})

	let tau = Math.PI * 2;

	gsap.set(plane.rotation, {y: tau * -.25});
	gsap.set(plane.position, {x: 1600, y: 1000, z: -60});

	scene.render();

	var sectionDuration = 1;
	gsap.fromTo(scene.views[1],
		{ 	height: 1, bottom: 0 },
		{
			height: 0, bottom: 1,
			ease: 'none',
			scrollTrigger: {
			  trigger: ".blue",
			  scrub: true,
			  start: "bottom bottom",
			  end: "bottom top"
			}
		})

	gsap.fromTo(scene.views[1],
		{ 	height: 0, bottom: 0 },
		{
			height: 1, bottom: 0,
			ease: 'none',
			scrollTrigger: {
			  trigger: ".blue",
			  scrub: true,
			  start: "top bottom",
			  end: "top top"
			}
		})

  let tl = new gsap.timeline(
  {
    onUpdate: scene.render,
    scrollTrigger: {
      trigger: ".content",
      scrub: true,
      start: "top top",
      end: "bottom bottom"
    },
    defaults: {duration: sectionDuration, ease: 'power2.inOut'}
  });

  let delay = 0;

  tl.to('.scroll-cta', {duration: 0.25, opacity: 0}, delay)
  //tl.to(plane.position, {x: -10, ease: 'power1.in'}, delay)

  //delay += sectionDuration;

	tl.to(plane.rotation, {x: tau * .25, y: 0, z: -tau * 0.1, ease: 'power1.inOut'}, delay)
	tl.to(plane.position, {x: -1800, y: 0, z: -60, ease: 'power1.inOut'}, delay)

	delay += sectionDuration;
	delay += sectionDuration;
	delay += sectionDuration;

	tl.to(plane.rotation, {x: tau * 0.2, y: 0, z: -tau * 0.07, ease: 'power3.inOut'}, delay)
	tl.to(plane.position, {x: 1800, y: 0, z: -30, ease: 'power2.inOut'}, delay)

	delay += sectionDuration/2;

	tl.to(plane.rotation, { x: tau * 0.1, y: -tau * 0.1, z: tau * 0.1}, delay)
	tl.to(plane.position, { x: 1800, y: 0, z: -30}, delay)

	delay += sectionDuration;
	delay += sectionDuration;

	tl.to(plane.rotation, {x: tau * 0.1, y: -tau *.05, z: tau * 0.1, ease:'power4.inOut'}, delay)
	tl.to(plane.position, {z: 30, x: -1800 , ease:'power4.inOut'}, delay)

	delay += sectionDuration;

	tl.to(plane.rotation, {x: tau * 0.1, y: tau *.1, z: -tau * 0.1, ease:'power4.inOut'}, delay)
	tl.to(plane.position, {z: 60, x: -1800, ease:'power4.inOut'}, delay)

	delay += sectionDuration;

	tl.to(plane.rotation, {x: tau * 0.1, y: tau *.1, z: -tau * 0.2, ease:'power4.inOut'}, delay)
	tl.to(plane.position, {z: 100, x: 1200, y: 0, ease:'power4.inOut'}, delay)

	delay += sectionDuration;

	tl.to(plane.rotation, {x: tau * 0.1, y: tau *.1, z: tau * 0.1, ease: 'power1.in'}, delay)
	tl.to(plane.position, {z: -150, x: 1800, y: 0, ease: 'power1.inOut'}, delay)

	delay += sectionDuration;

	tl.to(plane.rotation, {duration: sectionDuration, x: -tau * 0.05, y: tau, z: -tau * 0.1, ease: 'none'}, delay)
	tl.to(plane.position, {duration: sectionDuration, x: 0, y: 30, z: 2500, ease: 'power1.in'}, delay)

	tl.to(scene.light.position, {duration: sectionDuration, x: 0, y: 0, z: 0}, delay)
}

loadModel();
