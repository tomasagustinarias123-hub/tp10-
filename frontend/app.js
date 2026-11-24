// Buscamos los elementos de la pantalla para poder modificarlos
const textoEstado = document.getElementById("texto-estado");
const cajaRespuesta = document.getElementById("caja-respuesta");
const botones = document.querySelectorAll("button[data-comando]");

// Función que envía la orden al servidor
async function enviarComando(nombreComando) {
  // 1. Bloqueamos los botones para que no hagas doble clic por accidente
  botones.forEach((btn) => (btn.disabled = true));
  textoEstado.textContent = `Enviando comando: "${nombreComando}"...`;

  try {
    // 2. Hacemos la petición POST al servidor
    const respuesta = await fetch("/api/comando", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Avisamos que mandamos JSON
      },
      body: JSON.stringify({
        comando: nombreComando, // El dato que viaja al servidor
      }),
    });

    // 3. Leemos lo que contestó el servidor
    const datos = await respuesta.json();

    // Si el servidor devolvió un error (ej. 400 o 500), saltamos al catch
    if (!respuesta.ok) {
      throw new Error(datos.mensaje || `Error del servidor (${respuesta.status})`);
    }

    // 4. Mostramos en la página que salió todo bien
    textoEstado.textContent = `Éxito: Comando "${nombreComando}" ejecutado.`;
    cajaRespuesta.textContent = JSON.stringify(datos, null, 2);
  } catch (error) {
    // Si se cortó el Wi-Fi o el servidor está apagado, avisamos acá
    textoEstado.textContent = `Error al enviar: ${error.message}`;
    cajaRespuesta.textContent = "";
  } finally {
    // 5. Volvemos a habilitar los botones
    botones.forEach((btn) => (btn.disabled = false));
  }
}

// Conectamos cada uno de los 5 botones con la función
botones.forEach((boton) => {
  boton.addEventListener("click", () => {
    const comando = boton.getAttribute("data-comando");
    enviarComando(comando);
  });
});