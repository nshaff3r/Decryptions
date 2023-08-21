document.addEventListener("DOMContentLoaded", function(){
    var text = document.getElementById('text');
    var typewriter = new Typewriter(text, {
        cursor: '<span style="color: #ffffff;">|</span>',
        delay: 150
    });
    typewriter.start()
    typewriter.typeString('Welcome. Have you played before?')
});