var tileNames = [
    "BEST", "Math", "Physics", "Modeling",
    "Gravity", "Friction"
];

var container;
var currentTile = 0;
var numTiles = 0;

var tiles = [];
var objects = { title: [], tiles: [] };
var targets = { rank: [], sphere: [], helix: [], grid: [], random: [],
                pres: [] };
var updateTween = new TWEEN.Tween( this );

function makeTileCurrent(index) {
    for (var i=0; i<targets.rank.length; ++i) {
        targets.pres[i] = targets.rank[i];
    }
    targets.pres[index] = new THREE.Object3D();
    targets.pres[index].position.set(0, 0, 5100);
    //tiles[currentTile].div.style.backgroundColor = 'rgba(0,127,127,0.0';
    //tiles[index].div.style.backgroundColor = 'rgba(0,127,127,0.75';
    currentTile = index;
		transform( objects.tiles, targets.pres, 1000 );
}

function Tile(name) {
    this.group = Math.floor(numTiles/4);
    this.number = numTiles++;
    this.name = name;

    this.div = document.createElement('div');
    this.div.id = "Tile_" + String(this.number);
    this.div.addEventListener( 'click', function( event ) {
        var index = Number(this.id.split('_')[1]);
        makeTileCurrent(index);
    }, false );

    this.divTile = document.createElement('div');
    this.divTile.className = 'tile';
 
 		this.divName = document.createElement( 'div' );
		this.divName.className = 'name';
		this.divName.innerHTML = name;
    this.divName.style.width = 300;

    this.divScore = document.createElement( 'div' );
    this.divScore.className = 'score';
		this.divScore.textContent = this.score;
    this.divScore.addEventListener( 'click', function( event ) {
        
    }, false);

		this.divTile.appendChild( this.divName );
    this.divTile.appendChild( this.divScore );

    // this.divBallot = document.createElement('div');
    // this.divBallot.className = 'ballot';

    // this.imgAxe = document.createElement( 'img' );
    // this.imgAxe.className = 'axe';
    // this.imgAxe.src = 'images/axe_and_log.gif';
    // this.imgAxe.id = 'axe_' + String(this.number);
    // this.imgAxe.addEventListener( 'click', function( event ) {
    //     var index = this.id.split('_')[1];
    //     tiles[index].imgAxe.style.backgroundColor = 'rgba(0,127,127,0.75)';
    //     tiles[index].imgBeads.style.backgroundColor = 'rgba(0,127,127,0.0)';
    // }, false );

    // this.imgBeads = document.createElement( 'img' );
    // this.imgBeads.className = 'beads';
    // this.imgBeads.src = 'images/beads.gif';
    // this.imgBeads.id = 'beads_' + String(this.number);
    // this.imgBeads.addEventListener( 'click', function( event ) {
    //     var index = this.id.split('_')[1];
    //     tiles[index].imgAxe.style.backgroundColor = 'rgba(0,127,127,0.0)';
    //     tiles[index].imgBeads.style.backgroundColor = 'rgba(0,127,127,0.75)';
    // }, false );

    // this.divBallot.appendChild( this.imgAxe );
    // this.divBallot.appendChild( this.imgBeads );
    // this.divBallot.style.visibility = 'visible';

    // Add tile info and tile ballot to the main widget
    this.div.appendChild( this.divTile );
    // this.div.appendChild( this.divBallot );

    this.object = new THREE.CSS3DObject( this.div );
		this.object.position.x = Math.random() * 4000 - 2000;
		this.object.position.y = Math.random() * 4000 - 2000;
		this.object.position.z = Math.random() * 4000 - 2000;
    this.object.position.tween = new TWEEN.Tween( this.object.position );

    this.object.rotation.x = 0;
    this.object.rotation.y = 0;
    this.object.rotation.z = 0;
		this.object.rotation.tween = new TWEEN.Tween( this.object.rotation );

}

var camera, scene, renderer;
var controls;


