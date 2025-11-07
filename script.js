async function sortear() {
  const participantes = await fetch("./data/participantes.json").then(r => r.json());
  const historico = await fetch("./data/historico.json").then(r => r.json());
  const anterior = historico["2025"] || {};

  const nombres = participantes.map(p => p.nombre);
  let asignaciones = {};
  let valido = false;
  let intentos = 0;

  while (!valido && intentos < 1000) {
    intentos++;
    const receptores = [...nombres].sort(() => Math.random() - 0.5);
    valido = true;
    asignaciones = {};

    for (let i = 0; i < nombres.length; i++) {
      const dador = nombres[i];
      const receptor = receptores[i];
      if (dador === receptor || anterior[dador] === receptor) {
        valido = false;
        break;
      }
      asignaciones[dador] = receptor;
    }
  }

  if (!valido) {
    document.getElementById("resultado").innerHTML = "⚠️ No se pudo generar un sorteo válido después de varios intentos.";
    return;
  }

  // Mostrar resultado en pantalla (solo para ti, el “admin”)
  const contenedor = document.getElementById("resultado");
  contenedor.innerHTML = "<h3>Resultado del sorteo:</h3>";
  const lista = document.createElement("ul");

  Object.entries(asignaciones).forEach(([dador, receptor]) => {
    const item = document.createElement("li");
    const token = Math.random().toString(36).substring(2, 8);
    //const enlace = `reveal.html?user=${encodeURIComponent(dador)}&to=${encodeURIComponent(receptor)}&token=${token}`;
    // Codificamos los nombres en Base64
    const userEncoded = btoa(dador);
    const toEncoded = btoa(receptor);

    // Creamos el enlace ocultando los nombres reales
    const enlace = `reveal.html?data=${encodeURIComponent(userEncoded + "." + toEncoded)}&token=${token}`;

    item.innerHTML = `<strong>${dador}</strong> ➜ <a href="${enlace}" target="_blank">Amigo invisible</a>`;
    lista.appendChild(item);
  });

  contenedor.appendChild(lista);
}

document.getElementById("sortear").addEventListener("click", sortear);
