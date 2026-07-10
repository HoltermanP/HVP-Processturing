/* ==========================================================================
   Documentformats — PDF/Word/Excel uploaden als bron voor het VTW-format,
   het rapportageformat en (voor toekomstige outputs) overige formats.

   Van een geüpload, compleet ingevuld voorbeelddocument wordt de tekst
   geëxtraheerd (client-side, met dynamisch geladen parsers) en in het
   bijbehorende formatveld gezet. Dat is dezelfde platte tekst die je ook
   zelf kunt typen/plakken — uploaden is puur een sneltoets om een bestaand
   document als startpunt te gebruiken. De AI gebruikt dit format vervolgens
   bij het opstellen van rapportages/VTW's (zie app.js/wijzigingen.js).

   Overige formats (nog zonder eigen AI-outputflow) worden bewaard in
   State.instellingen.overigeFormats zodat ze later te gebruiken/kopiëren zijn.
   ========================================================================== */
'use strict';

const DF_LIBS = {
  mammoth: 'https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js',
  xlsx: 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
  pdfjs: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js',
};
const DF_PDF_WORKER = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

const dfGeladen = {};
function dfLaadScript(url) {
  if (dfGeladen[url]) return dfGeladen[url];
  dfGeladen[url] = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = url;
    s.onload = resolve;
    s.onerror = () => reject(new Error('Kon de bestandslezer niet laden (controleer de internetverbinding)'));
    document.head.appendChild(s);
  });
  return dfGeladen[url];
}

async function dfExtractPdf(file) {
  await dfLaadScript(DF_LIBS.pdfjs);
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = DF_PDF_WORKER;
  const buf = await file.arrayBuffer();
  const doc = await window.pdfjsLib.getDocument({ data: buf }).promise;
  const paginas = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const pagina = await doc.getPage(p);
    const inhoud = await pagina.getTextContent();
    paginas.push(inhoud.items.map((it) => it.str).join(' '));
  }
  return paginas.join('\n\n');
}

async function dfExtractDocx(file) {
  await dfLaadScript(DF_LIBS.mammoth);
  const arrayBuffer = await file.arrayBuffer();
  const res = await window.mammoth.extractRawText({ arrayBuffer });
  return res.value;
}

async function dfExtractExcel(file) {
  await dfLaadScript(DF_LIBS.xlsx);
  const buf = await file.arrayBuffer();
  const wb = window.XLSX.read(new Uint8Array(buf), { type: 'array' });
  return wb.SheetNames.map((naam) => `## ${naam}\n${window.XLSX.utils.sheet_to_csv(wb.Sheets[naam])}`).join('\n\n');
}

function dfExtractPlainText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Kon bestand niet lezen'));
    reader.readAsText(file, 'utf-8');
  });
}

async function dfExtraheer(file) {
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  let tekst;
  if (ext === 'pdf') tekst = await dfExtractPdf(file);
  else if (ext === 'docx') tekst = await dfExtractDocx(file);
  else if (ext === 'xlsx' || ext === 'xls') tekst = await dfExtractExcel(file);
  else if (ext === 'txt' || ext === 'csv' || ext === 'md') tekst = await dfExtractPlainText(file);
  else throw new Error(`Bestandstype ".${ext}" wordt niet ondersteund — gebruik PDF, Word (.docx), Excel of tekst.`);
  if (!tekst.trim()) throw new Error('Er is geen tekst uit dit document te halen (mogelijk een gescande/afbeelding-PDF).');
  return tekst.replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim();
}

/* --------------------- Upload → tekstveld (VTW/rapport) ------------------ */
function dfKoppelFormatUpload(uploadId, textareaId, statusId) {
  const input = el(`#${uploadId}`);
  if (!input) return;
  input.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const status = el(`#${statusId}`);
    if (status) status.textContent = `"${file.name}" wordt gelezen…`;
    try {
      const tekst = await dfExtraheer(file);
      const ta = el(`#${textareaId}`);
      ta.value = tekst;
      ta.dispatchEvent(new Event('change'));
      if (status) status.textContent = `Format overgenomen uit "${file.name}" — controleer en pas zo nodig aan.`;
    } catch (err) {
      if (status) status.textContent = '';
      toast(`Inlezen mislukt: ${err.message}`, 'fout');
    }
  });
}

