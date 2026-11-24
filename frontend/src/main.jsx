<<<<<<< HEAD
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  chaveNome, descreverLote, fuso, hoje, itensParaReposicao, lotesDaVitrine, mostrarData,
  ordenados, prazo, quantidade, status, urgencia
} from "./estoque";
import { buscarTudo, gravar } from "./api";
import AbreVitrine, { ControleMovimento } from "./AbreVitrine";
import { Blob, Divisor, Limao, MascaraProposito, Movimento, Ramo, Seta } from "./organico";
import "./style.css";

const paginas = [["vitrine", "Vitrine do Dia"], ["estoque", "Estoque"], ["cardapio", "Cardápio"]];
const situacoes = { Vencido: "Vencidos", "Vence em breve": "Vencem em breve", Disponível: "Disponíveis", Zerado: "Zerados" };
=======
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { fuso, hoje } from "./estoque";
import { buscarTudo } from "./api";
import { Marca, Nav, Rodape, paginas } from "./componentes";
import Vitrine from "./paginas/Vitrine";
import Estoque from "./paginas/Estoque";
import Cardapio from "./paginas/Cardapio";
import Editor from "./Editor";
import "./style.css";

// Aplicativo: estado geral, carregamento dos dados e navegação entre as páginas.
// Cada página fica em src/paginas/, a janela de edição em Editor.jsx e as peças
// comuns (menu, rodapé, títulos) em componentes.jsx.
>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)

function rotaAtual() {
  const rota = location.hash.slice(1);
  return [...paginas.map(([id]) => id), "estoque-vencidos"].includes(rota) ? rota : "vitrine";
}

<<<<<<< HEAD
function Marca() {
  return <a className="marca" href="#vitrine" aria-label="StockEasy, início">StockEasy<span className="marca-ponto" aria-hidden="true" /></a>;
}

// O destaque do item atual é uma gota que escorre de um link para o outro.
function Nav({ pagina, rodape = false }) {
  const nav = useRef(null);
  const [gota, setGota] = useState(null);

  useLayoutEffect(() => {
    const medir = () => {
      const ativo = nav.current.querySelector('[aria-current="page"]');
      setGota(ativo ? { x: ativo.offsetLeft, y: ativo.offsetTop, largura: ativo.offsetWidth, altura: ativo.offsetHeight } : null);
    };
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(nav.current);
    return () => observador.disconnect();
  }, [pagina]);

  return <nav ref={nav} aria-label={rodape ? "Menu do rodapé" : "Menu principal"}>
    {gota && <svg className="gota-nav" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true" focusable="false"
      style={{ width: gota.largura, height: gota.altura, transform: `translate(${gota.x}px, ${gota.y}px)` }}>
      <path d="M9 5C30 -1 70 -2 92 4C101 11 102 27 93 35C70 42 28 41 8 35C-2 27 -2 11 9 5Z" />
    </svg>}
    {paginas.map(([id, nome]) => <a key={id} href={`#${id}`} aria-current={pagina === id ? "page" : undefined}>{nome}</a>)}
  </nav>;
}

// Mostra o conteúdo quando a seção entra na tela.
function usarRevelar(dependencia) {
  const ref = useRef(null);
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observador = new IntersectionObserver(([entrada]) => {
      if (entrada.isIntersecting) { setVisivel(true); observador.disconnect(); }
    }, { threshold: .15 });
    observador.observe(ref.current);
    return () => observador.disconnect();
  }, [dependencia]);
  return [ref, visivel];
}

