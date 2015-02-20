var beadPoints = [ 0, -300, -200, -100,  50 ];
var axePoints  = [ 0,  300,  200,  100, -50 ];
var currentRound = 0;
var numTeams = 0;

function updateScores() {
    var numAxes = [ 0, 0 ];
    var numBeads = [ 0, 0 ];
    for (var i=0; i<8; ++i) {
        var index = Math.floor(i/4);
        var name = teams[i].name;
        if (teams[i].votes[currentRound] == 'beads') {
            numBeads[index]++;
        }
        else if (teams[i].votes[currentRound] == 'axe') {
            numAxes[index]++;
        }
    }
    var numVotes = [ (numAxes[0] + numBeads[0]), (numAxes[1] + numBeads[1]) ];
    for (var i=0; i<2; ++i) {
        if (numVotes[i] != 4) {
            console.log("Number of votes in Group " + i + ": " + numVotes[i]);
            alert("Not all votes have been recorded.");
            return;
        }
    }
    for (var i=0; i<8; ++i) {
        var index = Math.floor(i/4);
        var name = teams[i].name;
        var points = ( teams[i].votes[currentRound] == 'beads' ?
                       beadPoints[numBeads[index]] :
                       axePoints[numAxes[index]] );
        updateTeamScore(teams[i], points);
        console.log("Team " + teams[i].name + " gets " + points + " points.");
        teams[i].imgAxe.style.backgroundColor = 'rgba(0,127,127,0.0)';
        teams[i].imgBeads.style.backgroundColor = 'rgba(0,127,127,0.0)';
    }
    currentRound++;
}

function updateTeamScore(team, score) {
    team.score += score;
    team.divScore.textContent = String(team.score);
}

function Team(name) {
    this.teamNumber = numTeams++;
    this.name = name;
    this.score = 0;
    this.votes = [];
 
    this.div = document.createElement('div');
    
    this.divTeam = document.createElement('div');
    this.divTeam.className = 'team';
    //this.divTeam.style.backgroundColor = 'rgba(0,127,127,0.5)';
 
 		this.divName = document.createElement( 'div' );
		this.divName.className = 'name';
		this.divName.textContent = name;

    this.divScore = document.createElement( 'div' );
    this.divScore.className = 'score';
		this.divScore.textContent = this.score;
    this.divScore.addEventListener( 'click', function( event ) {
        
    }, false);

		this.divTeam.appendChild( this.divName );
    this.divTeam.appendChild( this.divScore );

    this.divBallot = document.createElement('div');
    this.divBallot.className = 'ballot';

    this.imgAxe = document.createElement( 'img' );
    this.imgAxe.className = 'axe';
    this.imgAxe.src = 'images/axe_and_log.gif';
    this.imgAxe.id = 'axe_' + String(this.teamNumber);
    this.imgAxe.addEventListener( 'click', function( event ) {
        var index = this.id.split('_')[1];
        teams[index].votes[currentRound] = 'axe';
        console.log("Team: " + teams[index].name +
                    " votes " + teams[index].votes[currentRound]);
        teams[index].imgAxe.style.backgroundColor = 'rgba(0,127,127,0.75)';
        teams[index].imgBeads.style.backgroundColor = 'rgba(0,127,127,0.0)';
    }, false );

    this.imgBeads = document.createElement( 'img' );
    this.imgBeads.className = 'beads';
    this.imgBeads.src = 'images/beads.gif';
    this.imgBeads.id = 'beads_' + String(this.teamNumber);
    this.imgBeads.addEventListener( 'click', function( event ) {
        var index = this.id.split('_')[1];
        teams[index].votes[currentRound] = 'beads';
        console.log("Team: " + teams[index].name +
                    " votes " + teams[index].votes[currentRound]);
        teams[index].imgAxe.style.backgroundColor = 'rgba(0,127,127,0.0)';
        teams[index].imgBeads.style.backgroundColor = 'rgba(0,127,127,0.75)';
    }, false );

    this.divBallot.appendChild( this.imgAxe );
    this.divBallot.appendChild( this.imgBeads );
    this.divBallot.style.visibility = 'visible';

    // Add team info and team ballot to the main widget
    this.div.appendChild( this.divTeam );
    this.div.appendChild( this.divBallot );
}

var teamNames = [
    "Hydrogen", "Helium", "Lithium", "Beryllium",
    "Boron", "Carbon", "Nitrogen", "Oxygen"
];

var camera, scene, renderer;
var controls;

