import { useEffect, useMemo, useState } from 'react';
import { ArrowDownUp, ArrowRight, CalendarDays, Check, ChevronDown, Heart, Image, Images, LayoutGrid, LoaderCircle, LockKeyhole, Plus, Search, Sparkles, X } from 'lucide-react';
import { formatDate, loadMemories, saveMemories, type Memory } from '../lib/memories';
import { MemoryModal } from '../components/memory-modal';

export default function HistoryPage() {
  const [view, setView] = useState<'gallery' | 'timeline'>('gallery');
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState(false);
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('all');
  const [sort, setSort] = useState('newest');
  const [modal, setModal] = useState<{ memory: Memory | null; mode: 'view' | 'edit' } | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => { document.title = 'The history A&B — Nossa história'; loadMemories().then(setMemories).catch(() => setStorageError(true)).finally(() => setLoading(false)); }, []);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 4000); return () => clearTimeout(timer); }, [toast]);

  const years = useMemo(() => [...new Set(memories.map(m => m.date.slice(0, 4)))].sort().reverse(), [memories]);
  const visible = useMemo(() => {
    const normalize = (s: string) => s.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[̀-ͯ]/g, '');
    return memories.filter(m => (year === 'all' || m.date.startsWith(year)) && normalize(m.title + ' ' + m.text).includes(normalize(query))).sort((a, b) => sort === 'newest' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
  }, [memories, query, year, sort]);
  const hasExamples = memories.some(m => m.example);
  const ownCount = memories.filter(m => !m.example).length;
  const openNew = () => setModal({ memory: null, mode: 'edit' });

  async function save(memory: Memory) {
    const next = memories.some(m => m.id === memory.id) ? memories.map(m => m.id === memory.id ? memory : m) : [memory, ...memories];
    await saveMemories(next); setMemories(next); setStorageError(false); setToast('Memória salva neste navegador.');
  }
  async function remove(id: string) {
    const next = memories.filter(m => m.id !== id);
    await saveMemories(next); setMemories(next); setStorageError(false); setToast('Memória excluída.');
  }

  const card = (m: Memory, index: number) => <button className={'memory-card card-' + (index % 6)} key={m.id} onClick={() => setModal({ memory: m, mode: 'view' })} aria-label={'Abrir memória: ' + m.title}>
    <div className="photo-wrap">{m.image ? <img src={m.image} alt={m.title} loading="lazy"/> : <div className="no-image"><Heart size={36}/><span>Uma memória em palavras</span></div>}{m.example && <span className="photo-example">Exemplo</span>}<span className="photo-open"><ArrowRight size={19}/></span></div>
    <div className="card-copy"><span className="card-date"><CalendarDays size={12}/>{formatDate(m.date)}</span><h3>{m.title}</h3><p>{m.text || 'Uma história esperando para ser contada.'}</p></div>
  </button>;

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="/" aria-label="The history A&B — início"><div className="brand-mark"><Heart size={24} strokeWidth={1.7}/><span className="brand-spark">✦</span></div><div><span>The history</span><strong>A<span>&</span>B<span className="brand-dot">.</span></strong></div></a>
      <div className="sidebar-section">NOSSO CANTINHO</div>
      <nav className="main-nav" aria-label="Navegação principal"><button className={view === 'gallery' ? 'active' : ''} onClick={() => setView('gallery')}><Images size={19}/><span>Galeria</span><span className="nav-count">{memories.length}</span></button><button className={view === 'timeline' ? 'active' : ''} onClick={() => setView('timeline')}><CalendarDays size={19}/><span>Linha do tempo</span></button></nav>
      <div className="sidebar-quote"><span className="quote-mark">“</span><p>A vida é feita de momentos.<br/>A nossa história, de nós.</p><span className="quote-line"/><Heart size={13}/></div>
      <div className="sidebar-bottom"><div className="local-box"><LockKeyhole size={17}/><div><strong>Só seu, só aqui.</strong><p>Suas memórias ficam salvas<br/>neste navegador.</p></div></div><div className="sidebar-signature"><span className="little-heart"><Heart size={13}/></span>Feito para guardar o que importa.</div></div>
    </aside>

    <main className="main-content">
      <header className="page-header"><div><div className="eyebrow header-eyebrow"><span/> CADA MOMENTO CONTA</div><h1>Nossa história<span>.</span></h1><p>Um lugar para guardar tudo o que faz a gente ser nós.</p></div><div className="header-actions"><div className="avatars" aria-label="A e B"><span>A</span><span>B</span></div><button className="primary-button add-button" onClick={openNew} disabled={loading}><Plus size={18}/>Adicionar memória</button></div></header>

      <section className="hero" aria-label="Nossa coleção de momentos"><img src="/images/hero.jpg" alt="Lago azul entre montanhas"/><div className="hero-shade"/><div className="hero-copy"><span className="hero-kicker"><Heart size={13}/> THE HISTORY A&B</span><h2>Alguns momentos<br/>merecem ficar <em>para sempre.</em></h2><p>As fotos guardam o instante.<br/>As palavras guardam o que a gente sentiu.</p><button onClick={openNew}>Guarde um novo momento <ArrowRight size={17}/></button></div><div className="hero-note"><Sparkles size={20}/><strong>A nossa coleção<br/>de momentos.</strong><span>{ownCount === 0 ? 'A próxima memória pode ser sua.' : `${ownCount} ${ownCount === 1 ? 'memória escrita' : 'memórias escritas'} por você.`}</span><div className="note-line"/><small>UMA HISTÓRIA, DOIS CORAÇÕES</small></div><span className="hero-corner">A & B / MEMÓRIAS</span></section>

      <section className="collection" aria-labelledby="collection-title">
        <div className="collection-heading"><div className="collection-tabs"><button className={view === 'gallery' ? 'selected' : ''} onClick={() => setView('gallery')}><LayoutGrid size={17}/><span id={view === 'gallery' ? 'collection-title' : undefined}>Nossa galeria</span><small>{memories.length}</small></button><button className={view === 'timeline' ? 'selected' : ''} onClick={() => setView('timeline')}><CalendarDays size={17}/><span id={view === 'timeline' ? 'collection-title' : undefined}>Linha do tempo</span></button></div><span className="collection-caption">Pequenos instantes. Grandes histórias.</span></div>
        <div className="toolbar"><label className="search-input"><Search size={17}/><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar uma memória…" aria-label="Buscar uma memória"/></label><div className="filter-group"><label className="select-wrap"><CalendarDays size={15}/><select value={year} onChange={e => setYear(e.target.value)} aria-label="Filtrar por ano"><option value="all">Todos os anos</option>{years.map(y => <option key={y} value={y}>{y}</option>)}</select><ChevronDown size={13}/></label><label className="select-wrap sort-select"><ArrowDownUp size={15}/><select value={sort} onChange={e => setSort(e.target.value)} aria-label="Ordenar memórias"><option value="newest">Mais recentes</option><option value="oldest">Mais antigas</option></select><ChevronDown size={13}/></label></div></div>
        {storageError && <div className="error" role="alert">Não foi possível acessar o armazenamento deste navegador. Permita o armazenamento local ou tente outro navegador. Nenhuma memória foi carregada.</div>}
        {hasExamples && <div className="example-note"><span className="example-dot"/> Um pouco de inspiração: as fotos marcadas como “Exemplo” são ilustrativas. Adicione as suas para contar sua história.</div>}
        {loading ? <div className="empty-state"><LoaderCircle className="spin" size={30}/><h3>Preparando suas memórias…</h3></div> : visible.length === 0 ? <div className="empty-state"><div className="empty-icon"><Image size={32}/></div><h3>{query || year !== 'all' ? 'Nenhuma memória encontrada' : 'Toda história começa com um momento.'}</h3><p>{query || year !== 'all' ? 'Tente outra busca ou escolha um ano diferente.' : 'Adicione uma foto ou escreva sobre algo que merece ficar.'}</p>{query || year !== 'all' ? <button className="secondary-button" onClick={() => { setQuery(''); setYear('all'); }}>Limpar filtros</button> : <button className="primary-button" onClick={openNew}><Plus size={17}/>Adicionar primeira memória</button>}</div>
        : view === 'gallery' ? <div className="gallery">{visible.map(card)}</div> : <div className="timeline">{visible.map((m, i) => <div className="timeline-entry" key={m.id}>{(i === 0 || visible[i - 1].date.slice(0,4) !== m.date.slice(0,4)) && <div className="timeline-year">{m.date.slice(0,4)}</div>}<div className="timeline-row"><div className="timeline-date"><strong>{new Date(m.date + 'T12:00:00').getDate().toString().padStart(2, '0')}</strong><span>{new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(new Date(m.date + 'T12:00:00'))}</span></div><span className="timeline-dot"/><button className="timeline-card" onClick={() => setModal({ memory: m, mode: 'view' })}>{m.image ? <img src={m.image} alt={m.title} loading="lazy"/> : <div className="timeline-placeholder"><Heart size={30}/></div>}<div><span className="card-date">{formatDate(m.date)} {m.example && <span className="example-label">Exemplo</span>}</span><h3>{m.title}</h3><p>{m.text || 'Uma história esperando para ser contada.'}</p><span className="timeline-more">Ver memória <ArrowRight size={14}/></span></div></button></div></div>)}</div>}
        {!loading && visible.length > 0 && <footer className="collection-footer"><span>{visible.length} {visible.length === 1 ? 'memória' : 'memórias'} para revisitar</span><Heart size={13}/><span>Ainda há tanta história para escrever.</span></footer>}
      </section>
    </main>
    {modal && <MemoryModal memory={modal.memory} mode={modal.mode} onClose={() => setModal(null)} onSave={save} onDelete={remove}/>}
    {toast && <output className="toast"><Check size={18}/>{toast}<button aria-label="Fechar notificação" onClick={() => setToast('')}><X size={15}/></button></output>}
  </div>;
}