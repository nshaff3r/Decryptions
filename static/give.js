document.addEventListener("DOMContentLoaded", function(){
    let left = document.getElementById("left");
    let right = document.getElementById("right");
    var msg = `
    Why .org? <span style="color: #00ff00;">Decryptions is not currently earning
    revenue, but if it ever does, all proceeds will be donated to <a href="https://www.givedirectly.org/">GiveDirectly</a>,
    who sends direct cash transfers to those living in <a href="https://www.givingwhatwecan.org/get-involved/what-we-can-achieve">extreme poverty.</a></span>
    `;
    var userText = document.getElementById('inputText');
    userText.style.backgroundColor = "#201c1c";
    let userWriter = new Typewriter(userText, {
        cursor: '<span style="color: #ffffff;">|</span>',
        delay: 20,
        deleteSpeed: 15
    });
    userWriter.start();
    userWriter.typeString(msg);
    const container = document.getElementById("cryptogramContainer");
    var top = "60px";
    var fade = document.getElementById("fader")
    var time = 5700;
    if (window.getComputedStyle(fade, null).display == "none") {
        time = 7300;
    }
    function sizing()
    {
        if (window.innerWidth <= 401) {
            container.style.height = "350px";
            userText.style.fontSize = "21px";
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
                buttons[i].style.width = "300px";
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
                    window.open("https://www.givedirectly.org/about/");
                    setTimeout(function(){
                        buttons[0].classList.remove("postfixed");
                        setTimeout(function(){
                            buttons[1].style.display = "block";
                        }, 500)
                    }, 2000)
                }
                if (i == 1) {
                    window.open("https://donate.givedirectly.org/");
                    setTimeout(function() {
                        buttons[1].classList.remove("postfixed");
                        setTimeout(function(){
                            buttons[0].style.display = "block";
                        }, 500)
                    }, 2000);
                }
            })
        }
    }, time);
});