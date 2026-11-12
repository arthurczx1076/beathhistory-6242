import { useEffect, useRef, useState } from 'react';
import { CalendarDays, ImagePlus, LoaderCircle, Pencil, Trash2, X, Heart, ArrowLeft } from 'lucide-react';
import { formatDate, imageFromFile, type Memory } from '../lib/memories';

type Props = { memory: Memory | null; mode: 'view' | 'edit'; onClose: () => void; onSave: (memory: Memory) => Promise<void>; onDelete: (id: string) => Promise<void> };

export function MemoryModal({ memory, mode, onClose, onSave, onDelete }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [editing, setEditing] = useState(mode === 'edit');
  const [title, setTitle] = useState(memory?.title ?? '');
  const [text, setText] = useState(memory?.text ?? '');
  const [date, setDate] = useState(memory?.date ?? new Date().toLocaleDateString('en-CA'));
  const [image, setImage] = useState(memory?.image ?? '');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, []);

  async function upload(file?: File) {
    if (!file) return;
    setUploading(true); setError('');
    try { setImage(await imageFromFile(file)); } catch (e) { setError(e instanceof Error ? e.message : 'Não foi possível abrir a imagem.'); }
    finally { setUploading(false); }
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError('Escreva um título para sua memória.'); return; }
    setBusy(true); setError('');
    try {
      await onSave({ id: memory?.id ?? crypto.randomUUID(), title: title.trim(), text: text.trim(), date, image });
      onClose();
    } catch { setError('Não foi possível salvar neste navegador. Verifique o espaço disponível e tente novamente.'); }
    finally { setBusy(false); }
  }
  async function remove() {
    if (!memory) return;
    setBusy(true); setError('');
    try { await onDelete(memory.id); onClose(); }
    catch { setError('Não foi possível excluir. Tente novamente.'); }
    finally { setBusy(false); }
  }

  return <dialog ref={dialog} className="memory-dialog" aria-labelledby="modal-title" onCancel={e => { e.preventDefault(); if (!busy && !uploading) onClose(); }}>
    <div className="modal-inner">
      <header className="modal-header"><div><span className="eyebrow">UM PEDACINHO DA NOSSA HISTÓRIA</span><h2 id="modal-title">{deleting ? 'Excluir esta memória?' : editing ? memory ? 'Editar memória' : 'Uma nova memória' : memory?.title}</h2></div><button className="icon-button" aria-label="Fechar" onClick={onClose} disabled={busy || uploading}><X size={21}/></button></header>
      {deleting ? <div className="delete-panel"><Trash2 size={32}/><p>A memória <strong>“{memory?.title}”</strong> será excluída deste navegador. Esta ação não pode ser desfeita.</p>{error && <p className="error" role="alert">{error}</p>}<div className="modal-actions"><button className="secondary-button" onClick={() => setDeleting(false)} disabled={busy}>Cancelar</button><button className="danger-button" onClick={remove} disabled={busy}>{busy ? <LoaderCircle className="spin" size={17}/> : <Trash2 size={17}/>}Excluir memória</button></div></div>
      : editing ? <form onSubmit={submit}>
        <input ref={fileInput} type="file" accept="image/*" aria-label="Escolher foto" hidden onChange={e => { void upload(e.target.files?.[0]); e.target.value = ''; }} />
        <button type="button" className={'upload-area ' + (image ? 'has-image' : '')} onClick={() => fileInput.current?.click()} disabled={uploading || busy}>
          {image && <img src={image} alt="Prévia da memória"/>}<span>{uploading ? <LoaderCircle className="spin" size={26}/> : <ImagePlus size={26}/>}<strong>{uploading ? 'Preparando foto…' : image ? 'Trocar foto' : 'Escolha uma foto'}</strong><small>{image ? 'Clique para escolher outra imagem' : 'JPG, PNG ou WebP · até 25 MB · opcional'}</small></span>
        </button>
        <div className="form-row"><label>Título<input aria-label="Título" autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="Como você quer lembrar desse dia?" required maxLength={100}/></label><label className="date-field">Data<input aria-label="Data" type="date" value={date} onChange={e => setDate(e.target.value)} required min="0001-01-01" max="9999-12-31"/></label></div>
        <label className="text-label">A história por trás da foto<textarea aria-label="A história por trás da foto" value={text} onChange={e => setText(e.target.value)} placeholder="Escreva sobre esse momento, os detalhes, o que você sentiu…" rows={4} maxLength={10000}/></label>
        {memory?.example && <p className="form-note">Esta é uma memória de exemplo. Ao salvar, ela passa a ser sua.</p>}
        {error && <p className="error" role="alert">{error}</p>}
        <footer className="modal-actions"><button type="button" className="secondary-button" onClick={onClose} disabled={busy || uploading}>Cancelar</button><button className="primary-button" type="submit" disabled={busy || uploading}>{busy ? <LoaderCircle className="spin" size={17}/> : <Heart size={17}/>} {busy ? 'Salvando…' : 'Salvar memória'}</button></footer>
      </form> : <div className="memory-detail">
        {memory?.image ? <img className="detail-image" src={memory.image} alt={memory.title}/> : <div className="detail-no-image"><Heart size={45}/></div>}
        <div className="detail-date"><CalendarDays size={16}/>{memory && formatDate(memory.date, true)}{memory?.example && <span className="example-label">Exemplo</span>}</div>
        <p className="detail-text">{memory?.text || 'Cada momento tem uma história. Clique em editar para escrever a sua.'}</p>
        <footer className="modal-actions"><button className="delete-link" onClick={() => setDeleting(true)}><Trash2 size={17}/>Excluir</button><button className="primary-button" onClick={() => setEditing(true)}><Pencil size={16}/>Editar memória</button></footer>
      </div>}
      {deleting && <button className="back-link" onClick={() => setDeleting(false)} disabled={busy}><ArrowLeft size={14}/>Voltar à memória</button>}
    </div>
  </dialog>;
}