function Vitrine({ dados, data, pausado, alternarMovimento }) {
  const { prioritario, proximos } = lotesDaVitrine(dados.lotes, data);
  const item = prioritario && descreverLote(dados, prioritario);
  const vencidos = dados.lotes.filter(lote => lote.validade < data).length;
  // A cor da mancha indica a urgência do lote.
  const pressa = prioritario ? urgencia(prioritario.validade, data) : "baixa";
  const [grade, visivel] = usarRevelar(proximos.length);
  return <>
    <AbreVitrine pausado={pausado} alternarMovimento={alternarMovimento} />
    <div className="limite destaque-envoltorio">
      <Limao className="destaque-limao ilustracao" />
    <section className={`destaque destaque-${pressa}`} id="lote-prioritario" tabIndex={-1} aria-labelledby="titulo-destaque">
      <div className="destaque-fundo" aria-hidden="true">
        <Blob key={pressa} cor={{ alta: "rosa", media: "ouro", baixa: "salvia" }[pressa]} className="destaque-blob"
          pontos={7} amp={.2} vel={{ alta: .0011, media: .0007, baixa: .00045 }[pressa]} sem={7} estatico />
      </div>
      <div className="dados-destaque">
        <h2 id="titulo-destaque">Lote prioritário</h2>
        {item ? <>
          <h3>{item.sabor}</h3>
          <p>{item.categoria} · Linha {item.linha}</p>
          <a className="botao" href="#estoque">Ver estoque</a>
        </> : <p>Nenhum lote disponível.</p>}
      </div>
      {item && <dl className="ficha-lote">
        <div><dt>Saldo do lote</dt><dd>{quantidade(prioritario)}</dd></div>
        <div><dt>Validade</dt><dd><time dateTime={prioritario.validade}>{mostrarData(prioritario.validade)}</time>
          <span className={`prazo-lote tag tag-${pressa}`}>{prazo(prioritario, data)}</span>
        </dd></div>
      </dl>}
    </section>
    </div>
    <section className="faixa faixa-rosa vencimentos" aria-labelledby="titulo-vencimentos">
      <Divisor cor="rosa" lado="cima" />
      <div className="limite faixa-corpo">
        <header className="titulo-secao">
          <h2 id="titulo-vencimentos">Próximos vencimentos</h2>
          <p>Demais lotes que vencem em até três dias.</p>
        </header>
        {proximos.length ? <div className={visivel ? "grade revelar dentro" : "grade revelar"} ref={grade}>
          {proximos.map((lote, indice) => {
            const item = descreverLote(dados, lote);
            return <article key={lote.id} className="produto" style={{ "--i": indice }}>
              <h3>{item.sabor}</h3>
              <p>{item.categoria} · Linha {item.linha}</p>
              <p className="produto-saldo"><span className={`prazo-lote tag tag-${urgencia(lote.validade, data)}`}>{prazo(lote, data)}</span><strong>{quantidade(lote)}</strong></p>
            </article>;
          })}
        </div> : <p className="vazio">Nenhum outro lote vence nesse período.</p>}
        <div className="atalho">
          <p><strong>{vencidos}</strong> {vencidos === 1 ? "lote vencido" : "lotes vencidos"}</p>
          <a className="botao contorno" href="#estoque-vencidos">Ver vencidos<Seta /></a>
        </div>
      </div>
      <Divisor cor="rosa" lado="baixo" gotas={5} />
    </section>
    <PropositoStockEasy />
  </>;
}

function PropositoStockEasy() {
  const foto = useRef(null);
  return <section className="limite proposito" aria-labelledby="titulo-proposito">
    <figure ref={foto} className="proposito-visual">
      <MascaraProposito alvo={foto} />
      <img src="/assets/sorvete-editorial.webp" width="1200" height="900"
        alt="Sorvete de morango servido em uma tigela com borda azul" loading="lazy" />
    </figure>
    <div className="proposito-texto">
      <h2 id="titulo-proposito">Para que serve o StockEasy?</h2>
      <p>O StockEasy ajuda a Sorveteria Pinpinela a organizar o cardápio e controlar o estoque de picolés e sorvetes por lote.</p>
      <p>No dia a dia, a equipe pode conferir o saldo, registrar saídas e priorizar a venda dos lotes que vencem primeiro. Assim, fica mais fácil planejar a reposição e reduzir o desperdício.</p>
    </div>
  </section>;
}

