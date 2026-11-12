export type Memory = { id: string; title: string; text: string; date: string; image: string; example?: boolean };

export const examples: Memory[] = [
  { id: 'example-1', title: 'Onde o azul encontra a gente', text: 'Ruas pequenas, o som do mar e nenhum lugar melhor para estar. Uma viagem para guardar em todos os detalhes.', date: '2025-08-16', image: '/images/coast.jpg', example: true },
  { id: 'example-2', title: 'Só nós e o pôr do sol', text: 'Alguns momentos não precisam de muito. Uma caminhada, uma conversa e o céu fazendo sua parte.', date: '2025-07-20', image: '/images/sunset.jpg', example: true },
  { id: 'example-3', title: 'Um domingo sem pressa', text: 'A nossa receita favorita: uma tarde ao ar livre, coisas gostosas e tempo para ficar perto.', date: '2025-06-08', image: '/images/picnic.jpg', example: true },
  { id: 'example-4', title: 'Pequenas coisas, grandes memórias', text: 'Flores pelo caminho e um céu que parecia pintado à mão. A beleza estava bem ali.', date: '2025-05-12', image: '/images/flowers.jpg', example: true },
  { id: 'example-5', title: 'Um respiro no meio do mundo', text: 'O silêncio das montanhas e a certeza de que a melhor parte da viagem é a companhia.', date: '2025-03-22', image: '/images/lake.jpg', example: true },
  { id: 'example-6', title: 'O começo de mais uma aventura', text: 'Horizontes novos, histórias novas. Um dia de sol para lembrar sempre.', date: '2024-12-15', image: '/images/sea.jpg', example: true },
];

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('the-history-ab', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('collection');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadMemories(): Promise<Memory[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('collection', 'readonly');
    const req = tx.objectStore('collection').get('memories');
    req.onsuccess = () => resolve(req.result ?? examples);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
}

export async function saveMemories(memories: Memory[]): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('collection', 'readwrite');
    tx.objectStore('collection').put(memories, 'memories');
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
    tx.onabort = () => { db.close(); reject(tx.error); };
  });
}

export async function imageFromFile(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Escolha um arquivo de imagem.');
  if (file.size > 25 * 1024 * 1024) throw new Error('Escolha uma foto de até 25 MB.');
  let bitmap: ImageBitmap;
  try { bitmap = await createImageBitmap(file); } catch { throw new Error('Não foi possível abrir a foto. Tente JPG, PNG ou WebP.'); }
  const ratio = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * ratio);
  canvas.height = Math.round(bitmap.height * ratio);
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Não foi possível preparar a imagem.');
  context.fillStyle = '#fff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', 0.86);
}

export function formatDate(date: string, long = false) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: long ? 'long' : 'short', year: 'numeric' }).format(new Date(date + 'T12:00:00'));
}