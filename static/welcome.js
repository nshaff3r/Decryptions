document.addEventListener("DOMContentLoaded", function(){
    var text = document.getElementById('welcomeText');
    let typewriter = new Typewriter(text, {
        cursor: '<span style="color: #ffffff;">|</span>',
        delay: 50,
        deleteSpeed: 5
    });
    let yes = document.getElementById("left");
    let no = document.getElementById("right");
    typewriter.start();
    typewriter.typeString('Welcome. Have you played Decryption before?');

    setTimeout(function(){
        let buttons = [yes, no];
        let data = ["yes", "no"];
        let colors = ["green", "red"];
        for (let i = 0; i < 2; i++)
        {
            buttons[i].style.marginTop = "75px";
            buttons[i].style.opacity = 1;
            buttons[i].addEventListener("mouseover", function(){
                if (i == 0){buttons[1 - i].style.marginRight = 0;}
                else{buttons[1 - i].style.marginLeft = 0;}
                buttons[1 - i].style.opacity = 0;
                buttons[i].style.width = "300px";
                buttons[i].style.backgroundColor = colors[i];
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
                buttons[i].classList.add("fixed");
                typewriter.stop().pauseFor(1).start().deleteChars(43);
                setTimeout(function() {
                    document.getElementById("requestData").value = data[i];
                    document.getElementById("ynForm").submit();
                }, 1500);
            })
        }
    }, 3200);
});