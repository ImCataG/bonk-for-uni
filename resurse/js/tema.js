window.addEventListener("load", function()
{
    var tema = localStorage.getItem("dark");
        if(tema)
            document.body.classList.add("dark");

    document.getElementById("btn_tema").onclick = function()
    {
        var tema = localStorage.getItem("dark");
        if(tema)
            localStorage.removeItem("dark");
        else
            localStorage.setItem("dark", "true");
        document.body.classList.toggle("dark");
        
    }
})