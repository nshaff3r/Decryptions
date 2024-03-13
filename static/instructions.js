document.addEventListener("DOMContentLoaded", function(){
    // mode 0: highlight letter; mode 1: replace letter
    // mode 2: undo replacement; mode 3: undo replacement and highlight;
    // mode 4: restore replacements
    function highlight(el, letter, mode=0, altLetter='', color="#ffff00")
    {
        var highlighted = `<span style="color: #ffff00;">${letter}</span>`;
        var altHighlighted = `<span style="color: ${color};">${altLetter}</span>`;
        if (mode==0) {
            el.innerHTML = el.innerHTML.replaceAll(letter, highlighted);
            var doubleReplaced = `<span style="color: #00ff00;"><span style="color: #ffff00;">${letter}</span></span>`;
            highlighted = `<span style="color: #00ff00;">${letter}</span>`;
            el.innerHTML = el.innerHTML.replaceAll(doubleReplaced, highlighted);
        } else if (mode==1) {
            el.innerHTML = el.innerHTML.replaceAll(highlighted, altHighlighted);
        } else if (mode==2) {
            el.innerHTML = el.innerHTML.replaceAll(altHighlighted, highlighted);
        } else if (mode==3) {
            el.innerHTML = el.innerHTML.replaceAll(altHighlighted, letter);
        } else {
            el.innerHTML = el.innerHTML.replaceAll(`>${letter}</`, `>~</`);
            el.innerHTML = el.innerHTML.replaceAll(letter, altHighlighted);
            el.innerHTML = el.innerHTML.replaceAll(`>~</`, `>${letter}</`);
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
                    }, 200);
                }, (count + 1) * 1000);
                changed.push(str[i]);
                count++;
            }
        }
    }

    function typeReset()
    {
        let userWriter = new Typewriter(userText, {
            cursor: '<span style="color: #ffffff;">|</span>',
            delay: 20,
            deleteSpeed: 15
        });
        return userWriter;
    }
    var page = 0;
    let example = document.getElementById("cryptogram");
    example.style.display = "none";
    let tips = document.getElementById("tips");
    const exampleText = "AUR JFR HO QLZNAHBLKVF OHL RSARLAKDSVRSA MKARF PKQT AH AUR VDMMXR KBRF, IURLR VHSTF NXKZRM AURV AH NKFF ADVR."
    const solution = "THE USE OF CRYPTOGRAMS FOR ENTERTAINMENT DATES BACK TO THE MIDDLE AGES, WHERE MONKS PLAYED THEM TO PASS TIME."
    const tipsText = 'NDG EQWZ "VWXTNQIWSJ" HC S VWXTNQIWSJ LQW LQWNX-GHIDN QNDGW GUIOHCD EQWZC.'
    let hider = document.getElementById("hider");
    let left = document.getElementById("left");
    let right = document.getElementById("right");
    var userText = document.getElementById('inputText');
    let userWriter = typeReset();
    let msg0 = `
    Decryptions are one of seven possible themes:
    <span style="color: #00ff00;">Fun Fact, Quote, Joke, Proverb, Pun, Riddle, Song Lyric.</span>
    `;
    let msg1 = `
    The puzzles are cryptograms. To form
    them, every letter is replaced by a different letter. For example, every "H"
    might be replaced by a "Q". It's your job to decrypt the gibberish and figure 
    out the original puzzle!
    `;
    let msg2 = `
    Fun, right?
    `;
    let msg3 = `
    Target single and double letter words first,
    since they have the least possibilities.
    `;
    let msg4 = `
    Next, look for three letter words. "The" is often at the beginning (and if it's
    a question, it's probably one of "Who", "What", "When", "Where", "Why").
    `;
    let msg5 = `
    Look for common letters, which are often things like "E", "T", "S", "R". Don't forget
    the vowels!
    `;
    let msg6 = `
    Finally, use context clues. Remember: it starts out hard and gets easier.
    Don't give up!
    `;
    let msg7 = `
    Some other tips include checking for double letters ("EE", "LL", "SS),
    common combos ("TH", "ED"), noting punctiation (apostrophes), and carefully 
    thinking ahead. When you play, you can try different substitutions before hitting
    confirm. Good luck!
    `;

    userWriter.start().typeString(msg0);
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
    window.addEventListener("resize", function(){
        sizing();
        buttons[0].style.marginTop = top;
        buttons[1].style.marginTop = top;
    });
    let buttons = [left, right];
    buttons[0].addEventListener("click", function(){
        setTimeout(function(){
            if (page==7) {
                window.location.href = "/instructions";
            } else {
                window.location.href = "/";
            }
        }, 1000);
        
        setTimeout(function(){
            buttons[0].style.display = "none";
        }, 1100);
    });

    buttons[1].addEventListener("click", function(){
        if (page == 0) {
            buttons[1].style.backgroundColor = "#0000ff"
            userWriter = typeReset();
            userWriter.start().typeString(msg1); 
            buttons[1].style.fontSize = "20px";
            buttons[1].innerHTML = "See<br>Example";
            page = 1;
        } else if (page == 1) {
            page = 2;
            buttons[1].style.backgroundColor = "#0000ff"
            buttons[1].innerHTML = "Tips"
            buttons[1].style.fontSize = "25px"
            example.innerHTML = exampleText;
            userWriter = typeReset();
            userWriter.start().typeString(""); 
            hider.style.display = "block"
            example.style.display = "block";
            exampler(example, exampleText, solution);
            hider.style.display = "none"
            userWriter.stop().pauseFor(1).start().typeString("Check it out:"); 
            setTimeout(function(){
                if (page == 2) {
                    userWriter.stop().pauseFor(1).start().deleteChars(13);
                    userWriter.stop().pauseFor(1).start().typeString(msg2); 
                }
            }, 22000);
        } else if (page == 2) {
            page = 3;
            example.style.display = "none";
            tips.innerHTML = tipsText;
            tips.style.display = "block";
            hider.style.display = "none";
            buttons[1].style.backgroundColor = "#0000ff";
            buttons[1].innerHTML = "Next";
            userWriter = typeReset();
            userWriter.start().typeString(msg3); 
            setTimeout(exampler, 1500, tips, "SHC", "AIS");
        } else if (page == 3) {
            page = 4;
            buttons[1].style.backgroundColor = "#0000ff";
            userWriter = typeReset();
            userWriter.start().typeString(msg4); 
            userText.style.fontSize = "19px";
            setTimeout(exampler, 2500, tips, "NDG", "THE");
        } else if (page == 4) {
            page = 5;
            buttons[1].style.backgroundColor = "#0000ff";
            userWriter = typeReset();
            userWriter.start().typeString(msg5); 
            userText.style.fontSize = "23px";
            setTimeout(exampler, 2000, tips, "WQ", "RO");
        } else if (page == 5) { 
            page = 6;
            buttons[1].style.backgroundColor = "#0000ff";
            userWriter = typeReset();
            userWriter.start().typeString(msg6); 
            userText.style.fontSize = "23px";
            setTimeout(exampler, 1000, tips, "LIEZUIOVXTJ", "FGWDNGLCYPM");
        } else if (page == 6) { 
            page = 7;
            buttons[1].style.backgroundColor = "#0000ff";
            buttons[0].innerHTML = "Reread"
            buttons[1].innerHTML = "Play!"
            userWriter = typeReset();
            userWriter.start().typeString(msg7); 
            userText.style.fontSize = "15px";
        } else if (page == 7) { 
            buttons[1].style.backgroundColor = "#0000ff"
            setTimeout(function(){
                window.location.href = "/";
            }, 500);
        }
    })
    function over(i) {
        if (i == 0){buttons[1 - i].style.marginRight = "-101px";}
        else{buttons[1 - i].style.marginLeft = "-101px";}
        buttons[1 - i].style.opacity = 0;
        buttons[i].style.width = `${Math.min(350, window.innerWidth - 20)}px`;
        buttons[i].style.backgroundColor = "green";
    }
    function out(i) {
        if (i == 1){buttons[1 - i].style.marginLeft = 0;}
        else{buttons[1 - i].style.marginRight = 0;}
        buttons[1 - i].style.opacity = 1;
        buttons[i].style.width = "100px";
        buttons[i].style.backgroundColor = "slategrey";
    }
    setTimeout(function(){
        for (let i = 0; i < 2; i++)
        {
            buttons[i].style.marginTop = top;
            buttons[i].style.opacity = 1;
            buttons[i].addEventListener("mouseover", () => over(i));
            buttons[i].addEventListener("mouseout", () => out(i));
            buttons[i].addEventListener("touchstart", () => over(i));
            buttons[i].addEventListener("click", function(){
                setTimeout(()=>out(i), 2500);
            })
        }
    }, 4300);
});