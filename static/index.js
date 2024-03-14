document.addEventListener("DOMContentLoaded", function(){
    // mode 0: highlight letter; mode 1: replace letter
    // mode 2: undo replacement; mode 3: undo replacement and highlight;
    // mode 4: restore replacements
    function highlight(letter, mode=0, altLetter='', color="#ffff00")
    {
        var highlighted = `<span style="color: #ffff00;">${letter}</span>`;
        var altHighlighted = `<span style="color: ${color};">${altLetter}</span>`;
        if (mode==0) {
            cryptogramText.innerHTML = cryptogramText.innerHTML.replaceAll(letter, highlighted);
            var doubleReplaced = `<span style="color: #00ff00;"><span style="color: #ffff00;">${letter}</span></span>`;
            highlighted = `<span style="color: #00ff00;">${letter}</span>`;
            cryptogramText.innerHTML = cryptogramText.innerHTML.replaceAll(doubleReplaced, highlighted);
        } else if (mode==1) {
            cryptogramText.innerHTML = cryptogramText.innerHTML.replaceAll(highlighted, altHighlighted);
        } else if (mode==2) {
            cryptogramText.innerHTML = cryptogramText.innerHTML.replaceAll(altHighlighted, highlighted);
        } else if (mode==3) {
            cryptogramText.innerHTML = cryptogramText.innerHTML.replaceAll(altHighlighted, letter);
        } else {
            cryptogramText.innerHTML = cryptogramText.innerHTML.replaceAll(`>${letter}</`, `>~</`);
            cryptogramText.innerHTML = cryptogramText.innerHTML.replaceAll(letter, altHighlighted);
            cryptogramText.innerHTML = cryptogramText.innerHTML.replaceAll(`>~</`, `>${letter}</`);
        }
    }
    function correct(letter)
    {
        status.innerHTML = "CORRECT";
        status.style.color = "#00ff00"
        status.style.opacity = 1;
        container.style.boxShadow = "inset 0 0 50px green";
        highlight(letter, 1, letter, "#00ff00");
    }
    function incorrect(letter)
    {
        status.innerHTML = "INCORRECT";
        status.style.color = "#ff0000"
        status.style.opacity = 1;
        container.style.boxShadow = "inset 0 0 50px red";
        highlight(letter, 1, letter, "#ff0000");
    }
    function keyColor(arr, color)
    {
        for (let i = 0; i < arr.length; i++) {
            document.getElementById(arr[i]).style.backgroundColor = color;
        }
    }
    function userAction(letter) {
        letter = letter.toUpperCase();
        letter = letter.match(/[A-Z]/g);
        if (letter == null){
            return;
        }
        letter = letter.join("");
        if (letter.length == 1)
        {
            if (!changing.changed)
            {
                if (!ignore.includes(letter))
                {
                    userWriter.stop().pauseFor(1).start().typeString(letter); 
                    highlight(letter);
                    userWriter.typeString('<br>New letter: ');
                    del.innerHTML = "Back";
                    changing.old = letter;
                    changing.changed = true;
                    keyColor(ignore, "dimgrey");
                    document.getElementById(letter).style.backgroundColor = "#201c1c";
                    keyColor(changed, "green");
                    if (letter in attempts) {
                        keyColor(attempts[letter], "red");
                    }
                }
            }
            else if (!changing.replaced)
            {
                if (!changed.includes(letter))
                {
                    var resume = true;
                    if (changing.old in attempts) {
                        if (attempts[changing.old].includes(letter)) {
                            resume = false;
                        }
                    }
                    if (changing.old == letter) {
                        resume = false;
                    }
                    if (resume)
                    {
                    userWriter.stop().pauseFor(1).start().typeString(letter);
                    highlight(changing.old, 1, letter);
                    changing.new = letter;
                    changing.replaced = true;
                    del.innerHTML = "Del";
                    }
                }
            }
        }
        else
        {
            if (changing.changed)
            {
                if (del.innerHTML == "Back" && ["BACK", "BACKSPACE"].includes(letter) && !changing.replaced)
                {
                    userWriter.stop().pauseFor(1).start().deleteChars(13);
                    changing.changed = false;
                    setTimeout(function(){
                        keyColor(changed, "dimgrey");
                        document.getElementById(changing.old).style.backgroundColor = "dimgrey";
                        if (changing.old in attempts) {
                            keyColor(attempts[changing.old], "dimgrey");
                        }
                        keyColor(ignore, "#201c1c");
                        highlight(changing.old, 3, changing.old);
                    }, 700);
                    
                }
                else if (del.innerHTML == "Del" && ["DEL", "BACKSPACE"].includes(letter) && !changing.confirmed)
                {
                    userWriter.stop().pauseFor(1).start().deleteChars(1);
                    del.innerHTML = "Back";
                    changing.replaced = false;
                    highlight(changing.old, 2, changing.new);
                }
                if (["CONFIRM", "ENTER"].includes(letter) && changing.replaced && !changing.confirmed)
                {
                    fetch("/api", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(changing)
                    })
                    .then(response => response.json())
                    .then(response => {
                        changing.confirmed = true;
                        if (response.message == "correct") {
                            correct(changing.new);
                            ignore.push(changing.old);
                            changed.push(changing.new)
                            if (response.complete == true) {
                                setTimeout(function(){
                                    window.location.replace("/complete");
                                }, 1000);
                            } 
                        } else {
                            incorrect(changing.new);
                            if (changing.old in attempts) {
                                attempts[changing.old].push(changing.new);
                            } else {
                                attempts[changing.old] = [changing.new];
                            }
                            if (response.complete == true) {
                                setTimeout(function(){
                                    window.location.replace("/complete");
                                }, 5000);
                            } 
                        }
                        var lives = document.querySelectorAll('.life');
                        setTimeout(function(){
                            container.style.boxShadow = "inset 0 0 3px black";
                            userWriter.stop().pauseFor(1).start().deleteChars(14);
                            status.style.opacity = 0;
                            status.innerHTML = "";
                            del.innerHTML = "Back";
                            document.getElementById(changing.old).style.backgroundColor = "dimgrey"; 
                            if (response.message == "wrong") {
                                highlight(changing.old, 3, changing.new, "#ff0000");
                            }
                            keyColor(changed, "dimgrey");
                            if (changing.old in attempts) {
                                keyColor(attempts[changing.old], "dimgrey");
                                status.style.color = "#201c1c";
                            }
                            keyColor(ignore, "#201c1c");
                        }, 1000);
                        setTimeout(function(){
                            if (response.complete == false) {
                                changing.changed = false; 
                                changing.replaced = false; 
                                changing.confirmed = false;
                            }
                            lives[response.lives].classList.add("animation");
                            lives[response.lives].style.opacity = 0;
                        }, 1100);
                    });
                }
    
            }
        }
    }
    const container = document.getElementById("cryptogramContainer");
    const status = document.getElementById("status");
    const del = document.getElementById("del");
    const changing = new Object();
    const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let keyboardContainer = document.getElementById("keyboardContainer");
    keyboardContainer.style.maxWidth = "500px";
    let cryptogramText = document.getElementById("cryptogram");
    var ignore = [];
    var changed = [];
    var attempts = {};
    setTimeout(function(){
        for (let i = 0; i < alpha.length; i++) {
            if (!cryptogramText.innerHTML.includes(alpha[i])) {
                ignore.push(alpha[i]);
            }
        }
        for (let i = 0; i < replaced.length; i++) {
            highlight(replaced[i][0], 5, replaced[i][1], "#00ff00");
            changed.push(replaced[i][1]);
            ignore.push(replaced[i][0]);
        }
        keyColor(ignore, "#201c1c");
        for (let i = 0; i < failed.length; i++) {
            if (failed[i][0] in attempts) {
                attempts[failed[i][0]].push(failed[i][1]);
            }
            else {
                attempts[failed[i][0]] = [failed[i][1]];
            }
            
        }
        var keys = document.querySelectorAll('.keyboard-button');
        for (var i = 0; i < keys.length; i++) {
            keys[i].addEventListener("click", function(){
                userAction(this.textContent);
            });
        }
        document.addEventListener("keyup", function(e){
            userAction(e.key);
        });
    }, 900);
    changing.changed = false;
    changing.replaced = false;
    changing.confirmed = false;
    changing.old = '';
    changing.new = '';
    var userText = document.getElementById('inputText');
    let userWriter = new Typewriter(userText, {
        cursor: '<span style="color: #ffffff;">|</span>',
        delay: 20,
        deleteSpeed: 15
    });
    userWriter.start();
    userWriter.typeString('Letter to replace: ');
});