const debug = false;
function log(txt, color = "rgb(196, 255, 186)", time = 0, type = false) {
    if (debug) time = 0;
    let t = document.createElement('h1');
    t.style.setProperty('color', color, 'important');
    setTimeout(function () {
        terminal.appendChild(t);
        if (type == 2) {
            t.classList.add("typing");
        }
        if (type == 1) {
            t.classList.add("typingfast");
        }
        t.innerHTML = txt;
        window.scrollBy(0, 1000);
    }, time);
    return t;
}

function cmd(prefix, command, listener, time) {
    if (debug) time = 0;
    let newcmd = log(prefix, 0, time); time += 1000;
    let lsla = document.createElement('span');
    lsla.classList.add("click");
    lsla.innerHTML = command;
    lsla.addEventListener("click", listener)
    setTimeout(function () { newcmd.appendChild(lsla); }, time);
}

function typer(elem, txt, speed) {
    if (elem.innerHTML.length != txt.length) {
        elem.innerHTML += txt.charAt(elem.innerHTML.length);
        setTimeout(function () { typer(elem, txt) }, speed)
    }
}