function OpcoesCadastro({ itens }) {
  return itens.slice().sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
    .map(item => <option key={item.id} value={item.id}>{item.nome}</option>);
}

function TituloPagina({ titulo, descricao, foto, logo, acao, onClick, cores, animarTitulo = true, ritmoFormas = 1 }) {
  return <header className="titulo-pagina">
    <div className="titulo-pagina-texto">
      <h1>{animarTitulo
        ? <span className="titulo-linha"><span className="entrada" style={{ "--d": ".2s" }}>{titulo}</span></span>
        : titulo}</h1>
      <p>{descricao}</p>
      {acao && <button className="botao" onClick={onClick}>{acao}</button>}
    </div>
    <div className="titulo-pagina-visual" aria-hidden="true">
      <div className="titulo-formas" aria-hidden="true">
        <Blob cor={cores[0]} className="forma-a entrada derramar" style={{ "--d": ".1s" }} pontos={8} amp={.2} vel={.0005 * ritmoFormas} sem={11} />
        <Blob cor={cores[1]} className="forma-b entrada derramar" style={{ "--d": ".28s" }} pontos={7} amp={.2} vel={.00055 * ritmoFormas} sem={13} />
      </div>
      <figure className="foto-produto">
        <img src={foto} alt="" />
        {logo && <img className="logo-no-pote" src={logo} alt="" />}
      </figure>
    </div>
  </header>;
}

const iconesSituacao = {
  Disponível: <path d="M3.5 8.5l3 3 6-7" />,
  "Vence em breve": <><circle cx="8" cy="8" r="5.8" /><path d="M8 4.8V8l2.2 1.4" /></>,
  Vencido: <><circle cx="8" cy="8" r="5.8" /><path d="M5.8 5.8l4.4 4.4M10.2 5.8l-4.4 4.4" /></>,
  Zerado: <circle cx="8" cy="8" r="5.8" />
};
const classesSituacao = { Disponível: "disponivel", "Vence em breve": "breve", Vencido: "vencido", Zerado: "zerado" };

// Cor e ícone reforçam o texto: a situação nunca depende só da cor.
function Situacao({ valor }) {
  return <span className={`tag tag-${classesSituacao[valor]}`}>
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{iconesSituacao[valor]}</svg>
    {valor}
  </span>;
}

