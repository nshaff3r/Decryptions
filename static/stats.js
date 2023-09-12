document.addEventListener("DOMContentLoaded", function(){
    let left = document.getElementById("left");
    let right = document.getElementById("right");
    let buttons = [left, right];
    var solved = ((data.solved/data.games) * 100).toFixed(2);
    if (data.games == 0) {
        solved = 0;
    }
    var msg = `Games: ${data.games}<br>Solved: ${solved}%<br>Win Streak: ${data.streak}<br>Max Streak: ${data.maxStreak}<br>Avg Lives: ${data.avgLives.toFixed(2)}<br>Close Calls<i style="font-size: 12px;">(1❤️ Wins)</i>: ${data.closeCalls}`;
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
        delay: 30,
        deleteSpeed: 5
    });
    let stop = document.getElementById("stop");
    if (data.closeCalls > 9) {
        stop.style.width = "50px";
    }
    if (data.closeCalls > 99) {
        stop.style.width = "40px";
    }
    userWriter.start();
    userWriter.typeString(msg);
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
    
    setTimeout(function(){
        window.addEventListener("resize", function(){
            sizing();
            buttons[0].style.marginTop = top;
            buttons[1].style.marginTop = top;
        });
        for (let i = 0; i < 2; i++)
        {
            buttons[i].style.marginTop = top;
            buttons[i].style.opacity = 1;
            buttons[i].addEventListener("mouseover", function(){
                if (i == 0){buttons[1 - i].style.marginRight = "-100px";}
                else{buttons[1 - i].style.marginLeft = "-100px";}
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
                    copy = copy.replaceAll('<i style="font-size: 12px;">(1❤️ Wins)</i>', ' (1❤️ Wins)');
                    // if(typeof ClipboardItem && navigator.clipboard.write) {
                        // NOTE: Safari locks down the clipboard API to only work when triggered
                        //   by a direct user interaction. You can't use it async in a promise.
                        //   But! You can wrap the promise in a ClipboardItem, and give that to
                        //   the clipboard API.
                        //   Found this on https://developer.apple.com/forums/thread/691873
                        const type = "text/plain";
                        const blob = new Blob([copy], { type });
                        const data = [new ClipboardItem({ [type]: blob })];
                        navigator.clipboard.write(data)
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
                        .catch((error) => {
                            alert("WOAHBUD");
                            var errorString = "\n<br>Error copying to clipboard. Please check your browser permissions and try again.";
                            userWriter.stop().pauseFor(1).start().typeString(errorString); 
                            setTimeout(function(){
                                userWriter.stop().pauseFor(1).start().deleteChars(81);
                                buttons[0].classList.remove("postfixed");
                                buttons[1].style.display = "block";
                            }, 3300)
                        });
                    }
                // }
                if (i == 1) {
                    setTimeout(function(){
                        window.location.href = "/";
                        setTimeout(function() {
                            buttons[1].classList.remove("postfixed");
                            buttons[0].style.display = "block";
                        }, 100);
                    }, 1000);
                }
            })
        }
    }, 0);
});