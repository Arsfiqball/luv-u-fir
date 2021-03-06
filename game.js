
var game = new Phaser.Game(480, 320, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

var platforms;
var cursors;
var player;
var cpu;
var text;
var changeText = false;
var turnLeft = false;
var turnRight = false;

function goFullscreen() {
  game.scale.startFullScreen();
}

function preload() {
  game.load.image('sky', 'assets/sky.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.spritesheet('cpu', 'assets/cpu.png', 32, 46);
  game.load.spritesheet('player', 'assets/player.png', 32, 40);
  game.load.spritesheet('buttons', 'assets/buttons.png', 60, 32);
}

function create() {

  // fullscreen keep original size
  game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

  // arcade mode
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // sky
  game.add.sprite(0, 0, 'sky');

  // platform group
  platforms = game.add.group();
  platforms.enableBody = true;

  // ground platform
  var ground = platforms.create(0, game.world.height - 64, 'ground');
  ground.body.immovable = true;

  // cpu
  cpu = game.add.sprite(0, game.world.height-120, 'cpu');
  game.physics.arcade.enable(cpu);
  cpu.body.bounce.y = 0.2;
  cpu.body.gravity.y = 300;
  cpu.body.collideWorldBounds = true;
  cpu.animations.add('left', [0, 1, 2, 3], 10, true);
  cpu.animations.add('right', [5, 6, 7, 8], 10, true);
  cpu.frame = 4;

  // player
  player = game.add.sprite(game.world.width-100, game.world.height/2, 'player');
  game.physics.arcade.enable(player);
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;
  player.animations.add('left', [0, 1], 10, true);
  player.animations.add('right', [2, 3], 10, true);

  // cursors
  cursors = game.input.keyboard.createCursorKeys();

  var leftButton = game.add.sprite(16+32, game.world.height-16-32, 'buttons');
  leftButton.frame = 0;
  leftButton.inputEnabled = true;
  leftButton.events.onInputOver.add(function() { turnLeft = true; });
  leftButton.events.onInputDown.add(function() { turnLeft = true; });
  leftButton.events.onInputOut.add(function() { turnLeft = false; });
  leftButton.events.onInputUp.add(function() { turnLeft = false; });

  var rightButton = game.add.sprite(game.world.width-60-16-32, game.world.height-16-32, 'buttons');
  rightButton.frame = 1;
  rightButton.inputEnabled = true;
  rightButton.events.onInputOver.add(function() { turnRight = true; });
  rightButton.events.onInputDown.add(function() { turnRight = true; });
  rightButton.events.onInputOut.add(function() { turnRight = false; });
  rightButton.events.onInputUp.add(function() { turnRight = false; });


  var style = {
    font: "14pt Arial",
    fill: "#777",
    align: "center",
    boundsAlignH: "center",
    boundsAlignV: "center"
  };

  text = game.add.text(game.world.centerX, game.world.centerY-32, "", style);

  text.anchor.set(0.5);
}

function update() {
  var playerHitPlatform = game.physics.arcade.collide(player, platforms);
  var cpuHitPlatform = game.physics.arcade.collide(cpu, platforms);

  //  Reset velocity (movement)
  player.body.velocity.x = 0;
  cpu.body.velocity.x = 0;

  // player movement
  if (cursors.left.isDown || turnLeft) {
    player.body.velocity.x = -200;
    player.animations.play('left');
  } else if (cursors.right.isDown || turnRight) {
    player.body.velocity.x = 200;
    player.animations.play('right');
  } else {
    player.animations.stop();
    if (player.x > cpu.x) {
      player.frame = 1;
    } else {
      player.frame = 2;
    }
  }

  // cpu movement
  if (player.x > cpu.x + 50) {
    changeText = true;
    cpu.body.velocity.x = 70;
    cpu.animations.play('right');
  } else if (player.x < cpu.x -50) {
    changeText = true;
    cpu.body.velocity.x = -70;
    cpu.animations.play('left');
  } else {
    cpu.animations.stop();
    if (player.x > cpu.x) {
      cpu.frame = 6;
    } else {
      cpu.frame = 2;
    }

    if (changeText) {
      text.setText(Confessions[Math.floor(Math.random()*(Confessions.length-1))]);
      changeText = false;
    }
  }
}
