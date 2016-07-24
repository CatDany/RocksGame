const FALLING_SIZE=20;const FALLING_PIXELS_PER_TICK_MIN=1;const FALLING_PIXELS_PER_TICK_MAX=4;const FALLING_SPAWN_COOLDOWN_TICKS=35;const PLAYER_WIDTH=120;const PLAYER_HEIGHT=8;const PLAYER_MOVEMENT_PER_TICK=3;const SPECIAL_CHANCE=.2;const SCORE_NORMAL=1;const SCORE_SPECIAL=4;const CREDITS_PER_SCORE=1/5;const STARTING_LIVES=5;const FALLING_COLOR="#a0a0a0";const FALLING_COLOR_SPECIAL="#9ba0ff";const PLAYER_COLOR="#000000";const TICK_PER_SECOND=60;const CANVAS_WIDTH=400;const CANVAS_HEIGHT=400;const FONT_GAME_OVER="bold 35px Book Antiqua";const FONT_GAME_OVER_SCREEN="18px Book Antiqua";const GAME_OVER_SCREEN_DELAY=3e3;const SCREEN_FLASH_FADE_OUT=600;const SHOP_LIST={extraLife1:{func:function(){updateELNG(extraLivesNextGame+1);updateLives(extraLivesNextGame)},cost:10,name:"One Extra Life in the Next Game"},extraLife5:{func:function(){updateELNG(extraLivesNextGame+5);updateLives(extraLivesNextGame)},cost:45,name:"Five Extra Lives in the Next Game"},extraLife20:{func:function(){updateELNG(extraLivesNextGame+20);updateLives(extraLivesNextGame)},cost:175,name:"Twenty Extra Lives in the Next Game"}};var ctx;var fallingObjs=[];var tickCount=0;var lastFallingSpawned=0;var playerX=0;var playerMovementDirection=0;var lives=0;var score=0;var credits=0;var intervalId=-2;var gameOverShownAt;var screenFlashedAt=0;var extraLivesNextGame=0;function getCookie(cname){var name=cname+"=";var ca=document.cookie.split(";");for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)==" "){c=c.substring(1)}if(c.indexOf(name)==0){return c.substring(name.length,c.length)}}return undefined}function setCookie(cname,cvalue,exdays){var d=new Date;d.setTime(d.getTime()+exdays*24*60*60*1e3);var expires="expires="+d.toUTCString();document.cookie=cname+"="+cvalue+"; "+expires}function createFalling(){var falling={x:0,y:0,isSpecial:false,movement:0};falling.x=Math.floor(Math.random()*(CANVAS_WIDTH-FALLING_SIZE));falling.y=-FALLING_SIZE;falling.isSpecial=Math.random()<SPECIAL_CHANCE;falling.movement=FALLING_PIXELS_PER_TICK_MIN+Math.floor(Math.random()*(FALLING_PIXELS_PER_TICK_MAX-FALLING_PIXELS_PER_TICK_MIN));return falling}function addFalling(falling){fallingObjs.push(falling)}function removeFalling(falling){var newArray=[];for(var i=0;i<fallingObjs.length;i++){if(fallingObjs[i]!==falling){newArray.push(fallingObjs[i])}}fallingObjs=newArray}function tick(){tickCount++;var isLastTick=false;var toRemove=[];for(var i=0;i<fallingObjs.length;i++){var o=fallingObjs[i];o.y+=o.movement;if(o.x>=playerX&&o.x<=playerX+PLAYER_WIDTH&&o.y>=CANVAS_HEIGHT-PLAYER_HEIGHT*3-FALLING_SIZE){toRemove.push(o);updateScore(score+(o.isSpecial?SCORE_SPECIAL:SCORE_NORMAL))}if(o.y>CANVAS_HEIGHT){toRemove.push(o);updateLives(lives-1);if(lives<=0){isLastTick=true}else{flashScreen()}}}for(var i=0;i<toRemove.length;i++){removeFalling(toRemove[i])}if(lastFallingSpawned+FALLING_SPAWN_COOLDOWN_TICKS<tickCount){addFalling(createFalling());lastFallingSpawned=tickCount}if(playerX<CANVAS_WIDTH-PLAYER_WIDTH&&playerMovementDirection==1||playerX>0&&playerMovementDirection==-1)playerX+=playerMovementDirection*PLAYER_MOVEMENT_PER_TICK;var bgR=182;var bgG=16;var bgB=16;bgR=Math.floor(Math.min(255,bgR+(Date.now()-screenFlashedAt)/SCREEN_FLASH_FADE_OUT*(255-bgR)));bgG=Math.floor(Math.min(255,bgG+(Date.now()-screenFlashedAt)/SCREEN_FLASH_FADE_OUT*(255-bgG)));bgB=Math.floor(Math.min(255,bgB+(Date.now()-screenFlashedAt)/SCREEN_FLASH_FADE_OUT*(255-bgB)));ctx.fillStyle="rgb("+bgR+","+bgG+","+bgB+")";if(isLastTick)ctx.fillStyle="#FFFFFF";ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);for(var i=0;i<fallingObjs.length;i++){var o=fallingObjs[i];ctx.beginPath();ctx.fillStyle=o.isSpecial?FALLING_COLOR_SPECIAL:FALLING_COLOR;ctx.fillRect(o.x,o.y,FALLING_SIZE,FALLING_SIZE)}ctx.beginPath();ctx.fillStyle=PLAYER_COLOR;ctx.fillRect(playerX,CANVAS_HEIGHT-PLAYER_HEIGHT*3,PLAYER_WIDTH,PLAYER_HEIGHT);if(isLastTick)gameOver()}function flashScreen(){screenFlashedAt=Date.now()}function updateScore(newScore){score=newScore;$("#score").html(score)}function updateCredits(newCredits){credits=newCredits;setCookie("CreditsValue",credits,2e4);$("#credits").html(credits)}function updateLives(newLives){lives=newLives;$("#lives").html(lives)}function updateELNG(newELNG){extraLivesNextGame=newELNG;setCookie("ExtraLivesNextGameValue",extraLivesNextGame)}function startGame(){$(".how-to").slideUp(500);fallingObjs=[];updateScore(0);updateLives(STARTING_LIVES+extraLivesNextGame);updateELNG(0);intervalId=setInterval(tick,1e3/TICK_PER_SECOND)}function gameOver(){clearInterval(intervalId);intervalId=-1;var creditsEarned=Math.floor(score*CREDITS_PER_SCORE);updateCredits(credits+creditsEarned);updateScore(0);ctx.beginPath();ctx.fillStyle="#E074a3";ctx.globalAlpha=.7;ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);ctx.globalAlpha=1;ctx.font=FONT_GAME_OVER;ctx.fillStyle="#000000";ctx.textAlign="center";ctx.fillText("Game Over",CANVAS_WIDTH/2,CANVAS_HEIGHT/2-15);ctx.font=FONT_GAME_OVER_SCREEN;ctx.fillStyle="#000000";ctx.textAlign="center";ctx.fillText("You earned "+creditsEarned+" credits.",CANVAS_WIDTH/2,CANVAS_HEIGHT/2+10);setTimeout(function(){ctx.fillText("Click to play again.",CANVAS_WIDTH/2,CANVAS_HEIGHT/2+30)},GAME_OVER_SCREEN_DELAY);gameOverShownAt=Date.now()}$(function(){ctx=document.getElementById("canvas_game").getContext("2d");var cookieCredits=getCookie("CreditsValue");if(cookieCredits!=undefined){updateCredits(parseInt(cookieCredits))}var cookieELNG=getCookie("ExtraLivesNextGameValue");if(cookieELNG!=undefined){updateELNG(parseInt(cookieELNG));updateLives(extraLivesNextGame)}$("#canvas_game").bind({mousedown:function(event){if(event.which==1)playerMovementDirection=-1;else if(event.which==3)playerMovementDirection=1},mouseup:function(event){if(event.which==1&&playerMovementDirection==-1||event.which==3&&playerMovementDirection==1)playerMovementDirection=0},contextmenu:function(event){event.preventDefault()},dblclick:function(event){event.preventDefault()},click:function(event){if(intervalId==-2){startGame()}else if(intervalId==-1&&gameOverShownAt+GAME_OVER_SCREEN_DELAY<Date.now()){startGame()}}});$(".shop-link").click(function(event){if(intervalId==-2||intervalId==-1){var shopItem=SHOP_LIST[$(event.target).attr("_item")];if(credits-shopItem.cost<0){alert("Not enough credits!")}else{var confirmed=confirm("Are you sure you want to spend "+shopItem.cost+" credits on "+shopItem.name+"?");if(confirmed){updateCredits(credits-shopItem.cost);shopItem.func()}}}event.preventDefault()});$(".shop-charity").click(function(event){if(intervalId==-2||intervalId==-1){var confirmed=confirm("Are you sure you want to waste all your credits and give them out to starving children in Africa?");if(confirmed){updateCredits(0);alert("lol children in africa don't play this game xDdd lel kek u wasted all ur money")}}});$(".how-to-link").click(function(event){if(intervalId==-2||intervalId==-1){$(".how-to").slideToggle(500)}event.preventDefault()});ctx.beginPath();ctx.fillStyle="#E074a3";ctx.globalAlpha=.7;ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);ctx.globalAlpha=1;ctx.font=FONT_GAME_OVER_SCREEN;ctx.fillStyle="#000000";ctx.textAlign="center";ctx.fillText("Click to play.",CANVAS_WIDTH/2,CANVAS_HEIGHT/2)});