function Estoque({ dados, data, somenteVencidos, abrir, marcas }) {
  const [sabor, setSabor] = useState("");
  const [situacao, setSituacao] = useState(somenteVencidos ? "Vencido" : "");
  const reposicao = itensParaReposicao(dados.lotes, data);
  const lotes = ordenados(dados.lotes.filter(lote =>
    (!sabor || String(lote.sabor_id) === sabor) &&
    (!situacao || status(lote, data) === situacao)));
  return <section className="limite operacao operacao-estoque">
    <TituloPagina titulo="Estoque"
      descricao="Acompanhe os saldos e as validades dos lotes de sorvetes e picolés e registre as saídas."
      foto="/assets/estoque-chocolate-recorte.webp" logo="/assets/logo-pinpinela.png" acao="Novo lote" onClick={() => abrir("lote")}
      cores={["ouro", "salvia"]} />
    {(!dados.sabores.length || !dados.linhas.length) && <p className="orientacao-lote">
      Cadastre pelo menos um sabor e uma linha antes de criar um lote. <a href="#cardapio">Abrir Cardápio</a>
    </p>}
    <div className="filtros">
      <label htmlFor="filtro-sabor">Sabor<select id="filtro-sabor" value={sabor} onChange={evento => setSabor(evento.target.value)}>
        <option value="">Todos os sabores</option><OpcoesCadastro itens={dados.sabores} />
      </select></label>
      <label htmlFor="filtro-situacao">Situação<select id="filtro-situacao" value={situacao} onChange={evento => setSituacao(evento.target.value)}>
        <option value="">Todas as situações</option>
        {Object.entries(situacoes).map(([valor, rotulo]) => <option key={valor} value={valor}>{rotulo}</option>)}
      </select></label>
    </div>
    {reposicao.length > 0 && <details className="reposicao">
      <summary>Estoque baixo <span>· {reposicao.length} {reposicao.length === 1 ? "produto" : "produtos"}</span></summary>
      <ul>{reposicao.map(item => <li key={item.id}>{descreverLote(dados, item).nome} <strong>· {quantidade(item)}</strong></li>)}</ul>
    </details>}
    {lotes.length ? <div className="tabela" tabIndex={0} role="region" aria-label="Lotes do estoque"><table>
      <thead><tr>{["Sabor", "Categoria", "Linha", "Saldo", "Validade", "Situação", "Ações"].map(texto => <th scope="col" key={texto}>{texto}</th>)}</tr></thead>
      <tbody>{lotes.map((lote, indice) => {
        const item = descreverLote(dados, lote);
        return <tr key={lote.id} className={marcas.has(`lote:${lote.id}`) ? "salvo" : undefined} style={{ "--i": indice }}>
          <th scope="row">{item.sabor}</th><td>{item.categoria}</td><td>{item.linha}</td>
          <td className="saldo">{quantidade(lote)}</td><td><time dateTime={lote.validade}>{mostrarData(lote.validade)}</time></td>
          <td className="estado"><Situacao valor={status(lote, data)} /></td>
          <td><div className="acoes">
            {lote.quantidade > 0 && <button onClick={() => abrir("saida", lote)}>Dar saída</button>}
            <button onClick={() => abrir("lote", lote)}>Editar</button>
            <button onClick={() => abrir("excluirLote", lote)}>Excluir</button>
          </div></td>
        </tr>;
      })}</tbody>
    </table></div> : <p className="vazio">Nenhum lote encontrado.</p>}
  </section>;
}

const cadastros = {
  sabor: { lista: "sabores", nome: "sabor", titulo: "Sabores", novo: "Novo sabor", maximo: 100, campo: "sabor_id", contador: "proximoSabor" },
  linha: { lista: "linhas", nome: "linha", titulo: "Linhas", novo: "Nova linha", maximo: 50, campo: "linha_id", contador: "proximaLinha" }
};


function Cardapio({ dados, abrir, marcas }) {
  return <section className="limite operacao operacao-cardapio">
    <TituloPagina titulo="Cardápio"
      descricao="Sabores e linhas são cadastros separados. Combine-os com a categoria ao criar um lote no Estoque."
      foto="/assets/cardapio-picoles-recorte.webp" cores={["ouro", "rosa"]}
      animarTitulo={false} ritmoFormas={.45} />
    <div className="cadastros-cardapio">
      {Object.entries(cadastros).map(([tipo, cadastro]) => {
        const itens = dados[cadastro.lista].slice().sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
        return <section key={tipo} aria-labelledby={`titulo-${tipo}`}>
          <header className="titulo-cadastro"><h2 id={`titulo-${tipo}`}>{cadastro.titulo}</h2>
            <button className="botao" onClick={() => abrir(tipo)}>{cadastro.novo}</button>
          </header>
          {itens.length ? <div className="tabela" tabIndex={0} role="region" aria-label={cadastro.titulo}><table>
            <thead><tr><th scope="col">Nome</th><th scope="col">Ações</th></tr></thead>
            <tbody>{itens.map((item, indice) => <tr key={item.id} className={marcas.has(`${tipo}:${item.id}`) ? "salvo" : undefined} style={{ "--i": indice }}>
              <th scope="row">{item.nome}</th>
              <td><div className="acoes">
                <button aria-label={`Editar ${item.nome}`} onClick={() => abrir(tipo, item)}>Editar</button>
                <button aria-label={`Excluir ${item.nome}`} onClick={() => abrir("excluirCadastro", { ...item, tipo })}>Excluir</button>
              </div></td>
            </tr>)}</tbody>
          </table></div> : <p className="vazio vazio-cartao">Sem registros.</p>}
        </section>;
      })}
    </div>
  </section>;
}

