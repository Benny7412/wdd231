const year = new Date().getFullYear();
let oLastModif = new Date(document.lastModified);

document.querySelector("#currentyear").textContent = "\u00A9" + " " + year;
document.querySelector("#lastModified").textContent = oLastModif;
