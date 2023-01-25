let total = 0;
let carrito = [];
let buscador = document.querySelector("#buscador");
let botonBuscar = document.querySelector("#botonBuscar");
let productos = 0;
const card = document.getElementById("cards");
let numeroProductos = document.querySelector("#productos");
let valorProductos = document.querySelector("#valorTotal");
let productosCarrito = document.querySelector("#productosCarrito");

// Función flecha para calcular el IVA (en ARG es el 60%)
const iva = (a) => a * 1.6;

// Función que recibe la información de los productos desde un JSON y las almacena en local storage, crea las CARDs y hace de buscador
const crearCard = () => {
  let contador = 0;
  card.innerHTML = "";
  fetch("./productos.json")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((producto) => {
        let id = producto.id;
        let nombre = producto.nombre;
        let precio = producto.precio;
        let url = producto.url;
        const objeto = { id: id, nombre: nombre, precio: precio, url: url };
        localStorage.setItem(id, JSON.stringify(objeto));
      });
    });
  // Aprovechamos la funcion buscador para crear las CARDs y no duplicar código
  const textoBuscado = buscador.value.toLowerCase();
  for (let i = 1; i < localStorage.length + 1; i++) {
    let { id, nombre, precio, url } = JSON.parse(localStorage.getItem(i));
    let minus = nombre.toLowerCase();
    if (minus.indexOf(textoBuscado) !== -1) {
      contador++;
      card.innerHTML += `<div class="card flex-wrap m-2" style="width: 12rem; height: 27rem">
            <img src="${url}" class="card-img-top" alt="...">
            <div class="card-body text-center align-items-center">
              <h5 class="card-title">${nombre}</h5>
              <p class="card-text">$ ${precio}</p>
              <a href="#" class="btn btn-primary botonAnadir" marcador="${id}">Añadir</a>
            </div></div>`;
    }
  }
  if (card.innerHTML === "") {
    card.innerHTML += `<h2>Producto no encontrado 😅</h2>`;
  }

  let boton = document.getElementsByClassName("botonAnadir");
  for (let i = 0; i < contador; i++) {
    boton[i].addEventListener("click", anadir);
    boton[i].addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }
  numeroProductos.innerHTML = `${productos.toString()}`;
};

// Función para añadir productos al carrito
const anadir = (e) => {
  let id = e.target.getAttribute("marcador");
  carrito.push(id);
  let nombre = JSON.parse(localStorage.getItem(parseInt(id))).nombre;
  imprimirAHTML(carrito);
  Toastify({
    text: nombre + " añadido",
    duration: 1500,
    position: "center",
    style: {
      background: "linear-gradient(to right, #00b09b, #0ba552)",
    },
  }).showToast();
  productos++;
  numeroProductos.innerHTML = `${productos.toString()}`;
};

// Función para eliminar productos del carrito
const eliminar = (e) => {
  let id = e.target.getAttribute("marcador");
  let posicion = carrito.indexOf(id.toString());
  let nombre = JSON.parse(localStorage.getItem(parseInt(id))).nombre;
  if (carrito.length >= 1 && posicion != -1) {
    Toastify({
      text: nombre + " eliminado",
      duration: 1500,
      position: "center",
      style: {
        background: "linear-gradient(to right, #8c0022, #9c0026)",
      },
    }).showToast();
    productos--;
    numeroProductos.innerHTML = `${productos.toString()}`;
  }
  if (posicion != -1) {
    carrito.splice(posicion, 1);
  }
  imprimirAHTML(carrito);
};

// Función para dibujar el carrito, busca la info en el storage local
const imprimirAHTML = (carro) => {
  let contador = 0;
  let total = 0;
  let carroReducido = carro.reduce(function (acc, el) {
    acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {});
  productosCarrito.innerHTML = "";
  for (let ids of Object.keys(carroReducido)) {
    let { id, nombre, precio, url } = JSON.parse(
      localStorage.getItem(parseInt(ids))
    );
    let cantidad = carroReducido[ids];
    total += precio * carroReducido[ids];
    productosCarrito.innerHTML += `<div class="d-flex column no-gutters justify-content-around m-2">
                <img src="${url}" style="width: 4rem; margin-top: 0.2rem" alt="">
                <div class="card-body text-center align-items-center">
                    <h5>${nombre}</h5>
                    <p>Cantidad: ${cantidad}</p>
                    <p>Precio: ${precio * cantidad}</p>
                </div>
                <div class="d-flex column align-items-center">
                    <a href="#" class="btn btn-primary botonAnadir m-1" marcador="${id}">+</a>
                    <a href="#" class="btn btn-danger botonEliminar m-1" marcador="${id}">-</a>
                </div>
            </div>`;
    contador++;
  }
  let boton = document.getElementsByClassName("botonAnadir");
  for (let i = 0; i < contador; i++) {
    boton[i].addEventListener("click", anadir);
    boton[i].addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }
  let boton2 = document.getElementsByClassName("botonEliminar");
  for (let i = 0; i < contador; i++) {
    boton2[i].addEventListener("click", eliminar);
    boton2[i].addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }
  valorCarrito(total);
};

const vaciarCarro = () => {
  carrito = [];
  imprimirAHTML(carrito);
};
// Función de costos del carrito
let valorTotal = document.createElement("nav");
const valorCarrito = (total) => {
  if (total == 0) {
    productosCarrito.innerHTML = "";
    valorTotal.innerHTML =
      '<h6 class="text-center">Carrito vacío ☹. ¡Añade algo!</h6>';
  } else {
    valorTotal.innerHTML = `<h5 class="text-center">Total (+IVA): $ ${iva(
      total
    )} </h5>`;
  }
  productosCarrito.appendChild(valorTotal);
};

// Añadir los eventos para escuchar el buscador de la página
botonBuscar.addEventListener("click", crearCard);
buscador.addEventListener("keyup", crearCard);

crearCard();
