const express = require("express");
const fs = require("fs");
const sharp = require("sharp");
const ejs = require("ejs");
const sass = require("sass");
app= express();

app.set("view engine","ejs");


app.use("/resurse", express.static(__dirname+"/resurse"))

console.log("Director proiect:",__dirname);

app.get(["/", "/index", "/home"], function(req, res){
    //res.sendFile(__dirname+"/index1.html");
    res.render("pagini/index", {ip:req.ip, imagini:obImagini.imagini});
})

app.get("/other", function(req, res){
    //res.sendFile(__dirname+"/index1.html");
    res.render("pagini/other", {ip:req.ip, imagini:obImagini.imagini});
})

app.get("/eroare", function(req, res)
{
    randeazaEroare(res, 1, "ayothepizzabruh");
})

app.get("*/galerie-animata.css", function(req, res)
{
    var sirScss = fs.readFileSync(__dirname + "/resurse/scss/galerie_animata.scss").toString("utf8");
    var culori=["red","purple","darkblue","black"];
    var indiceAleator=Math.floor(Math.random()*culori.length);
    var culoareAleatoare = culori[indiceAleator];
    rezScss=ejs.render(sirScss,{culoare:culoareAleatoare});
    console.log(rezScss);
    var caleSass = __dirname + "/temp/galerie_animata.scss";
    fs.writeFileSync(__dirname + "/temp/galerie_animata.scss", rezScss);
    try{
        rezCompilare = sass.compile(caleSass,{sourceMap:true});
        var caleCss = __dirname + "/temp/galerie_animata.css";
        fs.writeFileSync(caleCss,rezCompilare.css);
        res.setHeader("Content-Type", "text/css");
        res.sendFile(caleCss);
    }
    catch (err){
        console.log(err);
        res.send("Eroare");

    }
})


app.get("/*.ejs", function(req, res){
    //res.sendFile(__dirname+"/index1.html");
    randeazaEroare(res, 403);
})

/*
app.get("/despre", function(req, res){
    //res.sendFile(__dirname+"/index1.html");
    res.render("pagini/despre");
})
*/
app.get("/ceva", function(req, res, next){
    res.write("<p style='color:pink'>Salut-1</p>");
    console.log("1");
    next();
    //res.end();
})
app.get("/ceva", function(req, res, next){
    res.write("Salut-2");
   
    console.log("2");
    next();
})

app.get("/*", function(req, res){
    //res.sendFile(__dirname+"/index1.html");
    //res.status(404).render("pagini/404");
    randeazaEroare(res, 404);
})

// app.get("/*", function(req, res){
//     res.render("pagini"+req.url, function(err, rezRender){
//         if (err){
//             if(err.message.includes("Failed to lookup view")){
//                 console.log(err);
//                 res.status(404).render("pagini/404");
//             }
//             else{
                
//                 res.render("pagini/eroare_generala");
//             }
//         }
//         else{
//             console.log(rezRender);
//             res.send(rezRender);
//         }
//     });
   
    //console.log("generala:",req.url);
    // res.end();
// })



function creeazaImagini(){
    var buf=fs.readFileSync(__dirname+"/resurse/json/galerie.json").toString("utf8");
    obImagini=JSON.parse(buf);//global
    //console.log(obImagini);
    for (let imag of obImagini.imagini){
        let nume_imag, extensie;
        [nume_imag, extensie ]=imag.fisier.split(".")// "abc.de".split(".") ---> ["abc","de"]
        let dim_mic=150
        let dim_med=300
        imag.mic=`${obImagini.cale_galerie}/mic/${nume_imag}-${dim_mic}.webp` //nume-150.webp // "a10" b=10 "a"+b `a${b}`
        //console.log(imag.mic);

        imag.mare=`${obImagini.cale_galerie}/${imag.fisier}`;
        if (!fs.existsSync(imag.mic))
            sharp(__dirname+"/"+imag.mare).resize(dim_mic).toFile(__dirname+"/"+imag.mic);

        imag.med=`${obImagini.cale_galerie}/med/${nume_imag}-${dim_med}.png`
        if (!fs.existsSync(imag.med))
            sharp(__dirname+"/"+imag.mare).resize(dim_med).toFile(__dirname+"/"+imag.med);
            

        
    }
    console.log(obImagini);

}

creeazaImagini();

function creeazaErori(){
    var buf=fs.readFileSync(__dirname+"/resurse/json/erori.json").toString("utf8");
    obErori=JSON.parse(buf);//global -- nu are var inainte
    console.log(obErori);
    
}

function randeazaEroare(res, identificator, titlu, text, imagine)
{
    var eroare = obErori.erori.find(function (elem) {return identificator == elem.identificator })
    titlu = titlu || (eroare && eroare.titlu) || "EROARE - how did we get here";
    text = text || (eroare && eroare.text) || "this is an error. not good.";
    imagine = imagine || (eroare && obErori.cale_baza + "/" + eroare.imagine) || "resurse/imagini/erori/interzis.png";
    console.log(eroare);
    if (eroare && eroare.status)
        res.status(eroare.identificator).render("pagini/eroare_generala", {titlu: eroare.titlu, text: eroare.text, imagine: obErori.cale_baza + "/" + eroare.imagine});
    else
        res.render("pagini/eroare_generala", {titlu: titlu, text: text, immagine: imagine});
    console.log(obErori.cale_baza + "/" + eroare.imagine);
}
creeazaErori();



app.listen(8080);
console.log("A pornit");