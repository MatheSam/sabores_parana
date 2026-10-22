import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Leaf, MapPin, Minus, Plus, ShoppingBag, Sparkles, Trees, X } from 'lucide-react';

const dishes = [
  { id: 'barreado', name: 'Barreado da costa', type: 'Prato principal', region: 'Litoral', price: 48, unit: 'por pessoa', image: 'https://www.parana.pr.gov.br/sites/default/arquivos_restritos/files/imagem/migrados/galeria/59904/IMG_5645.jpg', alt: 'Barreado servido com banana e farinha de mandioca', category: 'Pratos', tag: 'O mais pedido', detail: 'Carne cozida lentamente na panela de barro, com arroz, farinha de mandioca e banana.' },
  { id: 'pierogi', name: 'Pierogi da colônia', type: 'Massa artesanal', region: 'Centro-sul', price: 36, unit: 'por pessoa', image: 'https://www.fuiserviajante.com/wp-content/uploads/2022/06/pierogi-prato-tipico-do-parana-1024x756.jpg', alt: 'Pierogi com cebolas douradas', category: 'Massas', tag: 'Feito à mão', detail: 'Pastéis de batata e requeijão, cozidos e salteados na manteiga com cebola.' },
  { id: 'onca', name: 'Carne de onça', type: 'Petisco curitibano', region: 'Curitiba', price: 32, unit: 'por porção', image: 'https://mid-noticias.curitiba.pr.gov.br/2023/00419163.jpg', alt: 'Carne de onça tradicional de Curitiba', category: 'Petiscos', tag: 'Ícone de Curitiba', detail: 'Carne bovina crua temperada, broa escura, cebola e cebolinha. Servida tradicionalmente crua.' },
  { id: 'entrevero', name: 'Entrevero de pinhão', type: 'Tropeiro da serra', region: 'Campos Gerais', price: 52, unit: 'por pessoa', image: 'https://www.viajeparana.com/sites/viaje-parana/arquivos_restritos/files/imagem/2024-05/entrevero_-_foto_nakayana_matias_2.png', alt: 'Entrevero de pinhão, prato paranaense com carnes e pinhão', category: 'Pratos', tag: 'Pinhão na estação', detail: 'Pinhão com carnes bovina e suína, bacon, pimentão e temperos de panela.' },
  { id: 'cuca', name: 'Cuca de banana', type: 'Doce de família', region: 'Vale do Iguaçu', price: 22, unit: 'por fatia', image: 'https://cdn.panelinha.com.br/receita/1550859492306-cuca-banana.jpg', alt: 'Cuca de banana com farofa crocante', category: 'Doces', tag: 'Receita da vó', detail: 'Massa macia, banana madura e farofa crocante de canela.' },
  { id: 'quero', name: 'Quirera com suã', type: 'Comida de fogão', region: 'Campos Gerais', price: 42, unit: 'por pessoa', image: 'https://s2-receitas.glbimg.com/rYpKPRVs-M63Rh9Q3H_ATs5jajA%3D/0x0%3A800x443/984x0/smart/filters%3Astrip_icc%28%29/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2026/J/W/IcbI1TSsGhhJPUuR37gg/imagem.jpg', alt: 'Quirera cremosa com suã e cheiro-verde', category: 'Pratos', tag: 'Conforto no prato', detail: 'Quirera de milho cremosa com suã suína, cheiro-verde e tempero de casa.' },
];

const money = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const rise = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: .62, ease: [.22, 1, .36, 1] } } };

function Header({ page, setPage, count }) {
  return <header className="header"><a className="brand" href="#inicio" onClick={() => setPage('home')} aria-label="Sabores do Paraná, início"><span className="brand-mark"><Trees size={23} strokeWidth={1.5}/></span><span>sabores<span className="brand-of"> do</span><br/><b>paraná</b></span></a>
    <nav className="nav"><a className={page === 'home' ? 'active' : ''} href="#sabores" onClick={() => setPage('home')}>Nossa cozinha</a><a href="#origem" onClick={() => setPage('home')}>De onde vem</a></nav>
    <button className="quote-nav" onClick={() => { setPage('quote'); window.scrollTo({top: 0, behavior: 'smooth'}); }}>Monte seu orçamento <span className="quote-count">{count || <ArrowUpRight size={14}/>}</span></button>
  </header>;
}

