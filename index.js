const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1200;
canvas.height = 600;

var mouseX = 0;
var mouseY = 0;
var isMouseDown = false;
var mode = 2;
var placementType = 0;

var spritesheet = new Image();
spritesheet.src = "spritesheet.png"
var starSprite = new Image();
starSprite.src = "star.png"

let rights = 3;
let lefts = 0;
let ups = 0;
help = true;

var level = 1;

class Player
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.xDirection = 0;
        this.xVel = 0;
        this.yVel = 0;
    }

    draw()
    {
        
        c.fillStyle = 'lightblue'
        c.drawImage(spritesheet, 0, 0, 50, 50, this.x, this.y, 50, 50);
    }

    update(platforms, obstacles, goal)
    {
        this.yVel += 1;
        this.xVel = 5 * this.xDirection;
        platforms.forEach(platform =>{
            
            
            if (this.x + this.width >= platform.x && this.x <= platform.x + platform.width && this.y + this.height >= platform.y && this.y <= platform.y + platform.height)
            {
                this.yVel = 0;
                while (this.x + this.width >= platform.x && this.x <= platform.x + platform.width && this.y + this.height >= platform.y && this.y <= platform.y + platform.height)
                {
                    this.y -= .1;
                }
                if (platform.type == 1)
                {
                    this.xDirection = 1;
                }
                if (platform.type == 2)
                {
                    this.xDirection = -1;
                }
                if (platform.type == 3)
                {
                    this.yVel = -20;
                }
            }
            
        })
        obstacles.forEach(obstacle =>{
            if (this.x + this.width >= obstacle.x && this.x <= obstacle.x + obstacle.width && this.y + this.height >= obstacle.y && this.y <= obstacle.y + obstacle.height)
            {
                //animate loop says that if y > 600 go back to edit mode so I set the y to a much lower value than 600 to be safe
                this.y = 800
            }
        })
        if (this.x + this.width >= goal.x && this.x <= goal.x + goal.width && this.y + this.height >= goal.y && this.y <= goal.y + goal.height)
        {
            level += 1;
            LoadLevel(level, true);
        }
        this.x += this.xVel;
        this.y += this.yVel;
        
        
    }
}

class Platform
{
    //platform types: (1: move right), (2: move left), (3: jump in direction), (4: idk yet)
    constructor(x, y, type)
    {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 50;
        this.type = type;
    }

    draw()
    {
        c.fillStyle = "rgba(30, 30, 30, .8)"
        c.fillRect(this.x, this.y + 40, 100, 15)
        if (this.type == 1)
        {
            c.drawImage(spritesheet, 50, 0, 100, 50, this.x, this.y, 100, 50);
        }
        if (this.type == 2)
        {
            c.drawImage(spritesheet, 150, 0, 100, 50, this.x, this.y, 100, 50);
        }
        if (this.type == 3)
        {
            c.drawImage(spritesheet, 250, 0, 100, 50, this.x, this.y, 100, 50);
        }
        
    }
}