function init() {
    var aspect = window.innerWidth / window.innerHeight;
		camera = new THREE.PerspectiveCamera( 40, aspect, 1, 10000 );
		camera.position.z = 6000;

		scene = new THREE.Scene();

    // initTitle("BEST 2015");

    // init tiles

		for ( var i=0; i<tileNames.length; ++i ) {

				var tile = new Tile(tileNames[i]);
        tiles.push(tile);
		    scene.add( tile.object );
		    objects.tiles.push( tile.object );

				var object = new THREE.Object3D();
        object.position.x = tile.group*5200 - 2600;
        object.position.y = 1000 - (tile.number%4)*500;
        targets.rank.push(object);
    }

		// random

		for ( var i=0; i<objects.tiles.length; ++i ) {

				var object = new THREE.Object3D();

				object.position.x = Math.random() * 4000 - 2000;
				object.position.y = Math.random() * 4000 - 2000;
				object.position.z = Math.random() * 4000 - 2000;

        targets.random.push( object );

		}

		// sphere

		var vector = new THREE.Vector3();

		for ( var i = 0, l = objects.tiles.length; i < l; i ++ ) {

				var phi = Math.acos( -1 + ( 2 * i ) / l );
				var theta = Math.sqrt( l * Math.PI ) * phi;

				var object = new THREE.Object3D();

				object.position.x = 600 * Math.cos( theta ) * Math.sin( phi );
				object.position.y = 600 * Math.sin( theta ) * Math.sin( phi );
				object.position.z = 600 * Math.cos( phi );

				vector.copy( object.position ).multiplyScalar( 2 );

				object.lookAt( vector );

				targets.sphere.push( object );

		}

		// helix

		var vector = new THREE.Vector3();

		for ( var i = 0, l = objects.tiles.length; i < l; i ++ ) {

				var phi = i * 0.5 * Math.PI + tiles[i].group * 0.25 * Math.PI;

				var object = new THREE.Object3D();

				object.position.x = 600 * Math.sin( phi );
				object.position.y = 500 + tiles[i].group*400;
				object.position.z = 600 * Math.cos( phi );

				vector.x = object.position.x * 2;
				vector.y = object.position.y;
				vector.z = object.position.z * 2;

				object.lookAt( vector );

				targets.helix.push( object );

		}

		// grid

		for ( var i = 0; i < objects.tiles.length; i ++ ) {

				var object = new THREE.Object3D();

				object.position.x = ( ( i % 2 ) * 660 ) + tiles[i].group * 1500 - 1320 ;
				object.position.y = ( - ( Math.floor( i / 2 ) % 2 ) * 500 ) + 250;
				//object.position.z = ( Math.floor( i / 4 ) ) * 1000 - 2000;
				object.position.z = 0;

				targets.grid.push( object );

		}

		//

		renderer = new THREE.CSS3DRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.domElement.style.position = 'absolute';
		container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );

		//

		controls = new THREE.TrackballControls( camera, renderer.domElement );
		controls.rotateSpeed = 0.0;
		controls.minDistance = 500;
		controls.maxDistance = 6000;
		controls.addEventListener( 'change', render );

		var button = document.getElementById( 'rank' );
		button.addEventListener( 'click', function ( event ) {

				transform( objects.tiles, targets.rank, 2000 );

		}, false );

		var button = document.getElementById( 'sphere' );
		button.addEventListener( 'click', function ( event ) {

				transform( objects.tiles, targets.sphere, 2000 );

		}, false );

		var button = document.getElementById( 'helix' );
		button.addEventListener( 'click', function ( event ) {

				transform( objects.tiles, targets.helix, 2000 );

		}, false );

		var button = document.getElementById( 'grid' );
		button.addEventListener( 'click', function ( event ) {

				transform( objects.tiles, targets.grid, 2000 );

		}, false );

		var button = document.getElementById( 'random' );
		button.addEventListener( 'click', function ( event ) {

        for (var i=0; i<targets.random.length; ++i) {
				    targets.random[i].position.x = Math.random() * 2000 - 1000;
				    targets.random[i].position.y = Math.random() * 2000 - 1000;
				    targets.random[i].position.z = Math.random() * 2000 - 1000;
        }
				transform( objects.tiles, targets.random, 2000 );

		}, false );

		var buttonTally = document.getElementById( 'tally' );
		buttonTally.addEventListener( 'click', function ( event ) {

        console.log("Tallying scores.");
        updateScores();

		}, false );

    var buttonTitle = document.getElementById( 'splash' );
    buttonTitle.addEventListener( 'click', function( event ) {
        var elemTitle = document.querySelectorAll('.title')[0];
        if (!elemTitle) {
            elemTitle = document.createElement('div');
            elemTitle.className = 'title';
            container.appendChild(elemTitle);
        }
        elemTitle.style.visibility = !(elemTitle.style.visibility);
    }, false );

    var buttonBack = document.getElementById('back');
    buttonBack.addEventListener('click', function(event) {
        console.log(currentTile);
        if (currentTile > 0) {
            makeTileCurrent(currentTile-1);
        }
        // var elemBanner = document.querySelectorAll('.banner')[0];
        // if (!elemBanner) {
        //     elemBanner = document.createElement('div');
        //     elemBanner.className = 'banner';
        //     container.appendChild(elemBanner);
        // }
        // elemBanner.innerHTML = ('<span id="round">' +
        //                         tileNames[currentTile] + '</span>');
        // elemBanner.style.visibility = (currentTile > 0);

        render();
    }, false);

    var buttonForward = document.getElementById('forward');
    buttonForward.addEventListener('click', function(event) {
        console.log(currentTile);
        if (currentTile < numTiles-1) {
            makeTileCurrent(currentTile+1);
        }
        // var elemBanner = document.querySelectorAll('.banner')[0];
        // if (!elemBanner) {
        //     elemBanner = document.createElement('div');
        //     elemBanner.className = 'banner';
        //     container.appendChild(elemBanner);
        // }
        // elemBanner.innerHTML = ('<span id="round">' +
        //                         tileNames[currentTile] + '</span>');
        // elemBanner.style.visibility = (currentTile > 0);
        
        render();
    }, false);

		transform( objects.tiles, targets.rank, 2000 );

		//

		window.addEventListener( 'resize', onWindowResize, false );
    
}

function transform( sources, targets, duration ) {

		for (var i=0; i<sources.length; ++i) {
				var object = sources[i];
				var target = targets[i];

        object.position.tween.stop()
            .to( { x: target.position.x,
                   y: target.position.y,
                   z: target.position.z },
                 Math.random() * duration + duration )
						.easing( TWEEN.Easing.Exponential.InOut )
						.start();
        
        object.rotation.tween.stop()
						.to( { x: target.rotation.x,
                   y: target.rotation.y,
                   z: target.rotation.z },
                 Math.random() * duration + duration )
						.easing( TWEEN.Easing.Exponential.InOut )
						.start();
		}

		updateTween.stop()
				.to( {}, duration * 2 )
				.onUpdate( render )
				.start();

}

function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

		render();

}

function animate() {

		requestAnimationFrame( animate );

		TWEEN.update();

		controls.update();

}

function render() {

		renderer.render( scene, camera );

}