var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };
var teams = [];

function init() {
    var aspect = window.innerWidth / window.innerHeight;
		camera = new THREE.PerspectiveCamera( 40, aspect, 1, 10000 );
		camera.position.z = 2000;

		scene = new THREE.Scene();

		// table

		for ( var i=0; i<teamNames.length; ++i ) {

				var team = new Team(teamNames[i]);
        teams.push(team);

				var object = new THREE.CSS3DObject( team.div );
				object.position.x = Math.random() * 4000 - 2000;
				object.position.y = Math.random() * 4000 - 2000;
				object.position.z = Math.random() * 4000 - 2000;
				scene.add( object );

				objects.push( object );

				//
        var x = Math.floor(i/4);
        var y = i%4;
				var object = new THREE.Object3D();

				object.position.x = ( x*1000 ) - 500;
				object.position.y = - ( y*180 ) + 400;

				targets.table.push( object );

		}

		// sphere

		var vector = new THREE.Vector3();

		for ( var i = 0, l = objects.length; i < l; i ++ ) {

				var phi = Math.acos( -1 + ( 2 * i ) / l );
				var theta = Math.sqrt( l * Math.PI ) * phi;

				var object = new THREE.Object3D();

				object.position.x = 500 * Math.cos( theta ) * Math.sin( phi );
				object.position.y = 500 * Math.sin( theta ) * Math.sin( phi );
				object.position.z = 500 * Math.cos( phi );

				vector.copy( object.position ).multiplyScalar( 2 );

				object.lookAt( vector );

				targets.sphere.push( object );

		}

		// helix

		var vector = new THREE.Vector3();

		for ( var i = 0, l = objects.length; i < l; i ++ ) {

				var phi = i * 0.25 * Math.PI;

				var object = new THREE.Object3D();

				object.position.x = 800 * Math.sin( phi );
				// object.position.y = - ( i * 8 ) + 450;
				object.position.y = 250;
				object.position.z = 800 * Math.cos( phi );

				vector.x = object.position.x * 2;
				vector.y = object.position.y;
				vector.z = object.position.z * 2;

				object.lookAt( vector );

				targets.helix.push( object );

		}

		// grid

		for ( var i = 0; i < objects.length; i ++ ) {

				var object = new THREE.Object3D();

				object.position.x = ( ( i % 2 ) * 670 ) - 670;
				object.position.y = ( - ( Math.floor( i / 2 ) % 2 ) * 400 ) + 400;
				object.position.z = ( Math.floor( i / 4 ) ) * 1000 - 2000;

				targets.grid.push( object );

		}

		//

		renderer = new THREE.CSS3DRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.domElement.style.position = 'absolute';
		document.getElementById( 'container' ).appendChild( renderer.domElement );

		//

		//controls = new THREE.TrackballControls( camera, renderer.domElement );
		//controls.rotateSpeed = 0.5;
		//controls.minDistance = 500;
		//controls.maxDistance = 6000;
		//controls.addEventListener( 'change', render );

		var button = document.getElementById( 'table' );
		button.addEventListener( 'click', function ( event ) {

				transform( targets.table, 2000 );

		}, false );

		var button = document.getElementById( 'sphere' );
		button.addEventListener( 'click', function ( event ) {

				transform( targets.sphere, 2000 );

		}, false );

		var button = document.getElementById( 'helix' );
		button.addEventListener( 'click', function ( event ) {

				transform( targets.helix, 2000 );

		}, false );

		var button = document.getElementById( 'grid' );
		button.addEventListener( 'click', function ( event ) {

				transform( targets.grid, 2000 );

		}, false );

		var buttonTally = document.getElementById( 'tally' );
		buttonTally.addEventListener( 'click', function ( event ) {
        console.log("Tallying scores.");
        updateScores();
		}, false );

		transform( targets.table, 2000 );

		//

		window.addEventListener( 'resize', onWindowResize, false );

}

function transform( targets, duration ) {

		TWEEN.removeAll();

		for ( var i = 0; i < objects.length; i ++ ) {

				var object = objects[ i ];
				var target = targets[ i ];

				new TWEEN.Tween( object.position )
						.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
						.easing( TWEEN.Easing.Exponential.InOut )
						.start();

				new TWEEN.Tween( object.rotation )
						.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
						.easing( TWEEN.Easing.Exponential.InOut )
						.start();

		}

		new TWEEN.Tween( this )
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

		//controls.update();

}

function render() {

		renderer.render( scene, camera );

}

