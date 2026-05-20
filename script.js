const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");

const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");

document.addEventListener("click", (e) => {
  console.log("clicaste em:", e.target);
});

const saveImageBtn = document.getElementById("saveImageBtn") || document.createElement("button");
const saveLibraryBtn = document.getElementById("saveLibraryBtn") || document.createElement("button");
const openLibraryBtn = document.getElementById("openLibraryBtn");

const libraryMenuToggle = document.getElementById("libraryMenuToggle") || document.createElement("button");
const libraryMenu = document.getElementById("libraryMenu") || document.createElement("div");
const backHomeBtn = document.getElementById("backHomeBtn");

const libraryPanel = document.getElementById("libraryPanel");
const libraryList = document.getElementById("libraryList");

const emailInput = document.getElementById("emailInput") || document.createElement("input");
const sendEmailBtn = document.getElementById("sendEmailBtn") || document.createElement("button");


const editable = document.getElementById("editable");
const lencoArea = document.getElementById("lencoArea");
const letterColors = ["#4BA632", "#F2B705", "#F97813", "#169DEA", "#EB117F"];
let wordColors = [];

let selectedLenco = null;

const keyToSymbol = {
  "1": "barco.png",
  "2": "passarinhos.png",
  "3": "flores.png",
  "4": "flores2.png",
  "5": "coracao1.png",
  "6": "coracao2.png",
  "7": "coracao3.png",
  "8": "bicicleta.png",
  "9": "cao.png",
  "0": "chave.png",
  "-": "passarihno4.png",
  "y": "passarinho2.png",
  "z": "passarinho3.png",
  "x": "violao.png"
};

document.getElementById("bottomBar").style.display = 'none';
menuToggle.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});

libraryMenuToggle.addEventListener("click", () => {
    console.log("clicou hamburger");
  libraryMenu.classList.toggle("hidden");
});

if (backHomeBtn) {
  backHomeBtn.addEventListener("click", () => {
    libraryMenu.classList.add("hidden");
    libraryPanel.classList.add("hidden");
    editable.style.visibility = 'visible';
document.getElementById("lencoArea").style.display = 'block';
    document.getElementById("bottomBar").style.display = 'flex';
  });
}
openLibraryBtn.addEventListener("click", () => {
  menu.classList.add("hidden");
  renderLibrary();
  libraryPanel.classList.remove("hidden");
  editable.style.visibility = 'hidden';
  document.getElementById("lencoArea").style.display = 'none';
  document.getElementById("bottomBar").style.display = 'none';
  document.getElementById("menuToggle").style.display = 'none';
  document.getElementById("backHomeBtn2").style.display = 'flex';
});



editable.addEventListener("keydown", (e) => {
  if (keyToSymbol[e.key]) {
    e.preventDefault();
    createDecoration(keyToSymbol[e.key]);
  }
});

function createDecoration(symbol, x = null, y = null) {
  const el = document.createElement("img");
  el.className = "decoration";
  el.src = symbol;
  const startX = x ?? Math.round(Math.random() * (window.innerWidth * 0.8));
  const startY = y ?? Math.round(Math.random() * (window.innerHeight * 0.8));
  el.style.left = `${startX}px`;
  el.style.top = `${startY}px`;
  lencoArea.appendChild(el);
  document.getElementById("bottomBar").style.display = 'flex';
  makeDraggable(el);

 if (!window._tooltipShown) {
    window._tooltipShown = true;
    const toast = document.createElement("div");
    toast.id = "symbolToast";
    toast.textContent = "Toca no símbolo para o editar";
    document.body.appendChild(toast);

    el.addEventListener("click", () => {
      if (toast.parentNode) toast.remove();
    }, { once: true });
  }
}



