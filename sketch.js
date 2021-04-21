

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

var trexBirdImage,trexBird,trexBirdGroup

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  trexBirdImage=loadImage("trex bird.png")
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(50,height-100,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.7;
  
  ground = createSprite(200,height-70,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2+100);
  restart.addImage(restartImg);
   restart.scale = 1.5;

  gameOver.scale = 2.5;
 
  
  invisibleGround = createSprite(200,height-70,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle,trexBird and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
trexBirdGroup= createGroup()
  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  
  
  score = 0;
  

}

function draw() {
  
 if(score%300<100){
   background("blue")
 }else if (score%300>100&&score%300<200){
   background("white")
 }else if (score%300>200&&score%300<299){
   background("grey")
 }
  
  //displaying score
  fill("black")
  textSize(50)
  text("Score: "+ score, width/2,height-500);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    console.log(trex.y)
    //jump when the space key is pressed
    if((touches.length>0||keyDown("space"))&&trex.y>height-120) {
        trex.velocityY = -15;
        jumpSound.play();
        touches=[]
        
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
   if(score<10000){
    //spawn obstacles on the ground
    spawnObstacles();
   }
    if(score>=10000){
      spawnBird()
      }
    if(obstaclesGroup.isTouching(trex)||trexBirdGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
      trexBirdGroup.setLifetimeEach(-1);
 
    cloudsGroup.setLifetimeEach(-1);
      trexBirdGroup.setVelocityXEach(0);
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)&&gameState==END) {
      reset();
    }


  drawSprites();
}

function reset(){
  score=0
  cloudsGroup.destroyEach()
  obstaclesGroup.destroyEach()
  gameState=PLAY
  trex.changeAnimation("running",trex_running)
      trexBirdGroup.destroyEach()
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,height-100,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.7;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(100,height-200));
    cloud.addImage(cloudImage);
    cloud.scale = 1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function spawnBird() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
     trexBird = createSprite(600,120,40,10);
    trexBird.y = Math.round(random(height-100));
    trexBird.addImage(trexBirdImage);
    trexBird.scale = 0.25;
   trexBird.velocityX = -(6 + score/1000);
    
     //assign lifetime to the variable
    trexBird.lifetime = 200;
    
    //adjust the depth
    trexBird.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    trexBirdGroup.add(trexBird);
  }
}

