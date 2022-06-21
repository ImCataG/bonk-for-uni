window.addEventListener("load", function()
{
    /*triggered by change of range with id inp-value */
    
    document.getElementById("filtrare").onclick = function()
    {
        /*put the value of inp-pret into element with id infoRange */
        var pretmin = document.getElementById("inp-pret").value;

        console.log('filtrez');
        var valNume = document.getElementById("inp-nume").value.toLowerCase();
        var butoaneRadio = document.getElementsByClassName("radios");
        for(let rad of butoaneRadio)
        {
            if(rad.checked)
            {
                var valWeight=rad.value;
                break;
            }
        }
        var minWeight, maxWeight;
        console.log(valWeight);
        if(valWeight != "4")
        {
            console.log(valWeight);
            [minWeight, maxWeight] = valWeight.split(":");
            minWeight = parseInt(minWeight);
            maxWeight = parseInt(maxWeight);
        }
        else
        {
            minWeight = 0;
            maxWeight = 10000;
        }

        var articole = document.getElementsByClassName("produs");
        for(let art of articole)
        {
            art.style.display = 'None';
            let numeArt = art.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
            console.log(numeArt);
            console.log(valNume);
            let cond1 = numeArt.includes(valNume);
            let weightArt = parseFloat(art.getElementsByClassName("val-weight")[0].innerHTML);
            console.log(weightArt);
            let cond2 = (minWeight <= weightArt && weightArt <= maxWeight);

            let pretArt = parseFloat(art.getElementsByClassName("val-pret")[0].innerHTML);
            let cond3 = (pretmin <= pretArt);
            let conditieFinala = cond1 && cond2 && cond3;

            if(conditieFinala) 
                art.style.display = "grid";
        }
    }
    document.getElementById("resetare").onclick = function()
    {
        location.reload();
        // var articole = document.getElementsByClassName("produs");
        // for(let art of articole)
        // {
        //         art.style.display = "grid";
        // }
        // document.getElementById("inp-nume").value = "";
        // document.getElementById("i_rad4").checked = true;
        // document.getElementById("inp-pret").value = 0;
        // document.getElementById("infoRange").innerHTML="(0)";
        // document.getElementById("sel-toate").selected = true;
    }
    function sortare(semn)
    {
        var articole = document.getElementsByClassName("produs");
        var v_articole = Array.from(articole);
        v_articole.sort(function(a,b)
        {
            let pret_a = parseInt(a.getElementsByClassName("val-pret")[0].innerHTML);
            let pret_b = parseInt(b.getElementsByClassName("val-pret")[0].innerHTML);
            let nume_a = a.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
            let nume_b = b.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
            let colorway_a = a.getElementsByClassName("val-colorway")[0].innerHTML.toLowerCase();
            let colorway_b = b.getElementsByClassName("val-colorway")[0].innerHTML.toLowerCase();
            if(pret_a - pret_b)
            return semn*(pret_a - pret_b);
            else 
            if(nume_a.localeCompare(nume_b))
            return semn*(nume_a.localeCompare(nume_b));
            else 
            return semn*(colorway_a.localeCompare(colorway_b)); 
        });

        for(let art of v_articole)
        {
            art.parentElement.appendChild(art);
        }
    }
    document.getElementById("sortCrescNume").onclick = function()
    {
        sortare(1);
    }

    document.getElementById("sortDescrescNume").onclick = function()
    {
        sortare(-1);
    }

    window.onkeydown=function(e)
    {
        console.log(e);
        if(e.key == "c" && e.altKey)
        {
            let p_vechi = document.getElementById("afis_suma");
            if (!p_vechi){ 
            let p = document.createElement("p");
            p.id = "afis_suma";
            let suma = 0;

            var articole = document.getElementsByClassName("produs");
            for (let art of articole)
            {
                if(art.style.display != "none")
                    suma += parseInt(art.getElementsByClassName("val-pret")[0].innerHTML);
            }
            p.innerHTML = suma;
            console.log(p);
            var sect = document.getElementById("produse");
            sect.parentNode.insertBefore(p, sect);
            setTimeout(function()
            {
                let p_vechi = document.getElementById("afis_suma");
                if(p_vechi)
                {
                    p_vechi.remove();
                }
            }, 2000);
            }
        }
    }
})