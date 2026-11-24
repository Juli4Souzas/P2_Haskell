<<<<<<< HEAD
import React, { useEffect, useRef } from "react";
=======
import React from "react";
>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)
import { Blob, Limao, Picole, Rabisco, Ramo } from "./organico";

function proximaSecao() {
  const prioridade = document.getElementById("lote-prioritario");
  prioridade.focus({ preventScroll: true });
<<<<<<< HEAD
  prioridade.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
  });
}

export function ControleMovimento({ classe, pausado, alternarMovimento }) {
  const rotulo = pausado ? "Retomar animações" : "Pausar animações";
=======
  prioridade.scrollIntoView();
}

// Pausa ou retoma o prato de sorvete girando (a única animação do site).
export function ControleMovimento({ classe, pausado, alternarMovimento }) {
  const rotulo = pausado ? "Retomar giro do sorvete" : "Pausar giro do sorvete";
>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)
  return <button className={`controle-movimento ${classe}`} type="button"
    aria-label={rotulo} title={rotulo} onClick={alternarMovimento}>
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
      {pausado ? <path d="M5 3l8 5-8 5z"/> : <path d="M4 3h3v10H4zm5 0h3v10H9z"/>}
    </svg>
  </button>;
}

<<<<<<< HEAD
// Camada com profundidade: acompanha o ponteiro com intensidade `f` (em px).
function Camada({ f, className = "", children }) {
  return <div className={`camada ${className}`} style={{ "--f": f }}>{children}</div>;
}

export default function AbreVitrine({ pausado, alternarMovimento }) {
  const visual = useRef(null);
  const quadro = useRef(0);

  useEffect(() => () => cancelAnimationFrame(quadro.current), []);

  function mover(x, y) {
    cancelAnimationFrame(quadro.current);
    quadro.current = requestAnimationFrame(() => {
      visual.current?.style.setProperty("--px", x.toFixed(3));
      visual.current?.style.setProperty("--py", y.toFixed(3));
    });
  }

  function acompanhar(evento) {
    if (pausado || evento.pointerType === "touch") return;
    const caixa = evento.currentTarget.getBoundingClientRect();
    mover(((evento.clientX - caixa.left) / caixa.width - .5) * 2, ((evento.clientY - caixa.top) / caixa.height - .5) * 2);
  }

  return <section className="hero limite" aria-labelledby="titulo-vitrine">
    <div className="hero-intro">
      <h1 id="titulo-vitrine">
        <span className="titulo-linha"><span className="entrada" style={{ "--d": ".15s" }}>Vitrine</span></span>{" "}
        <span className="titulo-linha"><span className="entrada" style={{ "--d": ".3s" }}>do dia</span></span>
      </h1>
      <p className="manuscrito entrada" style={{ "--d": ".75s" }}>
        <span>O que vender primeiro?</span>
        <Rabisco className="rabisco" />
      </p>
      <p className="hero-texto entrada" style={{ "--d": ".95s" }}>Confira o lote prioritário e as próximas validades dos picolés e sorvetes da Pinpinela.</p>
      <button className="botao entrada" style={{ "--d": "1.1s" }} onClick={proximaSecao}>Ver lote prioritário</button>
    </div>
    <div className="hero-visual" ref={visual} onPointerMove={acompanhar} onPointerLeave={() => mover(0, 0)}>
      <Camada f={8}>
        <Blob cor="ouro" className="blob-ouro entrada derramar" style={{ "--d": ".1s" }} pontos={8} amp={.2} vel={.00046} sem={1} />
      </Camada>
      <Camada f={16}>
        <Blob cor="salvia" className="blob-salvia entrada derramar" style={{ "--d": ".3s" }} pontos={8} amp={.2} vel={.00041} sem={3} />
      </Camada>
      <Camada f={26}>
        <Blob cor="rosa" className="blob-rosa entrada derramar" style={{ "--d": ".55s" }} pontos={6} amp={.18} vel={.00058} sem={5} />
      </Camada>
      <Camada f={34}>
        <Limao className="limao ilustracao" />
        <Picole className="picole ilustracao" />
      </Camada>
      <Camada f={12} className="camada-prato">
        <div className="prato-entrada entrada" style={{ "--d": ".45s" }}>
          <img className="prato-giro ciclo" src="/assets/sorvete-rotacao.webp" width="800" height="800"
            alt="Duas bolas de sorvete de morango em um prato de borda azul, visto de cima" />
        </div>
      </Camada>
      <Camada f={44}>
        <Ramo className="ramo ilustracao" />
      </Camada>
=======
// Abertura da Vitrine: título à esquerda e, à direita, manchas e ilustrações
// em camadas com o prato de sorvete girando no meio.
export default function AbreVitrine({ pausado, alternarMovimento }) {
  return <section className="hero limite" aria-labelledby="titulo-vitrine">
    <div className="hero-intro">
      <h1 id="titulo-vitrine">
        <span className="titulo-linha">Vitrine</span>{" "}
        <span className="titulo-linha">do dia</span>
      </h1>
      <p className="manuscrito">
        <span>O que vender primeiro?</span>
        <Rabisco className="rabisco" />
      </p>
      <p className="hero-texto">Confira o lote prioritário e as próximas validades dos picolés e sorvetes da Pinpinela.</p>
      <button className="botao" onClick={proximaSecao}>Ver lote prioritário</button>
    </div>
    <div className="hero-visual">
      <div className="camada">
        <Blob cor="ouro" className="blob-ouro" pontos={8} amp={.2} vel={.00046} sem={1} />
      </div>
      <div className="camada">
        <Blob cor="salvia" className="blob-salvia" pontos={8} amp={.2} vel={.00041} sem={3} />
      </div>
      <div className="camada">
        <Blob cor="rosa" className="blob-rosa" pontos={6} amp={.18} vel={.00058} sem={5} />
      </div>
      <div className="camada">
        <Limao className="limao ilustracao" />
        <Picole className="picole ilustracao" />
      </div>
      <div className="camada camada-prato">
        <div className="prato-entrada">
          <img className="prato-giro" src="/assets/sorvete-rotacao.webp" width="800" height="800"
            alt="Duas bolas de sorvete de morango em um prato de borda azul, visto de cima" />
        </div>
      </div>
      <div className="camada">
        <Ramo className="ramo ilustracao" />
      </div>
>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)
      <ControleMovimento classe="controle-giro" pausado={pausado} alternarMovimento={alternarMovimento} />
    </div>
  </section>;
}
