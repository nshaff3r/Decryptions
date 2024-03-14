document.addEventListener("DOMContentLoaded", function(){
    let left = document.getElementById("left");
    let right = document.getElementById("right");
    let num = document.getElementById("num").innerHTML;
    let container = document.getElementById("cryptogramContainer");
    container.style.height = "400px";
    let finished = "";
    var msg = "";
    var time = 200;
    var fade = document.getElementById("fader")
    if (window.getComputedStyle(fade, null).display == "none") {
        time = 1800;
    }
    if (state) {
        finished = "✅";
        msg = `Congratulations on completing Decryptions ${num}!`;
    } else {
        finished = "💀";
        msg = `Better luck next time!\n`;
        time = 1100;
    }
    var userText = document.getElementById('inputText');
    userText.style.backgroundColor = "#201c1c";
    let userWriter = new Typewriter(userText, {
        cursor: '<span style="color: #ffffff;">|</span>',
        delay: 20,
        deleteSpeed: 15
    });
    userWriter.start();
    userWriter.typeString(msg);
    var top = "60px";
    function sizing()
    {
        if (window.innerWidth <= 401) {
            top = "0px";
        } else {
            top = "60px";
        }
    }
    sizing();
    let buttons = [left, right];
    window.addEventListener("resize", function(){
        sizing();
        buttons[0].style.marginTop = top;
        buttons[1].style.marginTop = top;
    });
    setTimeout(function(){
        fade.style.opacity = 0;
        fade.style.zIndex = 0;
        setTimeout(function(){
            fade.style.display = "none";
        }, 2000)
        for (let i = 0; i < 2; i++)
        {
            buttons[i].style.marginTop = top;
            buttons[i].style.opacity = 1;
            buttons[i].addEventListener("mouseover", function(){
                if (i == 0){buttons[1 - i].style.marginRight = "-101px";}
                else{buttons[1 - i].style.marginLeft = "-101px";}
                buttons[1 - i].style.opacity = 0;
                buttons[i].style.width = `${Math.min(350, window.innerWidth - 20)}px`;
                buttons[i].style.backgroundColor = "green";
            });
            buttons[i].addEventListener("mouseout", function(){
                if (i == 1){buttons[1 - i].style.marginLeft = 0;}
                else{buttons[1 - i].style.marginRight = 0;}
                buttons[1 - i].style.opacity = 1;
                buttons[i].style.width = "100px";
                buttons[i].style.backgroundColor = "slategrey";
            });
            buttons[i].addEventListener("click", function(){
                buttons[1 - i].style.display = "none";
                buttons[i].classList.add("postfixed"); 
                if (i == 0) {
                    var copy = `DECRYPTIONS\n${dateDashed} ${num} ${finished}\nLives Used:\n${"❤️".repeat(attempts)} / 5️⃣\ndecryptions.org`
                    try {
                        const data = {
                            text: copy
                          };
                        navigator.share(data)
                    }
                    catch(err) {
                        navigator.clipboard.writeText(copy)
                            .then(() => {
                                userWriter.stop().pauseFor(1).start().typeString('\n<br>Copied to keyboard.'); 
                                setTimeout(function(){
                                    userWriter.stop().pauseFor(1).start().deleteChars(20);
                                    buttons[i].classList.remove("postfixed");
                                    setTimeout(function(){
                                        buttons[1].style.display = "block";
                                    }, 500)

                                }, 2000)
                            })
                            .catch(error => {
                                var errorString = `\n<br>Error copying to clipboard.`;
                                userWriter.stop().pauseFor(1).start().typeString(errorString); 
                                setTimeout(function(){
                                    userWriter.stop().pauseFor(1).start().deleteChars(28);
                                    buttons[i].classList.remove("postfixed");
                                    setTimeout(function(){
                                        buttons[1].style.display = "block";
                                    }, 500)
                                }, 3000)
                            });
                        }
                }
                if (i == 1) {
                    setTimeout(function(){
                        window.location.href = "/stats";
                        buttons[1].classList.remove("postfixed");
                        buttons[0].style.display = "block";
                    }, 800);
                }
            })
        }
    }, time);
});