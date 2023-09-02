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
    var page = 0;
    let example = document.getElementById("cryptogram");
    let tips = document.getElementById("tips");
    const exampleText = "AUR JFR HO QLZNAHBLKVF OHL RSARLAKDSVRSA MKARF PKQT AH AUR VDMMXR KBRF, IURLR VHSTF NXKZRM AURV AH NKFF ADVR."
    const solution = "THE USE OF CRYPTOGRAMS FOR ENTERTAINMENT DATES BACK TO THE MIDDLE AGES, WHERE MONKS PLAYED THEM TO PASS TIME."
    const tipsText = 'NDG EQWZ "VWXTNQIWSJ" HC S VWXTNQIWSJ LQW LQWNX-GHIDN QNDGW GUIOHCD EQWZC.'
    const tipsSolution = 'THE WORD "CRYPTOGRAM" IS A CRYPTOGRAM FOR FORTY-EIGHT OTHER ENGLISH WORDS.'
    example.style.display = "none";
    let hider = document.getElementById("hider");
    let left = document.getElementById("left");
    let right = document.getElementById("right");
    var userText = document.getElementById('inputText');
    let userWriter = new Typewriter(userText, {
        cursor: '<span style="color: #ffffff;">|</span>',
        delay: 30,
    });
    let msg0 = `
    Every day, there is a new puzzle in accordance with the day's theme:
    <span style="color: #00ff00;"><br>Mon: Fun Fact<br>Tue: Quote<br>
    Wed: Joke<br>Thu: Proverb<br>Fri: Pun<br>Sat: Riddle<br>Sun: Haiku</span>
    `;
    let msg1 = `
    The puzzles are cryptograms. To form
    them, each letter is replaced by a different letter,
    encoding meaning into gibberish. It's your job to figure
    out what the original letters are!
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
    a question, it's probably one of "Who, What, When, Where, "Why").
    `;
    let msg5 = `
    Look for common letters, which are often things like "E, T, S, R". Don't forget
    the vowels!
    `;
    let msg6 = `
    Finally, fill in the blanks. Use context clues!
    `;
    let msg7 = `
    Some other tips include checking for double letters (often "EE", "LL", "SS, etc.),
    common combos (ex. "TH", "ED"), and carefully thinking ahead. There's many more strategies out
    there to discover. Have fun!
    `;
    userWriter.start();
    userWriter.typeString(msg0);
    let buttons = [left, right];
    left.style.display = "none";
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
                if (page == 0) {
                        buttons[1].style.backgroundColor = "#0000ff"
                        userWriter = new Typewriter(userText, {
                        cursor: '<span style="color: #ffffff;">|</span>',
                        delay: 30,
                    });
                    userWriter.start();
                    userWriter.typeString(msg1);
                    buttons[1].style.fontSize = "20px";
                    buttons[1].innerHTML = "See<br>Example";
                    buttons[0].style.display = "block";
                    page = 1;
                } else if (page == 1) {
                    page = 2;
                    if (i == 0) {
                        let userWriter = new Typewriter(userText, {
                            cursor: '<span style="color: #ffffff;">|</span>',
                            delay: 30,
                        });
                        userWriter.start();
                        userWriter.typeString(msg0);
                        buttons[0].style.backgroundColor = "#0000ff"
                        buttons[0].style.opacity = 0;
                        buttons[1].style.fontSize = "25px";
                        buttons[1].innerHTML = "Next";
                        page = 0;
                        setTimeout(function(){
                            buttons[0].style.display = "none";
                        }, 1000);
                    }
                    if (i == 1) {
                        buttons[1].style.backgroundColor = "#0000ff"
                        buttons[1].innerHTML = "Tips"
                        buttons[1].style.fontSize = "25px"
                        example.innerHTML = exampleText;
                        let userWriter = new Typewriter(userText, {
                            cursor: '<span style="color: #ffffff;">|</span>',
                            delay: 30,
                        });
                        userWriter.start();
                        userWriter.typeString("");
                        hider.style.display = "block"
                        example.style.display = "block";
                        exampler(example, exampleText, solution);
                        setTimeout(function(){
                            hider.style.display = "none"
                            userWriter.stop().pauseFor(1).start().typeString(msg2); 
                        }, 23000);
                    }
                } else if (page == 2) {
                    if (i == 0) {
                        buttons[0].style.backgroundColor = "#0000ff"
                        hider.style.display = "none"
                        example.style.display = "none";
                        userWriter = new Typewriter(userText, {
                            cursor: '<span style="color: #ffffff;">|</span>',
                            delay: 30,
                        });
                        userWriter.start();
                        userWriter.typeString(msg1);
                        buttons[1].style.fontSize = "20px";
                        buttons[1].innerHTML = "See<br>Example";
                        page = 1;
                    }
                    if (i == 1) {
                        example.style.display = "none";
                        tips.style.display = "block";
                        hider.style.display = "none";
                        buttons[1].style.backgroundColor = "#0000ff";
                        buttons[1].innerHTML = "Play!";
                        example.innerHTML = tipsText;
                        userWriter = new Typewriter(userText, {
                            cursor: '<span style="color: #ffffff;">|</span>',
                            delay: 10,
                            deleteSpeed: 1
                        });
                        userWriter.start();
                        userWriter.typeString(msg3);
                        userWriter.deleteChars(100);
                        userWriter.typeString(msg4);
                        userWriter.deleteChars(170);
                        userWriter.typeString(msg5);
                        userWriter.deleteChars(120);
                        userWriter.typeString(msg6);
                        setTimeout(function(){
                            userText.style.fontSize = "19px";
                        }, 9000);
                        setTimeout(function(){
                            userText.style.fontSize = "23px";
                        }, 26000);
                        setTimeout(function(){
                            userWriter.stop().pauseFor(1).start().deleteChars(60);
                            userText.style.fontSize = "16px";
                            userWriter.typeString(msg7);
                        }, 46000);
                        setTimeout(exampler, 3500, tips, "SHC", "AIS");
                        setTimeout(exampler, 17000, tips, "NDG", "THE");
                        setTimeout(exampler, 30000, tips, "WQ", "RO");
                        setTimeout(exampler, 38000, tips, "LIEZUIOVXTJ", "FGWDNGLCYPM");
                    }
                }

            })
        }
    }, 0);
});