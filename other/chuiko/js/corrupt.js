let corrupted = document.querySelectorAll(".corrupted")
const gliphs = "!#$%?@§£¥ÄÆĂĄæǄѦЂϕԬԞ֍₡₯₱₩";

function random_str(alphabet, length) {
    var result = '';
    var charactersLength = alphabet.length;
    for ( var i = 0; i < length; i++ ) {
      result += alphabet.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function corrupt() {
    for (let cor of corrupted) {
        let str = random_str(gliphs, cor.innerHTML.length);
        cor.innerHTML = str;
    }
}

function update_corrupted(){
    corrupted = document.querySelectorAll(".corrupted")
}

setInterval(corrupt, 40);
setInterval(update_corrupted, 100);


