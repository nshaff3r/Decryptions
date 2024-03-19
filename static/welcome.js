document.addEventListener("DOMContentLoaded", function(){
    var text = document.getElementById('welcomeText');
    let typewriter = new Typewriter(text, {
        cursor: '<span style="color: #ffffff;">|</span>',
        delay: 15,
        deleteSpeed: 5
    });
    let yes = document.getElementById("left");
    let no = document.getElementById("right");
    typewriter.start();
    typewriter.typeString('Welcome. Have you played Decryptions before?');

    setTimeout(function(){
        let buttons = [yes, no];
        let data = ["yes", "no"];
        let top = "60px";
        function sizing(){
            if (window.innerWidth <= 401) {
                top = "30px";
            } else {
                top = "60px";
            }
        }
        sizing();
        let colors = ["green", "red"];
        window.addEventListener("resize", function(){
            sizing();
            buttons[0].style.marginTop = top;
            buttons[1].style.marginTop = top;
        });
        for (let i = 0; i < 2; i++)
        {
            buttons[i].style.opacity = 1;
            buttons[i].style.marginTop = top;
            buttons[i].addEventListener("mouseover", function(){
                if (i == 0){buttons[1 - i].style.marginRight = "-101px";}
                else{buttons[1 - i].style.marginLeft = "-101px";}
                buttons[1 - i].style.opacity = 0;
                buttons[i].style.width = `${Math.min(350, window.innerWidth - 20)}px`;
                buttons[i].style.backgroundColor = colors[i];
            });
            buttons[i].addEventListener("mouseout", function(){
                if (i == 1){buttons[1 - i].style.marginLeft = 0}
                else{buttons[1 - i].style.marginRight = 0}
                buttons[1 - i].style.opacity = 1;
                buttons[i].style.width = "100px";
                buttons[i].style.backgroundColor = "slategrey";
            });
            buttons[i].addEventListener("click", function(){
                buttons[1 - i].style.display = "none";
                buttons[i].classList.add("fixed");
                document.getElementById("requestData").value = data[i];
                buttons[i].classList.remove("fixed");
                buttons[1 - i].style.display = "block";
                document.getElementById("ynForm").submit();
            })
        }
    }, 1700);
});