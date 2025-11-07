function decodeBase64(str) {
  try {
    return atob(str);
  } catch {
    return "(desconocido)";
  }
}

// Obtener parámetros y decodificar nombres
function getDecodedNames() {
  const params = new URLSearchParams(window.location.search);
  const data = params.get("data");

  if (!data) return { dador: null, receptor: null };

  const [userEncoded, toEncoded] = data.split(".");
  const dador = decodeBase64(userEncoded);
  const receptor = decodeBase64(toEncoded);
  return { dador, receptor };
}

const { dador, receptor } = getDecodedNames();
const countdownEl = document.getElementById("countdown");
const revealEl = document.getElementById("reveal");
const nombreEl = document.getElementById("nombre");
const imagenEl = document.getElementById("imagen");
const introEl = document.getElementById("intro");

// Si los datos son inválidos, muestra error y corta
if (!dador || !receptor) {
  document.body.innerHTML = "<h2>⚠️ Enlace inválido o corrupto.</h2>";
} else {
  let count = 10; // cuenta atrás en segundos

  window.addEventListener("load", () => {
    setTimeout(() => {
      introEl.classList.add("hidden");
      countdownEl.classList.remove("hidden");
      const timer = setInterval(() => {
        countdownEl.textContent = count;
        count--;
        if (count < 0) {
          clearInterval(timer);
          countdownEl.classList.add("hidden");
          revealEl.classList.remove("hidden");
          nombreEl.textContent = receptor;
          imagenEl.src = `./Amigos/${receptor}.jpg`;
        }
      }, 1000);
    }, 2000); // espera 2s antes de iniciar la cuenta atrás (puedes ajustar)
  });
}
