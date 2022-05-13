const divTimeLine = document.querySelector(".timeline")
const btnNbJoueurs = document.getElementById("btnNbJoueurs")
const btnCommencer = document.getElementById("btnCommencer")
const listeJoueurs = []
const TimeLine = []
var carteAJouer = null
var joueurEnCours = -1


function handleClick(event) {
    if (event.target == btnNbJoueurs) {
        validerNbJoueurs(event)
    } else if (event.target == btnCommencer) {
        commencer(event)
    } else if (event.target.className == "insert") {
        const i = Array.from(event.target.parentNode.children).indexOf(event.target) / 2
        if (verifierTimeLine(carteAJouer, i)) {
            document.getElementById("message").textContent = `Bravo ${listeJoueurs[joueurEnCours].pseudo} !`
            listeJoueurs[joueurEnCours].score += 1
            listeJoueurs[joueurEnCours].tdPoints.textContent = listeJoueurs[joueurEnCours].score
            insereTimeLine(carteAJouer)
        } else {
            document.getElementById("message").textContent = `Dommage  ${listeJoueurs[joueurEnCours].pseudo} ...`
        }
        victoire()
    }
}

function validerNbJoueurs(event) {
    const errorNbJoueurs = document.getElementById("errorNbJoueurs")
    const divNbJoueurs = document.getElementById("divNbJoueurs")
    const nbJoueurs = document.getElementById("entryNbJoueurs").value
    if (nbJoueurs < 1) {
        errorNbJoueurs.textContent = "Le nombre de joueur est incorrect."
    } else {
        divNbJoueurs.innerHTML = ""
        for (let i=0; i<nbJoueurs; i++) {
            listeJoueurs.push({nom: "Joueur1", score:0})
            const p = document.createElement("p")
            p.innerHTML = `<label for="pseudoJ${i+1}">Nom du joueur n°${i+1} :</label>`
            p.innerHTML += `<input type="text" id="pseudoJ${i+1}" placeholder="Joueur n°${i+1}"/>`
            divNbJoueurs.appendChild(p)
        }
        btnCommencer.style.display = "inline-block"
    }
}

function commencer(event) {
    /* Création des joueurs */
    for (let i=0; i<listeJoueurs.length; i++) {
        const table = document.querySelector(".scores table")
        const joueur = listeJoueurs[i]
        joueur.pseudo = document.getElementById(`pseudoJ${i+1}`).value || `Joueur n°${i+1}`
        const tr = document.createElement("tr")
        const tdPseudo = document.createElement("td")
        const tdPoints = document.createElement("td")
        tdPseudo.textContent = joueur.pseudo
        tdPoints.textContent = 0
        tr.appendChild(tdPseudo)
        tr.appendChild(tdPoints)
        table.appendChild(tr)
        joueur.tdPoints = tdPoints
    }
    /* Placement des premières cartes */
    const divTitre = document.querySelector(".titre");
    joueurSuivant()
    divTimeLine.appendChild(construireInsert())
    for (let i=0; i<3; i++) {
        insereTimeLine(piocherCarte())
    }
    /* Affichage */
    document.querySelector(".masque").style.display = "None"
}

function joueurSuivant() {
    joueurEnCours = (joueurEnCours+1)%listeJoueurs.length
    const divTitre = document.querySelector(".titre");
    while (divTitre.firstChild) {
      divTitre.removeChild(divTitre.firstChild);
    }
    const h = document.createElement("h2")
    h.textContent = `C'est au tour de ${listeJoueurs[joueurEnCours].pseudo}.`
    divTitre.appendChild(h)
    carteAJouer = piocherCarte()
    divTitre.appendChild(construireCarte(carteAJouer, false))
}

function construireInsert() {
    const div = document.createElement("div")
    div.className = "insert"
    return div
}

function construireCarte(carte, jouee) {
    const div = document.createElement("div")
    div.className = "carte"
    const span = document.createElement("span")
    if (jouee) {
        const h = document.createElement("h3")
        h.textContent = carte.date.slice(0,4)
        console.log(carte.date.slice(0,4))
        div.appendChild(h)
        span.textContent = carte.verso
    } else {
        span.textContent = carte.recto
    }
    div.appendChild(span)
    return div
}

function piocherCarte() {
    const i = Math.floor(Math.random()*cartes.length)
    return cartes.splice(i, 1)[0]
}

function insereTimeLine(carte) {
    /* insérer une carte au bon endroit dans la TimeLine */
    carte.div = construireCarte(carte, true)
    var i=0
    while (i<TimeLine.length && carte.date>TimeLine[i].date) {i++}
    if (i==TimeLine.length) {
        divTimeLine.appendChild(carte.div)
        divTimeLine.appendChild(construireInsert())
    } else {
        const insert = construireInsert()
        divTimeLine.insertBefore(insert, TimeLine[i].div);
        divTimeLine.insertBefore(carte.div, insert);
    }
    TimeLine.splice(i, 0, carte)
}

function verifierTimeLine(carte, i) {
    /* vérifie si la position i est la bonne position de la carte dans la TimeLine */
    if (i == 0) {
        return (carte.date <= TimeLine[0].date)
    } else if (i == TimeLine.length) {
        return (carte.date >= TimeLine[TimeLine.length-1].date)
    } else {
        return (carte.date >= TimeLine[i-1].date && carte.date <= TimeLine[i].date)
    }
}

function victoire() {
    if (cartes.length == 0) {
        var imax = 0
        var max = listeJoueurs[0].score
        for (let i=0; i<listeJoueurs.length; i++) {
            if (listeJoueurs[i].score > max) {
                max = listeJoueurs[i].score
                imax = i
            }
        }
        const gagnant = listeJoueurs[imax].pseudo
        document.querySelector(".titre").innerHTML = `<h1>Bravo ${gagnant} ! Vous avez gagné !</h1>`
        document.querySelectorAll(".insert").forEach(element => {element.style.display = "None"})
        document.getElementById("message").style.display = "None"
    } else if (listeJoueurs[joueurEnCours].score == 10) {
        const gagnant = listeJoueurs[joueurEnCours].pseudo
        document.querySelector(".titre").innerHTML = `<h1>Bravo ${gagnant} !</h1>`
        document.querySelectorAll(".insert").forEach(element => {element.style.display = "None"})
        document.getElementById("message").style.display = "None"
    } else {
        joueurSuivant()
    }
}

btnCommencer.style.display = "None"
document.addEventListener("click", handleClick)