function camposDoEditor(tipo, item, dados) {
  const cadastro = cadastros[tipo];
  if (cadastro) return {
    titulo: item ? `Editar ${cadastro.nome}` : cadastro.novo,
    campos: <label htmlFor="nome">Nome do cadastro<input id="nome" name="nome" required maxLength={cadastro.maximo} defaultValue={item?.nome} /></label>
  };
  switch (tipo) {
    case "lote":
      return {
        titulo: item ? "Editar lote" : "Novo lote",
        campos: <>
          <label htmlFor="sabor-lote">Sabor<select id="sabor-lote" name="sabor_id" required defaultValue={item?.sabor_id ?? ""}>
            <option value="">Selecione o sabor</option><OpcoesCadastro itens={dados.sabores} />
          </select></label>
          <label htmlFor="categoria-lote">Categoria<select id="categoria-lote" name="categoria_id" required defaultValue={item?.categoria_id ?? ""}>
            <option value="">Selecione a categoria</option><OpcoesCadastro itens={dados.categorias} />
          </select></label>
          <label htmlFor="linha-lote">Linha<select id="linha-lote" name="linha_id" required defaultValue={item?.linha_id ?? ""}>
            <option value="">Selecione a linha</option><OpcoesCadastro itens={dados.linhas} />
          </select></label>
          <label htmlFor="quantidade">Quantidade em unidades<input id="quantidade" name="quantidade" type="number" required min={item ? 0 : 1} max="2147483647" step="1" defaultValue={item?.quantidade} /></label>
          <label htmlFor="validade">Validade<input id="validade" name="validade" type="date" required defaultValue={item?.validade} /></label>
        </>
      };
    case "saida":
      return {
        titulo: "Dar saída", acao: "Registrar saída",
        campos: <>
          <p>{descreverLote(dados, item).nome}<br />Saldo atual: {quantidade(item)}</p>
          <label htmlFor="saida">Quantidade a retirar<input id="saida" name="saida" type="number" step="1" min="1" max={item.quantidade} required /></label>
        </>
      };
    case "excluirCadastro":
      return { titulo: `Excluir ${cadastros[item.tipo].nome}?`, acao: "Excluir", campos: <p>{item.nome}</p> };
    case "excluirLote":
      return { titulo: "Excluir lote?", acao: "Excluir", campos: <p>{descreverLote(dados, item).nome} · {mostrarData(item.validade)}</p> };
  }
}