function makeDraggable(element) {
  let isDragging = false;
  let shiftX = 0;
  let shiftY = 0;
  let currentScale = 1;
  let currentRotate = 0;

  const controls = document.createElement("div");
  controls.className = "decoration-controls hidden";
  controls.innerHTML = `
    <button class="ctrl-btn" data-action="smaller" title="Diminuir">−</button>
    <button class="ctrl-btn" data-action="bigger" title="Aumentar">+</button>
    <button class="ctrl-btn" data-action="rotateLeft" title="Rodar para a esquerda">↺</button>
    <button class="ctrl-btn" data-action="rotateRight" title="Rodar para a direita">↻</button>
    <button class="ctrl-btn" data-action="delete" title="Apagar">✕</button>
  `;
  lencoArea.appendChild(controls);

  function updateTransform() {
    element.style.transform = `scale(${currentScale}) rotate(${currentRotate}deg)`;
  }

  function positionControls() {
    const rect = element.getBoundingClientRect();
    const areaRect = lencoArea.getBoundingClientRect();
    controls.style.left = `${rect.left - areaRect.left}px`;
    controls.style.top = `${rect.top - areaRect.top - 40}px`;
  }

  element.addEventListener("click", (e) => {
    e.stopPropagation();
    document.querySelectorAll(".decoration-controls").forEach(c => c.classList.add("hidden"));
    controls.classList.remove("hidden");
    positionControls();
  });

  document.addEventListener("click", () => {
    controls.classList.add("hidden");
  });

  controls.addEventListener("click", (e) => {
    e.stopPropagation();
    const action = e.target.dataset.action;
    if (action === "smaller") { currentScale = Math.max(0.2, currentScale - 0.1); updateTransform(); positionControls(); }
    if (action === "bigger") { currentScale = Math.min(5, currentScale + 0.1); updateTransform(); positionControls(); }
    if (action === "rotateLeft") { currentRotate -= 15; updateTransform(); positionControls(); }
    if (action === "rotateRight") { currentRotate += 15; updateTransform(); positionControls(); }
    if (action === "delete") { element.remove(); controls.remove(); }
  });

  element.addEventListener("mousedown", (e) => {
    isDragging = true;
    const rect = element.getBoundingClientRect();
    shiftX = e.clientX - rect.left;
    shiftY = e.clientY - rect.top;
    element.classList.add("dragging");
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const areaRect = lencoArea.getBoundingClientRect();
    let left = e.clientX - areaRect.left - shiftX;
    let top = e.clientY - areaRect.top - shiftY;
  const maxLeft = lencoArea.clientWidth;
const maxTop = lencoArea.clientHeight;

left = Math.max(-element.offsetWidth / 2, Math.min(left, maxLeft));
top = Math.max(-element.offsetHeight / 2, Math.min(top, maxTop));
    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
    positionControls();
  });

  document.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    element.classList.remove("dragging");
  });

  element.addEventListener("dragstart", (e) => e.preventDefault());
}

async function captureLenco() {
  menu.classList.add("hidden");
  if (libraryMenu) {
    libraryMenu.classList.add("hidden");
  }

  document.getElementById("lencoArea").style.display = 'block';
  
  document.querySelectorAll(".decoration-controls").forEach(c => c.classList.add("hidden"));

  const canvas = await html2canvas(lencoArea, {
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    scale: 0.5,
    width: lencoArea.offsetWidth,
    height: lencoArea.offsetHeight
  });

  return canvas;
}

saveImageBtn.addEventListener("click", async () => {
  try {
    const canvas = await captureLenco();
    const link = document.createElement("a");
    link.download = "lenco-dos-namorados.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (error) {
    alert("Não foi possível guardar o lenço.");
    console.error(error);
  }
});

saveLibraryBtn.addEventListener("click", async () => {
  try {
    const canvas = await captureLenco();
    const imageData = canvas.toDataURL("image/png");

    const decorations = [...document.querySelectorAll(".decoration")].map((el) => ({
      symbol: el.src,
      left: parseFloat(el.style.left) || 0,
      top: parseFloat(el.style.top) || 0
    }));

    const item = {
      id: Date.now(),
      text: editable.innerText.trim(),
      image: imageData,
      decorations
    };

    const stored = JSON.parse(localStorage.getItem("lencos")) || [];
    stored.unshift(item);
    localStorage.setItem("lencos", JSON.stringify(stored));

    alert("Lenço guardado na biblioteca.");
  } catch (error) {
    alert("Não foi possível guardar na biblioteca.");
    console.error(error);
  }
});

function renderLibrary() {
  const stored = JSON.parse(localStorage.getItem("lencos")) || [];
  libraryList.innerHTML = "";
  selectedLenco = null;

  if (stored.length === 0) {
    libraryList.innerHTML = "<p>Ainda não há lenços guardados.</p>";
    return;
  }

  stored.forEach((item) => {
    const card = document.createElement("div");
    card.className = "library-card";

    card.innerHTML = `
      <img src="${item.image}" alt="Lenço guardado">
      <div class="library-actions">
        <button data-action="delete">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/>
            <path d="M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
          Apagar
        </button>
      </div>
    `;

 card.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "button") return;
  if (card.classList.contains("selected")) {
    card.classList.remove("selected");
    selectedLenco = null;
  } else {
    document.querySelectorAll(".library-card").forEach((c) => {
      c.classList.remove("selected");
    });
    card.classList.add("selected");
    selectedLenco = item;
  }
});

    const deleteBtn = card.querySelector("[data-action='delete']");



   deleteBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  deleteLenco(item.id);
});

    libraryList.appendChild(card);
  });
}

