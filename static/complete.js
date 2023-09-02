document.addEventListener("DOMContentLoaded", function(){
    let left = document.getElementById("left");
    let right = document.getElementById("right");
    let num = document.getElementById("num").innerHTML;
    let finished = "";
    var msg = "";
    var time = 2500
    if (status) {
        finished = "✅";
        msg = `Congratulations on completing Cryptogram ${num}!`;
    } else {
        finished = "💀";
        msg = `Better luck next time!\n`;
        time = 1500;
    }
    var userText = document.getElementById('inputText');
    userText.style.backgroundColor = "#201c1c";
    let userWriter = new Typewriter(userText, {
        cursor: '<span style="color: #ffffff;">|</span>',
        delay: 45,
        deleteSpeed: 5
    });
    userWriter.start();
    userWriter.typeString(msg);
    let buttons = [left, right];
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
                buttons[1 - i].style.display = "none";
                buttons[i].classList.add("postfixed"); 
                if (i == 0) {
                    var copy = `CRYPTOGRAM\n${dateDashed} ${num} ${finished}\nLives Used:\n${"❤️".repeat(attempts)} / 5️⃣\ncryptogramgame.com`
                    navigator.clipboard.writeText(copy)
                        .then(() => {
                            userWriter.stop().pauseFor(1).start().typeString('\n<br>Copied to keyboard.'); 
                            setTimeout(function(){
                                userWriter.stop().pauseFor(1).start().deleteChars(20);
                                buttons[0].classList.remove("postfixed");
                                buttons[1].style.display = "block";
                            }, 2000)
                        })
                        .catch(error => {
                            var errorString = `\n<br>Error copying to clipboard. Please check your browser permissions and try again.`;
                            userWriter.stop().pauseFor(1).start().typeString(errorString); 
                            setTimeout(function(){
                                userWriter.stop().pauseFor(1).start().deleteChars(81);
                                buttons[0].classList.remove("postfixed");
                                buttons[1].style.display = "block";
                            }, 5000)
                        });
                }
                if (i == 1) {
                    userWriter.stop().pauseFor(1).start().deleteChars(50);
                    setTimeout(function(){
                        window.location.href = "/stats";
                        setTimeout(function() {
                            buttons[1].classList.remove("postfixed");
                            buttons[0].style.display = "block";
                        }, 100);
                    }, time / 1.7);
                }
            })
        }
    }, time);
});