function atualizar(dados, { tipo, item }, valores) {
  const cadastro = cadastros[tipo];
  if (cadastro) {
    const nome = valores.get("nome").trim();
    const itens = dados[cadastro.lista];
    if (!nome || nome.length > cadastro.maximo) return "Confira o nome informado.";
    if (itens.some(outro => outro.id !== item?.id && chaveNome(outro.nome) === chaveNome(nome))) {
      return "Já existe um cadastro com esse nome.";
    }
    if (item) return { ...dados, [cadastro.lista]: itens.map(atual => atual.id === item.id ? { ...atual, nome } : atual) };
    const id = dados[cadastro.contador];
    return { ...dados, [cadastro.lista]: [...itens, { id, nome }], [cadastro.contador]: id + 1 };
  }
  switch (tipo) {
    case "lote": {
      const sabor_id = Number(valores.get("sabor_id"));
      const categoria_id = Number(valores.get("categoria_id"));
      const linha_id = Number(valores.get("linha_id"));
      const numero = Number(valores.get("quantidade"));
      const validade = valores.get("validade");
      if (!dados.sabores.some(sabor => sabor.id === sabor_id) ||
          !dados.categorias.some(categoria => categoria.id === categoria_id) ||
          !dados.linhas.some(linha => linha.id === linha_id)) return "Selecione sabor, categoria e linha.";
      if (!Number.isInteger(numero) || numero < (item ? 0 : 1) || numero > 2147483647 ||
          !/^\d{4}-\d{2}-\d{2}$/.test(validade)) return "Confira a quantidade e a validade.";
      const dadosLote = { sabor_id, categoria_id, linha_id, quantidade: numero, validade };
      return item
        ? { ...dados, lotes: dados.lotes.map(lote => lote.id === item.id ? { ...lote, ...dadosLote } : lote) }
        : { ...dados, lotes: [...dados.lotes, { id: dados.proximoLote, ...dadosLote }], proximoLote: dados.proximoLote + 1 };
    }
    case "saida": {
      const numero = Number(valores.get("saida"));
      const lote = dados.lotes.find(lote => lote.id === item.id);
      if (!lote || !Number.isSafeInteger(numero) || numero < 1 || numero > lote.quantidade) return "Informe uma quantidade dentro do saldo.";
      return { ...dados, lotes: dados.lotes.map(atual => atual.id === item.id ? { ...atual, quantidade: atual.quantidade - numero } : atual) };
    }
    case "excluirCadastro": {
      const registro = cadastros[item.tipo];
      if (dados.lotes.some(lote => lote[registro.campo] === item.id)) return "Este cadastro está vinculado a lotes e não pode ser excluído.";
      return { ...dados, [registro.lista]: dados[registro.lista].filter(atual => atual.id !== item.id) };
    }
    case "excluirLote":
      return { ...dados, lotes: dados.lotes.filter(lote => lote.id !== item.id) };
  }
}

function Editor({ editor, dados, fechar, concluir }) {
  const modal = useRef(null);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const { titulo, acao = "Salvar", campos } = camposDoEditor(editor.tipo, editor.item, dados);

  useEffect(() => {
    const dialogo = modal.current;
    dialogo.showModal();
    return () => dialogo.close();
  }, []);

  // Valida no navegador, grava na API e recarrega os dados do banco.
  async function enviar(evento) {
    evento.preventDefault();
    const valores = new FormData(evento.currentTarget);
    const resultado = atualizar(dados, editor, valores);
    if (typeof resultado === "string") { setErro(resultado); return; }
    setEnviando(true);
    try {
      await gravar(editor, valores);
      concluir(await buscarTudo());
    } catch (falha) {
      setErro(falha.message);
      setEnviando(false);
    }
  }

  return <dialog ref={modal} aria-labelledby="modal-titulo" onCancel={evento => { evento.preventDefault(); fechar(); }}>
    <Blob cor="ouro" className="modal-blob modal-blob-a" pontos={7} amp={.2} vel={.0005} sem={17} />
    <Blob cor="salvia" className="modal-blob modal-blob-b" pontos={7} amp={.2} vel={.00045} sem={19} />
    <form onSubmit={enviar}>
      <div className="modal-titulo"><h2 id="modal-titulo">{titulo}</h2><button className="fechar" type="button" aria-label="Fechar" onClick={fechar}>×</button></div>
      <div className="campos">{campos}</div>
      {erro && <p className="erro" role="alert">{erro}</p>}
      <div className="modal-acoes"><button className="botao contorno" type="button" onClick={fechar}>Cancelar</button><button className="botao" disabled={enviando}>{acao}</button></div>
    </form>
  </dialog>;
}

// Entre uma página e outra, três camadas de cor sobem como sorvete derramado.
function Transicao({ fase }) {
  return <div className={`transicao transicao-${fase}`} aria-hidden="true">
    {["ouro", "salvia", "rosa"].map((cor, indice) => <svg key={cor} className="transicao-camada"
      style={{ "--cor": `var(--${cor})`, "--i": indice, "--espelho": indice % 2 ? -1 : 1 }}
      viewBox="0 0 1440 1400" preserveAspectRatio="none" focusable="false">
      <path d="M0 70C120 10 240 10 360 60S600 120 720 70 960 10 1080 60 1320 120 1440 70V1330C1320 1390 1200 1390 1080 1340S840 1280 720 1330 480 1390 360 1340 120 1280 0 1330Z" />
    </svg>)}
  </div>;
}