function loadLenco(item) {
  editable.innerText = item.text || "";
  document.querySelectorAll(".decoration").forEach((el) => el.remove());
  (item.decorations || []).forEach((deco) => {
    createDecoration(deco.symbol, deco.left, deco.top);
  });
}

function deleteLenco(id) {
  const stored = JSON.parse(localStorage.getItem("lencos")) || [];
  const updated = stored.filter((item) => item.id !== id);
  localStorage.setItem("lencos", JSON.stringify(updated));
  renderLibrary();
}

sendEmailBtn.addEventListener("click", () => {
  const email = emailInput.value.trim();
  if (!selectedLenco) return;
  if (!email) return;
  popup.classList.remove("hidden");
  document.querySelectorAll(".library-card").forEach((c) => {
    c.classList.remove("selected");
  });
  selectedLenco = null;
});

closePopup.addEventListener("click", () => {
  popup.classList.add("hidden");
});

editable.addEventListener("input", () => {
  const text = editable.innerText;
   if (text.trim().length > 0) {
    document.getElementById("bottomBar").style.display = 'flex';
  } else if (document.querySelectorAll(".decoration").length === 0) {
    document.getElementById("bottomBar").style.display = 'none';
  }

  editable.innerHTML = "";

  const words = text.split(/(\s+)/);
  let wordIndex = 0;

  words.forEach((part) => {
    const isSpace = /^\s+$/.test(part);

    if (!isSpace && part !== "") {
      if (!wordColors[wordIndex]) {
        let newColor;
        do {
          newColor = letterColors[Math.floor(Math.random() * letterColors.length)];
        } while (newColor === wordColors[wordIndex - 1]);
        wordColors[wordIndex] = newColor;
      }

      const wordColor = wordColors[wordIndex];

      [...part].forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char;

        const randomY = Math.floor(Math.random() * 5) - 2;
        const randomRotate = Math.floor(Math.random() * 7) - 3;

        span.style.position = "relative";
        span.style.top = `${randomY}px`;
        span.style.transform = `rotate(${randomRotate}deg)`;
        span.style.display = "inline-block";
        span.style.color = wordColor;

        editable.appendChild(span);
      });

      wordIndex++;
    } else {
      editable.appendChild(document.createTextNode(part));
    }
  });

  wordColors = wordColors.slice(0, wordIndex);
  placeCaretAtEnd(editable);
});

function placeCaretAtEnd(element) {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

document.getElementById("bottomSaveImageBtn").addEventListener("click", () => {
  saveImageBtn.click();
});

document.getElementById("bottomSaveLibraryBtn").addEventListener("click", () => {
  saveLibraryBtn.click();
});


document.getElementById("backHomeBtn2").addEventListener("click", () => {
  libraryPanel.classList.add("hidden");
  editable.style.visibility = 'visible';
  document.getElementById("lencoArea").style.display = 'block';
  document.getElementById("bottomBar").style.display = 'flex';
  document.getElementById("menuToggle").style.display = 'flex';
  document.getElementById("backHomeBtn2").style.display = 'none';
});

document.addEventListener("click", (e) => {
  if (e.target.closest("#openSentaBtn")) {
    window.location.href = "historia.html";
  }
});

document.getElementById("openAsBordadeirasBtn").addEventListener("click", () => {
  window.location.href = "bordadeiras.html";
});

// Código para integração com Arduino via Web Serial API

let port;
let reader;
let arduinoLigado = false;

document.addEventListener("keydown", async (e) => {
  if (e.key !== "Tab") return;
  if (arduinoLigado) return;

  e.preventDefault();

  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    arduinoLigado = true;

    const decoder = new TextDecoderStream();
    port.readable.pipeTo(decoder.writable);
    reader = decoder.readable.getReader();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      if (value.includes("1")) {
        createDecoration(keyToSymbol["1"]);
      }

      if (value.includes("2")) {
        createDecoration(keyToSymbol["2"]);
      }
    }
  } catch (err) {
    console.error("Erro Arduino:", err);
  }
});