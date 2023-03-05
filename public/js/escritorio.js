// Referencias HTML
const lblEscritorio = document.querySelector("h1");
const btnAtender = document.querySelector("button");
const lblTicket = document.querySelector("small");
const divAlerta = document.querySelector(".alert");
const lblPendientes = document.querySelector("#lblPendientes");

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has("escritorio")) {
    window.location = "index.html";
    throw new Error("El escritorio es obligatorio");
}

const escritorio = searchParams.get("escritorio");
lblEscritorio.innerHTML = escritorio;

divAlerta.style.display = "none";

const socket = io();

socket.on("connect", () => {
    btnAtender.disabled = false;
});

socket.on("disconnect", () => {
    btnAtender.disabled = true;
});

socket.on("ultimo-ticket", (ultimoTicket) => {
    // lblNuevoTicket.innerHTML = `Ticket ${ultimoTicket}`;
});

socket.on("tickets-pendientes", (ticketsPendientes) => {
    if (ticketsPendientes === 0) {
        lblPendientes.innerHTML = "none";
    } else {
        lblPendientes.innerHTML = "";
        lblPendientes.innerHTML = ticketsPendientes;
    }
});

btnAtender.addEventListener("click", () => {
    socket.emit("atender-ticket", { escritorio }, ({ ok, ticket, msg }) => {
        if (!ok) {
            lblTicket.innerText = "Nadie.";
            return (divAlerta.style.display = "");
        }

        lblTicket.innerText = `Ticket ${ticket.numero}`;
    });
});