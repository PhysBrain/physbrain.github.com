var beadPoints = [ 0, -300, -200, -100,  50 ];
var axePoints  = [ 0,  300,  200,  100, -50 ];
var currentRound = 0;
var numTeams = 0;

var groupScore = [ 0, 0 ];
var objects = { title: [], teams: [] };
var targets = { rank: [], sphere: [], helix: [], grid: [], random: [],
                wayc: [], yacw: [] };

function initTitle() {
    var words = [ 'Win', 'All', 'You', 'Can' ];
    var idx1 = [ 0, 1, 2, 3 ];
    var idx2 = [ 3, 1, 0, 2 ];
    for (var i=0; i<4; ++i) {
        var word = document.createElement('span');
        word.className = 'title';
        word.textContent = words[i];
        var object = new THREE.CSS3DObject(word);
        object.position.x = Math.random()*4000 - 2000;
        object.position.y = Math.random()*4000 - 2000;
        object.position.z = Math.random()*4000 - 2000;
        scene.add(object);
        objects.title.push(object);

        var obj1 = new THREE.Object3D();
        obj1.position.x = idx1[i]*220 - 400;
        obj1.position.y = 800;
        obj1.position.z = 1000;
        targets.wayc.push(obj1);

        var obj2 = new THREE.Object3D();
        obj2.position.x = idx2[i]*220 - 400;
        obj2.position.y = 800;
        obj2.position.z = 1000;
        targets.yacw.push(obj2);
    }
}

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
    for (var i=0; i<2; ++i) {
        var numVotes = numAxes[i] + numBeads[i];
        if (numVotes != 4) {
            alert("Only " + numVotes + " have been cast in Group " + i);
            return;
        }
        groupScore[i] += (numBeads[i] == 4 ? 200 : numAxes[i] == 4 ? -200 : 0);
    }
    for (var i=0; i<8; ++i) {
        var name = teams[i].name;
        var group = teams[i].group;
        var points = ( teams[i].votes[currentRound] == 'beads' ?
                       beadPoints[numBeads[group]] :
                       axePoints[numAxes[group]] );
        updateTeamScore(i, group, points);
        console.log("Team " + teams[i].name + " gets " + points + " points.");
    }
    currentRound++;

    // Refresh the display to reflect the rankings
		transform( objects.teams, targets.rank, 2000 );
}

function updateTeamScore(team, group, points) {
    // Update the team's score
    teams[team].score += points;
    teams[team].divScore.textContent = String(teams[team].score);

    // Modify the position of the widget in rank view
    targets.rank[team].position.y = teams[team].score;
    targets.rank[team].position.z = groupScore[group];

    // Modify the position of the widget in grid view
    targets.grid[team].position.z = groupScore[group];

    // Clear the background highlight for the selected item
    teams[team].imgAxe.style.backgroundColor = 'rgba(0,127,127,0.0)';
    teams[team].imgBeads.style.backgroundColor = 'rgba(0,127,127,0.0)';

    // Add an icon to the team history widget
    var img = document.createElement('img');
    img.className = 'icon';
    img.src = ( teams[team].votes[currentRound] == 'axe' ?
                'images/axe_and_log.gif' : 'images/beads3.gif' );
    img.style.left = currentRound*40 - 240;
    teams[team].divHistory.appendChild( img );

}

function Team(name) {
    this.group = (numTeams < 4 ? 0 : 1);
    this.number = numTeams++;
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
    this.imgAxe.id = 'axe_' + String(this.number);
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
    this.imgBeads.id = 'beads_' + String(this.number);
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

    this.divHistory = document.createElement('div');
    this.divHistory.className = 'history';

    // Add team info and team ballot to the main widget
    this.div.appendChild( this.divTeam );
    this.div.appendChild( this.divBallot );
    this.div.appendChild( this.divHistory );

    this.object = new THREE.CSS3DObject( this.div );
		this.object.position.x = Math.random() * 4000 - 2000;
		this.object.position.y = Math.random() * 4000 - 2000;
		this.object.position.z = Math.random() * 4000 - 2000;

}

var teamNames = [
    "Hydrogen", "Helium", "Lithium", "Beryllium",
    "Boron", "Carbon", "Nitrogen", "Oxygen"
];