function Rodape({ pagina, pausado, alternarMovimento }) {
  return <footer>
    <Divisor cor="indigo" lado="cima" velocidade={.4} amplitude={.65} />
    <div className="limite rodape">
      <div className="rodape-marca">
        <Marca />
        <p className="manuscrito-rodape">Primeiro a vencer, primeiro a sair.</p>
      </div>
      <Nav pagina={pagina} rodape />
      <ControleMovimento classe="controle-rodape" pausado={pausado} alternarMovimento={alternarMovimento} />
    </div>
    <div className="rodape-arte" aria-hidden="true"><Ramo className="rodape-ramo ilustracao" /></div>
  </footer>;
}

=======
>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)
// Quais registros mudaram, para destacar as linhas recém-salvas.
function marcarAlteracoes(antes, depois) {
  const marcas = new Set();
  for (const [lista, prefixo] of [["lotes", "lote"], ["sabores", "sabor"], ["linhas", "linha"]]) {
    const anteriores = new Map(antes[lista].map(registro => [registro.id, JSON.stringify(registro)]));
    for (const registro of depois[lista]) {
      if (anteriores.get(registro.id) !== JSON.stringify(registro)) marcas.add(`${prefixo}:${registro.id}`);
    }
  }
  return marcas;
}

const semDados = { sabores: [], categorias: [], linhas: [], lotes: [] };

function App() {
<<<<<<< HEAD
  const [pausaManual, setPausaManual] = useState(false);
  const [movimentoReduzido, setMovimentoReduzido] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  const pausado = pausaManual || movimentoReduzido;
  const alternarMovimento = () => setPausaManual(valor => !valor);
  const pausadoAgora = useRef(pausado);
  pausadoAgora.current = pausado;

  useEffect(() => {
    const preferencia = matchMedia("(prefers-reduced-motion: reduce)");
    const atualizar = evento => setMovimentoReduzido(evento.matches);
    preferencia.addEventListener("change", atualizar);
    return () => preferencia.removeEventListener("change", atualizar);
  }, []);

=======
>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)
  const [dados, setDados] = useState(semDados);
  const [rota, setRota] = useState(rotaAtual);
  const [editor, setEditor] = useState(null);
  const [aviso, setAviso] = useState("");
  const [marcas, setMarcas] = useState(() => new Set());
<<<<<<< HEAD
  const [fase, setFase] = useState("parado");
  const tempoAviso = useRef();
  const tempoMarcas = useRef();
  const temposTransicao = useRef([]);
=======
  // Pausa do prato de sorvete girando (botão na abertura da Vitrine).
  const [pausado, setPausado] = useState(false);
  const alternarMovimento = () => setPausado(valor => !valor);
  const tempoAviso = useRef();
  const tempoMarcas = useRef();
