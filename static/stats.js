document.addEventListener("DOMContentLoaded", function(){
    let left = document.getElementById("left");
    let right = document.getElementById("right");
    let buttons = [left, right];
    var solved = ((data.solved/data.games) * 100).toFixed(2);
    if (data.games == 0) {
        solved = 0;
    }
    var msg = `Check out this cool\ndaily word game!\n\nGames: ${data.games}<br>Solved: ${solved}%<br>Win Streak: ${data.streak}<br>Max Streak: ${data.maxStreak}<br>Avg Lives: ${data.avgLives.toFixed(2)}<br>Close Calls<i style="font-size: 12px;">(1&#9829; Wins)</i>: ${data.closeCalls}`;
    var typed = `Games: ${data.games}<br>Solved: ${solved}%<br>Win Streak: ${data.streak}<br>Max Streak: ${data.maxStreak}<br>Avg Lives: ${data.avgLives.toFixed(2)}<br>Close Calls<i style="font-size: 12px;">(1&#9829; Wins)</i>: ${data.closeCalls}`;
    const container = document.getElementById("cryptogramContainer");
    var top = "60px";
    function sizing()
    {
        if (window.innerWidth <= 401) {
            container.style.height = "400px";
            top = "0px";
        } else {
            top = "60px";
        }
    }
    sizing();
    var userText = document.getElementById('inputText');
    userText.style.backgroundColor = "#201c1c";
    let userWriter = new Typewriter(userText, {
        cursor: '<span style="color: #ffffff;">|</span>',
        delay: 20,
        deleteSpeed: 15
    });
    let stop = document.getElementById("stop");
    if (data.closeCalls > 9) {
        stop.style.width = "50px";
    }
    if (data.closeCalls > 99) {
        stop.style.width = "40px";
    }
    userWriter.start();
    userWriter.typeString(typed);
    var fade = document.getElementById("fader")
    var time = 6000;
    if (window.getComputedStyle(fade, null).display == "none") {
        time = 7500;
    }
    setTimeout(function(){ 
        var myChart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['💀', '❤️', '❤️❤️', '❤️❤️❤️', '❤️❤️❤️❤️', '❤️❤️❤️❤️❤️'],
                    datasets: [{
                    data: data.lives,
                    borderWidth: 1
                }]
            },
            options: {  
                maintainAspectRatio: false,
                animation: {
                    duration: 0,
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        border: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            stepSize: 1
                        },
                        min: 0,
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
        document.getElementById("cover").style.width = 0;
    }, 3700);
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
                buttons[1 - i].style.opacity = "0";
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
                    var copy = msg.replaceAll("<br>", "\n");
                    copy = copy.replaceAll('<i style="font-size: 12px;">(1&#9829; Wins)</i>', ' (1❤️ Wins)');
                    const data = {
                        text: copy
                      };
                    try {
                        navigator.share(data)
                    } catch(error){
                        navigator.clipboard.writeText(copy)
                        .then(() => {
                            userWriter.stop().pauseFor(1).start().typeString("\n<br>Copied to clipboard."); 
                            setTimeout(function(){
                                userWriter.stop().pauseFor(1).start().deleteChars(21);
                                buttons[0].classList.remove("postfixed");
                                setTimeout(function(){
                                    buttons[1].style.display = "block";
                                }, 500)
                            }, 1500)
                        })
                        .catch(error => {
                        var errorString = "\n<br>Error copying to clipboard.";
                        userWriter.stop().pauseFor(1).start().typeString(errorString); 
                        setTimeout(function(){
                            userWriter.stop().pauseFor(1).start().deleteChars(28);
                            buttons[0].classList.remove("postfixed");
                            setTimeout(function(){
                                buttons[1].style.display = "block";
                            }, 500)
                        }, 2000)
                    });
                    }
                }
                if (i == 1) {
                    setTimeout(function(){
                        window.location.href = "/";
                        setTimeout(function() {
                            buttons[1].classList.remove("postfixed");
                            buttons[0].style.display = "block";
                        }, 100);
                    }, 800);
                }
            })
        }
    }, time);
});