class Obstacle
{
    constructor(x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw()
    {
        c.fillStyle = "rgba(30, 30, 30, .8)"
        c.fillRect(this.x, this.y + this.height - 10, this.width, 15)
        c.fillStyle = "red"
        c.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Goal
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
    }

    draw()
    {
        c.drawImage(starSprite, this.x, this.y)
    }
}
class ItemHolder
{
    constructor(x, y, type, amount)
    {
        this.x = x;
        this.y = y;
        this.type = type;
        this.amount = amount;
    }
    draw()
    {
        c.fillStyle = "black"
        c.strokeRect(this.x - 5, this.y - 5, 110, 60)
        if (this.type == 1)
        {
            c.drawImage(spritesheet, 50, 0, 100, 50, this.x, this.y, 100, 50);
        }
        if (this.type == 2)
        {
            c.drawImage(spritesheet, 150, 0, 100, 50, this.x, this.y, 100, 50);
        }
        if (this.type == 3)
        {
            c.drawImage(spritesheet, 250, 0, 100, 50, this.x, this.y, 100, 50);
        }
        c.fillStyle = "white"
        c.font = "15px Arcade Normal"
        c.fillText(this.amount, this.x, this.y + 50)
        if (help)
        {
            c.fillStyle = "white"
            c.font = "15px Arcade Normal"
            c.fillText("KEY: " + String(this.type), this.x + 5, this.y)
        }
        
    }
    update(amount)
    {
        this.amount = amount
    }
}

var player = new Player(50, 50);
var platforms = [];
var obstacles = [new Obstacle(980, 180, 10, 100)];
var goal = new Goal(1000, 200)
var tutorialText = "Click to Place Platforms";
var rightHolder = new ItemHolder(50, 520, 1, 0)
var leftHolder = new ItemHolder(170, 520, 2, 0)
var upHolder = new ItemHolder(290, 520, 3, 0)

te = 0
ft = 16
ct = Date.now()

function LoadLevel(newLevel, resetPlatforms)
{
    mode = 0;
    player.yVel = 0;
    player.xVel = 0;
    player.xDirection = 0;
    if (resetPlatforms)
    platforms = [];
    
    if (newLevel == 1)
    {
        player.x = 350;
        player.y = 200;
        obstacles = [];
        goal = new Goal(500, 200);
        tutorialText = "Click to place platforms";

        rights = 2;
        lefts = 0;
        ups = 0;
    }
    else if (newLevel == 2)
    {
        player.x = 800;
        player.y = 400;
        obstacles = [];
        goal = new Goal(200, 400);
        tutorialText = 'Use the 1-3 keys to change platform types';

        rights = 0;
        lefts = 5;
        ups = 0;
    }
    else if (newLevel == 3)
    {
        player.x = 800;
        player.y = 400;
        obstacles = [];
        goal = new Goal(200, 200);
        tutorialText = 'You can vault up the sides of adjacent platforms';

        rights = 0;
        lefts = 5;
        ups = 0;
    }
    else if (newLevel == 4)
    {
        player.x = 200;
        player.y = 350;
        obstacles = [new Obstacle(400, 300, 10, 150)]
        goal = new Goal(600, 350)
        tutorialText = "The Jump Block bounces you the direction you're moving"

        rights = 3;
        lefts = 0;
        ups = 1;
    }
    else if (newLevel == 5)
    {
        player.x = 600;
        player.y = 400;
        obstacles = []
        goal = new Goal(600, 200)
        tutorialText = "You can phase through the bottom of platforms up to the top"

        rights = 3;
        lefts = 0;
        ups = 0;
    }
    else if (newLevel == 6)
    {
        player.x = 50;
        player.y = 100;
        obstacles = [new Obstacle(980, 180, 10, 100)]
        goal = new Goal(1000, 200)
        tutorialText = "Try to beat this level using everything you've learned"

        rights = 1;
        lefts = 1;
        ups = 5;
    }
    else if (newLevel == 7)
    {
        player.x = 1100;
        player.y = 500;
        obstacles = [new Obstacle(1085, 400, 10, 200)]
        goal = new Goal(50, 200)
        tutorialText = "You must think below the box, then above the box"

        rights = 0;
        lefts = 3;
        ups = 6;
    }
    else if (newLevel == 8)
    {
        player.x = 300;
        player.y = 350;
        obstacles = [new Obstacle(400, 150, 10, 1000)]
        goal = new Goal(600, 350)
        tutorialText = ""

        rights = 3;
        lefts = 2;
        ups = 1;
    }
    else if (newLevel == 9)
    {
        player.x = 900;
        player.y = 500;
        obstacles = [new Obstacle(0, 400, 1200, 10)]
        goal = new Goal(300, 200)
        tutorialText = ""

        rights = 0;
        lefts = 5;
        ups = 1;
    }
    else if (newLevel == 10)
    {
        player.x = 200;
        player.y = 450;
        obstacles = [new Obstacle(600, 200, 10, 200), new Obstacle(0, 400, 600, 10), new Obstacle(0, 200, 600, 10)]
        goal = new Goal(50, 50)
        tutorialText = ""

        rights = 3;
        lefts = 4;
        ups = 1;
    }
    else if (newLevel == 11)
    {
        player.x = 200;
        player.y = 430;
        obstacles = [new Obstacle(400, 200, 10, 200), new Obstacle(0, 400, 1200, 10)]
        goal = new Goal(500, 325)
        tutorialText = ""

        rights = 1;
        lefts = 0;
        ups = 1;
    }
    else if (newLevel == 12)
    {
        player.x = 800;
        player.y = 450;
        obstacles = [new Obstacle(600, 0, 10, 1200), new Obstacle(0, 400, 1200, 10)]
        goal = new Goal(200, 325)
        tutorialText = "Think outside the box"

        rights = 0;
        lefts = 6;
        ups = 4;
    }
    else {
        mode = 2;
        level = 1;
    }
    
}
//LoadLevel(level, true)

function animate()
{
    st = ct
    requestAnimationFrame(animate);
    ct = Date.now()
    te += ct - st

    if (te >= ft)
    {
        if (mode != 2)
        {
            c.clearRect(0, 0, canvas.width, canvas.height);
            c.fillStyle = 'green'
            c.fillRect(0, 0, canvas.width, canvas.height);
            if (mode == 1)
            {
                player.update(platforms, obstacles, goal);
                if (player.y >= 600)
                {
                    mode = 0;
                    LoadLevel(level, true)
                }
            }
            player.draw();
            platforms.forEach(platform =>{
                platform.draw();
            })
    
            obstacles.forEach(obstacle =>{
                obstacle.draw();
            })
            goal.draw();
            if (mode == 0) 
            {
                c.drawImage(spritesheet, 50 + placementType * 100, 0, 100, 50, mouseX - 50, mouseY - 25, 100, 50);
                
            }
    
            rightHolder.update(rights);
            rightHolder.draw()
    
            leftHolder.update(lefts);
            leftHolder.draw()
    
            upHolder.update(ups);
            upHolder.draw()
    
            //draw tutorial text
            c.fillStyle = "white"
            c.font = "20px Arcade Normal"
            textWidth = c.measureText(tutorialText).width;
            c.fillText(tutorialText, 600 - textWidth / 2, 75)
    
            if (level == 1)
            {
                c.fillStyle = "white"
                c.font = "15px Arcade Normal"
                textWidth = c.measureText("Press enter to switch between play and edit modes").width;
                c.fillText("Press enter to switch between play and edit modes", 600 - textWidth / 2, 120)
    
                c.font = "15px Arcade Normal"
                textWidth = c.measureText("Press R to reset platforms").width;
                c.fillText("Press R to reset platforms", 600 - textWidth / 2, 150)
                
            }
        }
        else
        {
            c.clearRect(0, 0, 1200, 600)
            c.fillStyle = "darkblue"
            c.fillRect(0, 0, 1200, 600)
            c.fillStyle = "white"
            c.font = "50px Arcade Normal"
            textWidth = c.measureText("You're the Platformer").width;
            c.fillText("You're the Platformer", 600 - textWidth / 2, 120)

            c.font = "30px Arcade Normal"
            textWidth = c.measureText("Click to Play").width;
            c.fillText("Click to Play", 600 - textWidth / 2, 400)
        }
        
        te = 0;
    }
}

animate();

document.onmousemove = function(e)
{
    mouseX = e.offsetX;
    mouseY = e.offsetY;

    
}

document.onmousedown = function(e)
{
    if (mode != 2)
    {
        //check if editing mode is active and the specific platform type is active and you have enough of that type to place one
        if (mode == 0 && placementType == 0 && rights > 0)
        {
            rights -= 1;
            platforms.push(new Platform(mouseX - 50, mouseY - 25, placementType + 1))
            
        }

        if (mode == 0 && placementType == 1 && lefts > 0)
        {
            platforms.push(new Platform(mouseX - 50, mouseY - 25, placementType + 1))
            lefts -= 1;
        }

        if (mode == 0 && placementType == 2 && ups > 0)
        {
            platforms.push(new Platform(mouseX - 50, mouseY - 25, placementType + 1))
            ups -= 1;
        }
    }
    else
    {
        LoadLevel(level, true);
    }
    
    
}

document.onkeydown = function(e)
{
    if (e.key == "Enter" && mode == 0)
    {
        mode = 1
    }
    else if (e.key == "Enter" && mode == 1)
    {
        LoadLevel(level, true)
        mode = 0;
    }
    if (e.key == "r" && mode == 0)
    {
        LoadLevel(level, true)
    }
    if (e.code == "Digit1")
    {
        placementType = 0;
    }
    if (e.code == "Digit2")
    {
        placementType = 1;
    }
    if (e.code == "Digit3")
    {
        placementType = 2;
    }
    if (e.key == "?")
    {
        help = true;
    }
}
document.onkeyup = function(e)
{
    if (e.key == "?")
    {
        help = true;
    }
}