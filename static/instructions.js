document.addEventListener("DOMContentLoaded", function(){
    var page = 0;
    var example = document.getElementById("cryptogram");
    example.style.display = "none";
    var hider = document.getElementById("hider");
    let left = document.getElementById("left");
    let right = document.getElementById("right");
    var userText = document.getElementById('inputText');
    let userWriter = new Typewriter(userText, {
        cursor: '<span style="color: #ffffff;">|</span>',
        delay: 30,
    });
    let msg0 = `
    Every day, there is a new puzzle in accordance with the day's theme:
    <span style="color: #00ff00;"><br>Mon: Fun Fact<br>Tue: Quote<br>
    Wed: Joke<br>Thu: Proverb<br>Fri: Pun<br>Sat: Riddle<br>Sun: Haiku</span>
    `;
    userWriter.start();
    userWriter.typeString(msg0);
    let buttons = [left, right];
    left.style.display = "none";
    setTimeout(function(){
        for (let i = 0; i < 2; i++)
        {
            buttons[i].style.marginTop = "60px";
            buttons[i].style.opacity = 1;
            buttons[i].addEventListener("mouseover", function(){
                if (i == 0){buttons[1 - i].style.marginRight = 0;}
                else{buttons[1 - i].style.marginLeft = 0;}
                buttons[1 - i].style.opacity = 0;
                buttons[i].style.width = "300px";
                buttons[i].style.backgroundColor = "green";
            });
            buttons[i].addEventListener("mouseout", function(){
                if (i == 1){buttons[1 - i].style.marginLeft = "100px";}
                else{buttons[1 - i].style.marginRight = "100px";}
                buttons[1 - i].style.opacity = 1;
                buttons[i].style.width = "100px";
                buttons[i].style.backgroundColor = "slategrey";
            });
            buttons[i].addEventListener("click", function(){
                if (page == 0) {
                        buttons[1].style.backgroundColor = "#0000ff"
                        userWriter = new Typewriter(userText, {
                        cursor: '<span style="color: #ffffff;">|</span>',
                        delay: 30,
                    });
                    let msg1 = `
                    The puzzles are cryptograms. To form
                    them, each letter is replaced by a different letter,
                    encoding meaning into gibberish. It's your job to figure
                    out what the original words are!
                    `;
                    userWriter.start();
                    userWriter.typeString(msg1);
                    buttons[1].style.fontSize = "20px";
                    buttons[1].innerHTML = "See<br>Example";
                    buttons[0].style.display = "block";
                    page = 1;
                } else if (page == 1) {
                    if (i == 0) {
                        let userWriter = new Typewriter(userText, {
                            cursor: '<span style="color: #ffffff;">|</span>',
                            delay: 30,
                        });
                        userWriter.start();
                        userWriter.typeString(msg0);
                        buttons[0].style.backgroundColor = "#0000ff"
                        buttons[0].style.opacity = 0;
                        buttons[1].style.fontSize = "25px";
                        buttons[1].innerHTML = "Next";
                        page = 0;
                        setTimeout(function(){
                            buttons[0].style.display = "none";
                        }, 1000);
                    }
                    if (i == 1) {
                        let userWriter = new Typewriter(userText, {
                            cursor: '<span style="color: #ffffff;">|</span>',
                            delay: 30,
                        });
                        userWriter.start();
                        userWriter.typeString("");
                        hider.style.display = "block"
                        example.style.display = "block";
                    }
                }

            })
        }
    }, 0);
});