var camera, scene, renderer;
var controls;

var teams = [];

function init() {
    var aspect = window.innerWidth / window.innerHeight;
		camera = new THREE.PerspectiveCamera( 40, aspect, 1, 10000 );
		camera.position.z = 4000;

		scene = new THREE.Scene();

    initTitle();
    transform( objects.title, targets.wayc, 1000 );
    //transform( objects.title, targets.yacw, 1000 );

    // init teams

		for ( var i=0; i<teamNames.length; ++i ) {

				var team = new Team(teamNames[i]);
        teams.push(team);
		    scene.add( team.object );
		    objects.teams.push( team.object );

				var object = new THREE.Object3D();
        object.position.x = ( team.number*500 ) - 1875 + team.group*250;
        object.position.y = team.score*100 + 200;
        targets.rank.push(object);
    }

		// random

		for ( var i=0; i<objects.teams.length; ++i ) {

				var object = new THREE.Object3D();

				object.position.x = Math.random() * 4000 - 2000;
				object.position.y = Math.random() * 4000 - 2000;
				object.position.z = Math.random() * 4000 - 2000;

        targets.random.push( object );

		}

		// sphere

		var vector = new THREE.Vector3();

		for ( var i = 0, l = objects.teams.length; i < l; i ++ ) {

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

		for ( var i = 0, l = objects.teams.length; i < l; i ++ ) {

				var phi = i * 0.5 * Math.PI + teams[i].group * 0.25 * Math.PI;

				var object = new THREE.Object3D();

				object.position.x = 500 * Math.sin( phi );
				object.position.y = 250 + teams[i].group*400;
				object.position.z = 500 * Math.cos( phi );

				vector.x = object.position.x * 2;
				vector.y = object.position.y;
				vector.z = object.position.z * 2;

				object.lookAt( vector );

				targets.helix.push( object );

		}

		// grid

		for ( var i = 0; i < objects.teams.length; i ++ ) {

				var object = new THREE.Object3D();

				object.position.x = ( ( i % 2 ) * 500 ) + teams[i].group * 1500 - 1000 ;
				object.position.y = ( - ( Math.floor( i / 2 ) % 2 ) * 400 ) + 200;
				//object.position.z = ( Math.floor( i / 4 ) ) * 1000 - 2000;
				object.position.z = groupScore[teams[i].group]

				targets.grid.push( object );

		}

		//

		renderer = new THREE.CSS3DRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.domElement.style.position = 'absolute';
		document.getElementById( 'container' ).appendChild( renderer.domElement );

		//

		controls = new THREE.TrackballControls( camera, renderer.domElement );
		controls.rotateSpeed = 0.0;
		controls.minDistance = 500;
		controls.maxDistance = 6000;
		controls.addEventListener( 'change', render );

		var button = document.getElementById( 'rank' );
		button.addEventListener( 'click', function ( event ) {

				transform( objects.teams, targets.rank, 2000 );

		}, false );

		var button = document.getElementById( 'sphere' );
		button.addEventListener( 'click', function ( event ) {

				transform( objects.teams, targets.sphere, 2000 );

		}, false );

		var button = document.getElementById( 'helix' );
		button.addEventListener( 'click', function ( event ) {

				transform( objects.teams, targets.helix, 2000 );

		}, false );

		var button = document.getElementById( 'grid' );
		button.addEventListener( 'click', function ( event ) {

				transform( objects.teams, targets.grid, 2000 );

		}, false );

		var button = document.getElementById( 'random' );
		button.addEventListener( 'click', function ( event ) {

				transform( objects.teams, targets.random, 2000 );

		}, false );

		var buttonTally = document.getElementById( 'tally' );
		buttonTally.addEventListener( 'click', function ( event ) {
        console.log("Tallying scores.");
        updateScores();
		}, false );

		transform( objects.teams, targets.rank, 2000 );

		//

		window.addEventListener( 'resize', onWindowResize, false );

}

function transform( sources, targets, duration ) {

    TWEEN.removeAll();

		for ( var i = 0; i < sources.length; i ++ ) {

				var object = sources[ i ];
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

		controls.update();

}

function render() {

		renderer.render( scene, camera );

}

