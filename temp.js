let x = [1234,65,12654,34,3456,44,4,444,42];



console.log(x.toString());
/*
function fun() {
    try {
        throw "error of func";
    } catch (e) {
        throw "error of func (catched)";
    }
}


try {
    console.log("start");
    fun();
    throw "Divide by Zero";
} catch (error) {
    console.log(error);
}

*/



/*const fs = require("fs");

const files = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const f of files) {
    let str = String(fs.readFileSync("./commands/" + f));
    while ( str.includes("para[\'message\']") ) 
        str = str.replace("para[\'message\']", "message");
    while ( str.includes("para[\'args\']") ) 
        str = str.replace("para[\'args\']", "args");
    while ( str.includes("para[\'bot\']") ) 
        str = str.replace("para[\'bot\']", "bot");
    fs.writeFileSync("./commands/" + f, str);
}

console.log("DONE!");*/