/* ----------------------------- Overige formats ---------------------------- */
function dfOverigeFormats() {
  return State.instellingen.overigeFormats || (State.instellingen.overigeFormats = []);
}

function dfBekijk(id) {
  const f = dfOverigeFormats().find((x) => x.id === id);
  if (!f) return;
  openModal(f.naam, `
    <div class="modal-veld"><label>Bron</label><span class="hint">${htmlEsc(f.bestandsnaam)} (${htmlEsc(f.bestandstype)}) · geüpload ${fmtDatum(f.datum)}</span></div>
    <div class="modal-veld"><label>Geëxtraheerde tekst</label><textarea rows="16" readonly>${htmlEsc(f.tekst)}</textarea></div>
    <div class="modal-foot">
      <button class="ghost" id="dfKopieer">Kopiëren</button>
      <button class="primair" id="dfSluiten">Sluiten</button>
    </div>`);
  el('#dfSluiten').addEventListener('click', sluitModal);
  el('#dfKopieer').addEventListener('click', () => {
    navigator.clipboard.writeText(f.tekst).then(() => toast('Tekst gekopieerd', 'ok'));
  });
}

function dfKoppelOverigUpload() {
  const input = el('#instOverigFormatUpload');
  if (!input) return;
  input.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      const tekst = await dfExtraheer(file);
      const ext = (file.name.split('.').pop() || '').toLowerCase();
      dfOverigeFormats().push({
        id: nieuwId('fmt'),
        naam: file.name.replace(/\.[^.]+$/, ''),
        bestandsnaam: file.name,
        bestandstype: ext.toUpperCase(),
        datum: isoDatum(new Date()),
        tekst,
      });
      State.bewaar();
      renderDocumentFormats();
      toast('Documentformat toegevoegd', 'ok');
    } catch (err) {
      toast(`Inlezen mislukt: ${err.message}`, 'fout');
    }
  });
}

/* --------------------------------- Render --------------------------------- */
function renderDocumentFormats() {
  const rTa = el('#instRapportFormat');
  if (rTa && document.activeElement !== rTa) rTa.value = State.instellingen.rapportFormat || '';

  const lijst = el('#overigFormatLijst');
  if (!lijst) return;
  const items = dfOverigeFormats();
  lijst.innerHTML = items.slice().reverse().map((f) => `
    <li><span>${htmlEsc(f.naam)} <span class="hint">(${htmlEsc(f.bestandstype)} · ${fmtDatum(f.datum)})</span></span>
      <span class="knoppenrij" style="gap:6px">
        <button class="bekijk" data-id="${f.id}">bekijken</button>
        <button class="verwijder" data-id="${f.id}">verwijderen</button>
      </span></li>`).join('')
    || '<li class="hint">Nog geen documentformats geüpload.</li>';
  els('#overigFormatLijst .bekijk').forEach((b) => b.addEventListener('click', () => dfBekijk(b.dataset.id)));
  els('#overigFormatLijst .verwijder').forEach((b) => b.addEventListener('click', () => {
    State.instellingen.overigeFormats = dfOverigeFormats().filter((f) => f.id !== b.dataset.id);
    State.bewaar();
    renderDocumentFormats();
  }));
}

/* ---------------------------------- Init ----------------------------------- */
function documentFormatsInit() {
  dfKoppelFormatUpload('instVtwFormatUpload', 'instVtwFormat', 'instVtwFormatUploadStatus');
  dfKoppelFormatUpload('instRapportFormatUpload', 'instRapportFormat', 'instRapportFormatUploadStatus');
  dfKoppelOverigUpload();
  const ta = el('#instRapportFormat');
  if (ta) ta.addEventListener('change', () => {
    State.instellingen.rapportFormat = ta.value;
    State.bewaar();
    toast('Rapportageformat opgeslagen', 'ok');
  });
}

/* --------------------------------- Export -------------------------------- */
if (typeof window !== 'undefined') {
  window.documentFormatsInit = documentFormatsInit;
  window.renderDocumentFormats = renderDocumentFormats;
}