>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)
  const pagina = rota === "estoque-vencidos" ? "estoque" : rota;
  const data = hoje();

  useEffect(() => {
<<<<<<< HEAD
    function irPara() {
      setRota(rotaAtual());
      window.scrollTo(0, 0);
    }
    function navegar() {
      if (pausadoAgora.current) { irPara(); return; }
      temposTransicao.current.forEach(clearTimeout);
      setFase("cobrindo");
      temposTransicao.current = [
        setTimeout(() => { irPara(); setFase("revelando"); }, 680),
        setTimeout(() => setFase("parado"), 1450)
      ];
    }
    window.addEventListener("hashchange", navegar);
    return () => {
      window.removeEventListener("hashchange", navegar);
      temposTransicao.current.forEach(clearTimeout);
=======
    function navegar() {
      setRota(rotaAtual());
      window.scrollTo(0, 0);
    }
    window.addEventListener("hashchange", navegar);
    return () => {
      window.removeEventListener("hashchange", navegar);
>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)
      clearTimeout(tempoAviso.current);
      clearTimeout(tempoMarcas.current);
    };
  }, []);

  function avisar(texto) {
    clearTimeout(tempoAviso.current);
    setAviso(texto);
    tempoAviso.current = setTimeout(() => setAviso(""), 3200);
  }

  function abrir(tipo, item) {
    if (tipo === "lote" && !item && (!dados.sabores.length || !dados.linhas.length)) {
      avisar("Cadastre um sabor e uma linha no Cardápio antes de criar um lote.");
      return;
    }
    setEditor({ tipo, item });
  }

  useEffect(() => {
    buscarTudo().then(setDados).catch(falha => avisar(falha.message));
  }, []);

  function concluir(resultado) {
    clearTimeout(tempoMarcas.current);
    setMarcas(marcarAlteracoes(dados, resultado));
    tempoMarcas.current = setTimeout(() => setMarcas(new Set()), 2800);
    setDados(resultado);
    setEditor(null);
    avisar("Alteração salva.");
  }

<<<<<<< HEAD
  return <Movimento.Provider value={pausado}>
    <div className={pausado ? "site movimento-pausado" : "site"} data-pagina={pagina}>
      <header className="limite cabecalho">
        <div className="identidade"><Marca /><span>Sorveteria Pinpinela</span></div>
        <Nav pagina={pagina} />
        <time dateTime={data}>{new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", timeZone: fuso }).format(new Date())}</time>
      </header>
      <main>
        {pagina === "vitrine" && <Vitrine dados={dados} data={data} pausado={pausado} alternarMovimento={alternarMovimento} />}
        {pagina === "estoque" && <Estoque key={rota} dados={dados} data={data} somenteVencidos={rota === "estoque-vencidos"} abrir={abrir} marcas={marcas} />}
        {pagina === "cardapio" && <Cardapio dados={dados} abrir={abrir} marcas={marcas} />}
      </main>
      <Rodape pagina={pagina} pausado={pausado} alternarMovimento={alternarMovimento} />
      {editor && <Editor editor={editor} dados={dados} fechar={() => setEditor(null)} concluir={concluir} />}
      <div className="aviso" role="status" hidden={!aviso}><span className="aviso-ponto" aria-hidden="true" />{aviso}</div>
      <Transicao fase={fase} />
    </div>
  </Movimento.Provider>;
=======
  return <div className={pausado ? "site movimento-pausado" : "site"} data-pagina={pagina}>
    <header className="limite cabecalho">
      <div className="identidade"><Marca /><span>Sorveteria Pinpinela</span></div>
      <Nav pagina={pagina} />
      <time dateTime={data}>{new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", timeZone: fuso }).format(new Date())}</time>
    </header>
    <main>
      {pagina === "vitrine" && <Vitrine dados={dados} data={data} pausado={pausado} alternarMovimento={alternarMovimento} />}
      {pagina === "estoque" && <Estoque key={rota} dados={dados} data={data} somenteVencidos={rota === "estoque-vencidos"} abrir={abrir} marcas={marcas} />}
      {pagina === "cardapio" && <Cardapio dados={dados} abrir={abrir} marcas={marcas} />}
    </main>
    <Rodape pagina={pagina} />
    {editor && <Editor editor={editor} dados={dados} fechar={() => setEditor(null)} concluir={concluir} />}
    <div className="aviso" role="status" hidden={!aviso}><span className="aviso-ponto" aria-hidden="true" />{aviso}</div>
  </div>;
>>>>>>> 360d4dc (refactor: Organização das pastas e arquivos)
}

createRoot(document.getElementById("root")).render(<App />);
