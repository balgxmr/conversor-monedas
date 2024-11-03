// Función para realizar la conversión de moneda
const convertirMoneda = async (evento) => {
  evento.preventDefault();

  try {
    const respuesta = await fetch("https://mindicador.cl/api/");
    const datos = await respuesta.json();

    const montoPesos = document.querySelector("#valor").value;
    const tipoMoneda = document.querySelector("#inputMoneda").value;

    document.querySelector("#tipoMoneda").textContent = tipoMoneda;

    let conversion = 0;
    if (tipoMoneda === "dolar") {
      conversion = montoPesos / datos.dolar.valor;
      document.querySelector("#numero").textContent = `$${conversion.toFixed(2)}`;
    } else if (tipoMoneda === "euro") {
      conversion = montoPesos / datos.euro.valor;
      document.querySelector("#numero").textContent = `€${conversion.toFixed(2)}`;
    } else if (tipoMoneda === "bitcoin") {
      conversion = montoPesos / datos.bitcoin.valor;
      document.querySelector("#numero").textContent = `₿${conversion.toFixed(2)}`;
    }

    mostrarHistorial(tipoMoneda);
  } catch (error) {
    document.querySelector("#numero").textContent = "Error en la conversión";
    console.error("Ocurrió un error:", error);
  }
};

// Función para obtener el historial de los últimos 10 días de la moneda
async function mostrarHistorial(monedaSeleccionada) {
  try {
    const respuesta = await fetch(`https://mindicador.cl/api/${monedaSeleccionada}/2024`);
    const datos = await respuesta.json();

    const historial = datos.serie.slice(0, 10).map((registro) => {
      const fecha = new Date(registro.fecha).toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "2-digit",
      });

      return {
        fecha,
        valor: registro.valor,
      };
    });

    renderizarGrafico(historial, monedaSeleccionada);
  } catch (error) {
    console.error("Error al obtener el historial:", error);
  }
}

// Función para renderizar el gráfico con Chart.js
let grafico;
function renderizarGrafico(historial, moneda) {
  const contexto = document.getElementById("grafica");

  if (grafico) {
    grafico.destroy();
  }

  grafico = new Chart(contexto, {
    type: "line",
    data: {
      labels: historial.map((item) => item.fecha),
      datasets: [
        {
          label: `Últimos 10 días de ${moneda}`,
          data: historial.map((item) => item.valor),
          fill: false,
          borderColor: "blue",
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
}
