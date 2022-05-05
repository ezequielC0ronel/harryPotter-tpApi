// a.- Use una imagen por defecto para los personajes que no tengan imagen. [ X ]

// b.- Realice un formulario que permita listar en formato de 3 columnas
// los personajes segun sean magos o no y si han nacido despues de una determinada fecha. [ X ]

// Nota: Agrege un check para decidir si recuperar o no los que no dispongan de fecha de nacimiento. [ X ]

// c.- Actualice las cards para que los personajes que están muertos aparezcan con una X roja sobre la card. [ x ]

// d.- Haga que cuando pasa el mouse por arriba de una imagen de personaje se
// muestre un cartel que muestre la casa (house) del personaje o sino pertenece a una casa diga "sin casa". [ x ]

let fechaNacimiento = document.querySelector("#fecha-nacimiento");

function formatearADate(string) {
  let stringFormateado = string.split("-").reverse();
  return stringFormateado.join("-");
}

function mostrarPersonajesFiltrados() {
  fetch("http://hp-api.herokuapp.com/api/characters")
    .then((response) => response.json())
    .then((data) => {
      //Traemos todos los personajes que han nacido en esa fecha (en adelante)
      let fechaInput = fechaNacimiento.value;
      if (fechaInput != "") {
        data = data.filter((personaje) => {
          let fechaPersonaje = formatearADate(personaje.dateOfBirth);
          let sinFechaNacimiento = document.querySelector("#sin-fecha");

          if (sinFechaNacimiento.checked) {
            if (fechaPersonaje >= fechaInput || fechaPersonaje == "") {
              return personaje;
            }
          }

          if (fechaPersonaje >= fechaInput) {
            return personaje;
          }
        });

        //Filtramos por magos o no magos
        let soloMagos = document.querySelector("#solo-magos");
        let noMagos = document.querySelector("#no-magos");

        if (soloMagos.checked) {
          data = data.filter((personaje) => {
            if (personaje.wizard) {
              return personaje;
            }
          });
        }

        if (noMagos.checked) {
          data = data.filter((personaje) => {
            if (!personaje.wizard) {
              return personaje;
            }
          });
        }

        //Creamos las card
        let cards = data.map((personaje) => {
          let card = document.createElement("div");
          let infoPersonaje = document.createElement("div");
          let casaPersonaje = document.createElement("div");
          let nombre = document.createElement("p");
          let isDead = document.createElement("img");

          let imageURL;
          if (personaje.image == "") {
            imageURL =
              "https://us.123rf.com/450wm/tuktukdesign/tuktukdesign1606/tuktukdesign160600119/59070200-icono-de-usuario-hombre-perfil-hombre-de-negocios-avatar-icono-persona-en-la-ilustraci%C3%B3n-vectorial.jpg";
          } else {
            imageURL = personaje.image;
          }

          let house;
          if (personaje.house == "") {
            house = "Sin casa";
          } else {
            house = personaje.house;
          }

          if (!personaje.alive) {
            isDead.setAttribute("class", "isDead");
            isDead.setAttribute("src", "./static/red-x-674647.png");
            card.appendChild(isDead);
          }

          card.style.backgroundImage = `url("${imageURL}")`;
          card.setAttribute("class", "card");

          nombre.innerText = `${personaje.name}`;

          infoPersonaje.setAttribute("class", "infoPersonaje");
          infoPersonaje.append(nombre);

          casaPersonaje.innerHTML=`<p>${house}</p>`;
          casaPersonaje.setAttribute("class", "casa-personaje");

          card.append(infoPersonaje, casaPersonaje);

          card.addEventListener("mouseenter", () => {
            casaPersonaje.style.visibility = "visible";
          });

          card.addEventListener("mouseleave", () => {
            casaPersonaje.style.visibility = "hidden";
          });


          return card;
        });

        let cardsContainer = document.querySelector("#cards");
        cardsContainer.innerHTML = "";
        cards.forEach((card) => {
          cardsContainer.appendChild(card);
        });
      }
    });
}
