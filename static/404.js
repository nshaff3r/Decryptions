function highlight(el, letter, mode=0, altLetter, color="#ffff00")
{
    var highlighted = `<span style="color: #ffff00;">${letter}</span>`;
    var altHighlighted = `<span style="color: ${color};">${altLetter}</span>`;
    if (mode==0) {
        console.log(el.innerHTML)
        el.innerHTML = el.innerHTML.replaceAll(letter, highlighted);
        console.log(el.innerHTML)
        var doubleReplaced = `<span style="color: #00ff00;"><span style="color: #ffff00;">${letter}</span></span>`;
        highlighted = `<span style="color: #00ff00;">${letter}</span>`;
        el.innerHTML = el.innerHTML.replaceAll(doubleReplaced, highlighted);
    } else if (mode==1) {
        el.innerHTML = el.innerHTML.replaceAll(highlighted, altHighlighted);
    }
}

function exampler(el, str, solved)
{
    var changed = [];
    var count = 0;
    for (let i = 0; i < str.length; i++) {
        if (!changed.includes(str[i]) && /^[a-z]$/i.test(str[i])) {
            setTimeout(function(){
                highlight(el, str[i]);
                setTimeout(function(){
                    highlight(el, str[i], 1, solved[i], "#00ff00");
                }, 400);
            }, (count + 1) * 300);
            changed.push(str[i]);
            count++;
        }
    }
}
document.addEventListener("DOMContentLoaded", function(){
    let demo = document.getElementById("el404");
    let solution = `
    UH OH! THIS PAGES DOESN'T EXIST. (ERROR 404)
    `;
    let msg = `
    IG MG! SGOK TVCPK BMPKL'S PUOKS. (PHHMH 404)
    `;
    exampler(demo, msg, solution);
    var fade = document.getElementById("fader")
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
                if (i == 1) {
                    setTimeout(function(){
                        window.location.href = "/";
                        buttons[1].classList.remove("postfixed");
                    }, 700);
                    setTimeout(function(){
                        buttons[0].style.display = "block";
                    }, 1000)
                } else {
                    setTimeout(function(){
                        window.location.href = "mailto:nolanshaffer@uchicago.edu";
                        buttons[0].classList.remove("postfixed");
                    }, 700);
                    setTimeout(function(){
                        buttons[1].style.display = "block";
                    }, 1000)
                }
            })
        }
    }, 5000);
});