function App() {
  const [page, setPage] = useState('home');
  const [category, setCategory] = useState('Tudo');
  const [quantities, setQuantities] = useState({});
  const [guests, setGuests] = useState(20);
  const [copied, setCopied] = useState(false);
  const categories = ['Tudo', 'Pratos', 'Massas', 'Petiscos', 'Doces'];
  const filtered = category === 'Tudo' ? dishes : dishes.filter(d => d.category === category);
  const count = dishes.filter(d => quantities[d.id] > 0).length;
  const chosen = dishes.filter(d => quantities[d.id] > 0);
  const servingsFor = (d) => d.unit === 'por pessoa' ? guests : quantities[d.id];
  const totalFor = (d) => d.price * servingsFor(d);
  const total = chosen.reduce((sum, d) => sum + totalFor(d), 0);
  const perPerson = guests ? total / guests : total;
  const summary = useMemo(() => chosen.map(d => `${servingsFor(d)} × ${d.name} — ${money(totalFor(d))}`).join('\n'), [chosen, quantities, guests]);
  const setQty = (id, value) => setQuantities(q => ({ ...q, [id]: Math.max(0, value) }));
  const add = (id) => {
    const dish = dishes.find(d => d.id === id);
    setQty(id, dish?.unit === 'por pessoa' ? (quantities[id] ? 0 : 1) : (quantities[id] || 0) + 1);
  };
  const showQuote = () => { setPage('quote'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const copyQuote = async () => {
    const text = `PRÉ-ORÇAMENTO · Sabores do Paraná\n${summary || 'Nenhum item selecionado'}\n\nConvidados: ${guests}\nEstimativa: ${money(total)} (${money(perPerson)} por pessoa)\n\nValores ilustrativos, sujeitos a confirmação de disponibilidade e entrega.`;
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2500); }
    catch { setCopied(false); }
  };

  return <><div className="announcement"><Sparkles size={13}/> SABORES COM RAIZ, FEITOS PARA COMPARTILHAR <span>·</span> Curitiba & região</div><Header page={page} setPage={setPage} count={count}/>
    <main>
      {page === 'home' ? <>
        <section className="hero" id="inicio"><div className="hero-copy"><motion.div initial="hidden" animate="show" variants={rise} className="eyebrow"><span className="eyebrow-line"/> cozinha de raiz, do Paraná</motion.div>
          <motion.h1 initial="hidden" animate="show" variants={{...rise, show:{...rise.show, transition:{...rise.show.transition, delay:.1}}}}>Tem gosto de<br/><em>ficar à mesa.</em></motion.h1>
          <motion.p className="hero-desc" initial="hidden" animate="show" variants={{...rise, show:{...rise.show, transition:{...rise.show.transition, delay:.2}}}}>Receitas que atravessam a serra, o tempo e as histórias. Cozinha paranaense feita com calma, ingrediente bom e um tanto de saudade.</motion.p>
          <motion.div className="hero-actions" initial="hidden" animate="show" variants={{...rise, show:{...rise.show, transition:{...rise.show.transition, delay:.3}}}}><a className="button-primary" href="#sabores">Descubra os sabores <ArrowDown size={16}/></a><button className="text-link" onClick={showQuote}>Planeje seu encontro <ArrowRight size={16}/></button></motion.div>
          <div className="hero-note"><Leaf size={15}/><span>ingredientes locais<br/><b>afeto em cada receita</b></span></div>
        </div><motion.div className="hero-photo-wrap" initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} transition={{duration:.8,ease:'easeOut'}}><img className="hero-photo" src="https://www.parana.pr.gov.br/sites/default/arquivos_restritos/files/imagem/migrados/galeria/59904/IMG_5645.jpg" alt="Barreado tradicional do litoral paranaense servido com farinha e banana"/><div className="photo-caption"><span>01 / O clássico da costa</span><b>Barreado, sem pressa.</b></div><div className="seal"><span>cozinha<br/>com</span><strong>raiz</strong><Trees size={23}/></div><div className="hero-side">24°32′ S &nbsp; 48°50′ W</div></motion.div>
        </section>
        <div className="ticker" aria-label="Sabores do Paraná"><div className="ticker-track">{Array.from({length:8},(_,i)=><span key={i}>DA SERRA AO LITORAL <i>✳</i> RECEITAS COM HISTÓRIA <i>✳</i></span>)}</div></div>
        <section className="menu-section section-pad" id="sabores"><motion.div className="section-heading" initial="hidden" whileInView="show" viewport={{once:true,amount:.3}} variants={rise}><div><span className="eyebrow"><span className="eyebrow-line"/> nosso cardápio</span><h2>Uma viagem em<br/><em>cada garfada.</em></h2></div><p>Do litoral à mesa de domingo: escolha seu caminho por uma cozinha cheia de encontros.</p></motion.div>
          <div className="filters" role="tablist" aria-label="Filtrar pratos">{categories.map(c=><button key={c} className={category===c?'selected':''} onClick={()=>setCategory(c)} role="tab" aria-selected={category===c}>{c}</button>)}</div>
          <div className="dish-grid">{filtered.map((dish,i)=><motion.article className="dish-card" key={dish.id} initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:.48,delay:i*.07}}><div className="dish-image-wrap"><img src={dish.image} alt={dish.alt} loading="lazy"/><span className="dish-tag">{dish.tag}</span><button className="add-button" aria-label={`${quantities[dish.id] ? 'Remover' : 'Adicionar'} ${dish.name} ao orçamento`} onClick={()=>add(dish.id)}>{quantities[dish.id] && dish.unit === 'por pessoa' ? <Check size={18}/> : <Plus size={19}/>}</button></div><div className="dish-info"><div className="dish-kicker">{dish.type} <span>·</span> {dish.region}</div><h3>{dish.name}</h3><p>{dish.detail}</p><div className="dish-bottom"><b>{money(dish.price)} <small>/ {dish.unit}</small></b><button onClick={()=>add(dish.id)} className="add-text">{quantities[dish.id] && dish.unit === 'por pessoa' ? 'Incluído' : 'Adicionar'} {quantities[dish.id] && dish.unit === 'por pessoa' ? <Check size={14}/> : <Plus size={14}/>}</button></div></div></motion.article>)}</div>
          <div className="menu-footer"><span><Leaf size={16}/> Feito em pequenos lotes, com ingredientes da estação.</span><button className="text-link" onClick={showQuote}>Ver meu orçamento <ArrowRight size={16}/></button></div>
        </section>
        <section className="origin-section" id="origem"><div className="origin-photo"><img src="https://www.fuiserviajante.com/wp-content/uploads/2022/06/pierogi-prato-tipico-do-parana-1024x756.jpg" alt="Pierogi feito à mão com cebolas douradas" loading="lazy"/><span>COLÔNIA POLONESA · PARANÁ</span></div><div className="origin-copy"><span className="eyebrow"><span className="eyebrow-line"/> sabores que contam</span><h2>Um estado.<br/><em>Muitas origens.</em></h2><p>O Paraná se revela nos detalhes: no vapor da panela de barro, no pinhão recém-colhido, nas massas trazidas de longe e no café que sempre cabe mais um.</p><p>Nosso cardápio celebra essa mistura — do litoral à serra — com o cuidado de quem sabe que comida boa também guarda memória.</p><a className="map-link" href="https://www.google.com/maps/search/comida+t%C3%ADpica+paranaense+Morretes+PR" target="_blank" rel="noreferrer"><MapPin size={17}/> Explore o litoral no mapa <ArrowUpRight size={15}/></a></div><div className="origin-stamp">feito<br/>com<br/><b>tempo</b></div></section>
        <section className="invite"><div className="invite-ornament"><Trees size={39} strokeWidth={1}/></div><span className="eyebrow">pra dividir, celebrar, lembrar</span><h2>A próxima mesa<br/>pode ser <em>a sua.</em></h2><p>Almoço em família, festa de empresa ou só vontade de comer bem. A gente ajuda a montar.</p><button className="button-cream" onClick={showQuote}>Monte seu orçamento <ArrowRight size={16}/></button><div className="invite-map"><a href="https://www.google.com/maps/search/restaurantes+de+comida+paranaense+Curitiba+PR" target="_blank" rel="noreferrer"><MapPin size={15}/> Curitiba, Paraná <ArrowUpRight size={14}/></a></div></section>
      </> : <section className="quote-page"><div className="quote-top"><button className="back-link" onClick={()=>setPage('home')}><ArrowLeft size={16}/> voltar ao cardápio</button><span className="eyebrow"><span className="eyebrow-line"/> sua mesa, do seu jeito</span></div><div className="quote-intro"><h1>Vamos montar<br/><em>seu encontro.</em></h1><p>Escolha os sabores e as quantidades. A estimativa aparece na hora — depois, a gente ajusta cada detalhe junto.</p></div>
          <div className="quote-layout"><div className="quote-picker"><div className="quote-label"><span>01</span><h2>Escolha os sabores</h2></div>{dishes.map(d=><div className="quote-row" key={d.id}><img src={d.image} alt=""/><div className="quote-row-name"><b>{d.name}</b><small>{d.type} · {money(d.price)} / {d.unit}{d.unit === 'por pessoa' && quantities[d.id] ? ` · para ${guests}` : ''}</small></div><div className="quantity">{d.unit === 'por pessoa' ? <><span className="serving-note">{quantities[d.id] ? `${guests} pess.` : '—'}</span><button aria-label={`${quantities[d.id] ? 'Remover' : 'Incluir'} ${d.name} no orçamento`} onClick={()=>add(d.id)}>{quantities[d.id] ? <Minus size={14}/> : <Plus size={14}/>}</button></> : <><button aria-label={`Remover uma porção de ${d.name}`} onClick={()=>setQty(d.id,(quantities[d.id]||0)-1)}><Minus size={14}/></button><span>{quantities[d.id]||0}</span><button aria-label={`Adicionar uma porção de ${d.name}`} onClick={()=>add(d.id)}><Plus size={14}/></button></>}</div></div>)}
            <div className="quote-label guests-label"><span>02</span><h2>Quantas pessoas?</h2></div><div className="guest-control"><span>Convidados estimados</span><div className="quantity"><button aria-label="Diminuir número de convidados" onClick={()=>setGuests(Math.max(1,guests-5))}><Minus size={14}/></button><span>{guests}</span><button aria-label="Aumentar número de convidados" onClick={()=>setGuests(guests+5)}><Plus size={14}/></button></div></div>
            <label className="event-field">Ocasião <span>(opcional)</span><div className="select-wrap"><select defaultValue=""><option value="" disabled>Selecione o tipo de encontro</option><option>Almoço em família</option><option>Festa de aniversário</option><option>Evento corporativo</option><option>Casamento ou celebração</option><option>Outro encontro</option></select><ChevronDown size={17}/></div></label>
          </div><aside className="estimate-card"><div className="estimate-top"><span><ShoppingBag size={17}/> seu pré-orçamento</span><span className="estimate-flower">✳</span></div>{chosen.length ? <div className="estimate-items">{chosen.map(d=><div key={d.id}><span>{servingsFor(d)} × {d.name}</span><b>{money(totalFor(d))}</b></div>)}</div>:<div className="estimate-empty"><Leaf size={21}/><p>Seu orçamento começa<br/>com um sabor.</p><small>Adicione os pratos que deseja incluir.</small></div>}
            <div className="estimate-guests"><span><Trees size={15}/> Para {guests} pessoas</span><b>{money(perPerson)} <small>/ pessoa</small></b></div><div className="estimate-total"><span>Estimativa total</span><strong>{money(total)}</strong></div><button className="button-primary copy-button" onClick={copyQuote} disabled={!chosen.length}>{copied ? <><Check size={16}/> Resumo copiado</> : <>Copiar pré-orçamento <ArrowRight size={16}/></>}</button><p className="estimate-footnote">Valores ilustrativos para planejamento. O orçamento final depende de disponibilidade, formato de serviço e local de entrega.</p><a className="estimate-map" href="https://www.google.com/maps/search/eventos+Curitiba+PR" target="_blank" rel="noreferrer"><MapPin size={15}/> Consulte locais em Curitiba <ArrowUpRight size={14}/></a></aside></div>
        </section>}
    </main>
    <footer className="footer"><a className="brand footer-brand" href="#inicio" onClick={()=>setPage('home')}><span className="brand-mark"><Trees size={21}/></span><span>sabores<span className="brand-of"> do</span><br/><b>paraná</b></span></a><span>Feito com tempo, tempero e um pouco de pinhão. <i>✳</i></span><a href="https://www.google.com/maps/search/comida+paranaense+Curitiba+PR" target="_blank" rel="noreferrer">Encontre no mapa <ArrowUpRight size={13}/></a><small>© 2026 Sabores do Paraná · Valores ilustrativos</small></footer>
    <button className="mobile-quote" onClick={showQuote}><ShoppingBag size={17}/> {count ? `${count} ${count === 1 ? 'item' : 'itens'} · orçamento` : 'Monte seu orçamento'} <ArrowRight size={16}/></button>
  </>;
}

export default App;

