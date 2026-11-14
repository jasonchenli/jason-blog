'use strict';
let data, currentAlbum, activePhotos = [], activeIndex = 0, trigger;
const $ = id => document.getElementById(id);
const dialog = $('lightbox');
const image = $('viewer-image');
const escapeHTML = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const columnCount = () => innerWidth >= 1180 ? 4 : innerWidth >= 720 ? 3 : 2;
function renderWall() {
  const columns = Array.from({length:columnCount()}, () => []);
  const heights = columns.map(() => 0);
  const grid = $('photo-grid');
  const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
  const width = (grid.clientWidth - gap * (columns.length - 1)) / columns.length;
  activePhotos.forEach((p, i) => {
    const column = heights.indexOf(Math.min(...heights));
    columns[column].push(`<button type="button" class="photo-tile" data-index="${i}" aria-label="Open photo ${i + 1} of ${activePhotos.length}: ${escapeHTML(p.alt)}"><img src="${p.thumb}" width="${p.width}" height="${p.height}" alt="${escapeHTML(p.alt)}" loading="${i < 8 ? 'eager' : 'lazy'}" decoding="async"><span class="zoom" aria-hidden="true">↗</span></button>`);
    heights[column] += width * p.height / p.width + gap;
  });
  $('photo-grid').innerHTML = columns.map(c => `<div class="photo-column">${c.join('')}</div>`).join('');
}
function route() {
  let id = location.hash.replace(/^#(?:album\/)?/, '');
  if (id === 'group-photos') id = 'moments';
  if (!data.albums.some(a => a.id === id)) id = 'all';
  currentAlbum = data.albums.find(a => a.id === id);
  activePhotos = currentAlbum.ids.map(id => data.photos.find(p => p.id === id));
  $('photo-count').textContent = `${activePhotos.length} photographs`;
  $('filters').innerHTML = data.albums.map(a => `<button type="button" class="filter-tab" role="tab" id="tab-${a.id}" aria-controls="photo-grid" aria-selected="${a.id === id}" tabindex="${a.id === id ? 0 : -1}" data-filter="${a.id}">${a.name}<span class="count">${a.ids.length}</span></button>`).join('');
  $('photo-grid').setAttribute('aria-labelledby', `tab-${id}`);
  renderWall();
  document.title = `${id === 'all' ? 'The Photo Wall' : currentAlbum.name} — UPTA International Food Fair 2026`;
}
$('filters').addEventListener('click', e => {
  const button = e.target.closest('[data-filter]');
  if (!button) return;
  const id = button.dataset.filter;
  history.replaceState(null, '', `#${id}`);
  route();
  $(`tab-${id}`).focus({preventScroll:true});
});
$('filters').addEventListener('keydown', e => {
  if (!['ArrowRight','ArrowLeft','Home','End'].includes(e.key)) return;
  e.preventDefault();
  const buttons = [...$('filters').querySelectorAll('button')];
  const i = buttons.indexOf(document.activeElement);
  const next = e.key === 'Home' ? 0 : e.key === 'End' ? buttons.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
  buttons[next].click();
});
function updateViewer(index) {
  activeIndex = (index + activePhotos.length) % activePhotos.length;
  const photo = activePhotos[activeIndex];
  image.src = photo.src;
  image.alt = photo.alt;
  $('viewer-counter').textContent = `${currentAlbum.name} · ${activeIndex + 1} / ${activePhotos.length}`;
  $('viewer-name').textContent = photo.id;
  const subject = encodeURIComponent(`Photo removal request — ${photo.id}`);
  const body = encodeURIComponent(`I would like to request removal of photo ${photo.id} from UPTA International Food Fair 2026.\n\nDetails:\n`);
  $('viewer-removal').href = `mailto:photographer@yizhoucp.com?subject=${subject}&body=${body}`;
  $('viewer-download').href = photo.download;
  $('viewer-download').download = `${photo.id}-UPTA-2026.jpg`;
  prepareShare(photo);
  const preload = new Image();
  preload.src = activePhotos[(activeIndex + 1) % activePhotos.length].src;
}
$('photo-grid').addEventListener('click', e => {
  const button = e.target.closest('[data-index]');
  if (!button) return;
  trigger = button;
  updateViewer(Number(button.dataset.index));
  dialog.showModal();
  document.body.style.overflow = 'hidden';
  $('viewer-close').focus();
});
$('viewer-close').onclick = () => dialog.close();
$('viewer-prev').onclick = () => updateViewer(activeIndex - 1);
$('viewer-next').onclick = () => updateViewer(activeIndex + 1);
const shareButton = $('viewer-share');
const supportsFileShare = Boolean(navigator.share && navigator.canShare?.({files:[new File([''], 'photo.jpg', {type:'image/jpeg'})]}));
let preparedPhoto, preparedPromise, preparedId;
let viewerGeneration = 0;
let downloadBusy = false;
async function jpegFile(photo) {
  const response = await fetch(photo.download, {signal:AbortSignal.timeout(30000)});
  if (!response.ok) throw Error('Photo unavailable');
  const bitmap = await createImageBitmap(await response.blob());
  const canvas = document.createElement('canvas');
  try {
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext('2d', {alpha:false}).drawImage(bitmap, 0, 0);
    const jpeg = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.94));
    if (!jpeg) throw Error('Unable to prepare photo');
    return new File([jpeg], `${photo.id}-UPTA-2026.jpg`, {type:'image/jpeg'});
  } finally {
    bitmap.close();
    canvas.width = canvas.height = 0;
  }
}
function getPhotoFile(photo) {
  if (preparedId !== photo.id) {
    preparedId = photo.id;
    preparedPhoto = null;
    preparedPromise = jpegFile(photo);
  }
  return preparedPromise;
}
function prepareShare(photo) {
  const generation = ++viewerGeneration;
  $('download-status').textContent = '';
  shareButton.hidden = !supportsFileShare;
  if (!supportsFileShare) return;
  shareButton.disabled = true;
  shareButton.textContent = 'Preparing…';
  getPhotoFile(photo).then(file => {
    if (generation !== viewerGeneration) return;
    preparedPhoto = file;
    shareButton.textContent = 'Save / share photo';
    shareButton.disabled = false;
    $('download-status').textContent = 'iPhone: tap Save / share, then Save Image.';
  }).catch(() => {
    if (generation !== viewerGeneration) return;
    preparedId = null;
    shareButton.hidden = true;
    $('download-status').textContent = 'Use Download photo to try again.';
  });
}
shareButton.addEventListener('click', async () => {
  if (!preparedPhoto || shareButton.disabled) return;
  const file = preparedPhoto;
  shareButton.disabled = true;
  try {
    // File is prepared before this gesture: Safari requires immediate user activation.
    await navigator.share({files:[file]});
    $('download-status').textContent = 'Choose Save Image in the share menu to add it to Photos.';
  } catch (error) {
    if (error.name !== 'AbortError') $('download-status').textContent = 'Sharing unavailable. Use Download photo, then save the image.';
  } finally {
    shareButton.disabled = !preparedPhoto;
  }
});
$('viewer-download').addEventListener('click', async e => {
  e.preventDefault();
  if (downloadBusy) return;
  downloadBusy = true;
  const photo = activePhotos[activeIndex];
  const link = $('viewer-download');
  link.setAttribute('aria-busy', 'true');
  link.textContent = 'Preparing photo…';
  $('download-status').textContent = '';
  try {
    const file = await getPhotoFile(photo);
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = file.name;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    $('download-status').textContent = 'JPG downloaded. On iPhone, use Save / share to save to Photos.';
  } catch {
    if (preparedId === photo.id) preparedId = null;
    $('download-status').textContent = 'Unable to download this photo. Please try again.';
  } finally {
    link.removeAttribute('aria-busy');
    link.innerHTML = 'Download photo <span aria-hidden="true">↓</span>';
    downloadBusy = false;
  }
});
dialog.addEventListener('close', () => { document.body.style.overflow = ''; trigger?.focus({preventScroll:true}); });
dialog.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { e.preventDefault(); updateViewer(activeIndex + 1); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); updateViewer(activeIndex - 1); }
});
let touch;
$('viewer-stage').addEventListener('touchstart', e => { touch = {x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY}; }, {passive:true});
$('viewer-stage').addEventListener('touchend', e => {
  if (!touch) return;
  const dx = e.changedTouches[0].clientX - touch.x, dy = e.changedTouches[0].clientY - touch.y;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) updateViewer(activeIndex + (dx < 0 ? 1 : -1));
  touch = null;
}, {passive:true});
fetch('photos.json').then(r => { if (!r.ok) throw Error('Unable to load photos'); return r.json(); }).then(value => {
  data = value;
  data.albums.unshift({id:'all',name:'All Photos',ids:data.photos.map(p => p.id)});
  window.addEventListener('hashchange', route);
  let frame;
  let layoutWidth = $('photo-grid').clientWidth;
  let layoutColumns = columnCount();
  window.addEventListener('resize', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const width = $('photo-grid').clientWidth;
      const columns = columnCount();
      // Mobile Safari resizes the viewport height as its toolbar moves.
      // Keep existing image nodes unless the actual wall width or columns change.
      if (width === layoutWidth && columns === layoutColumns) return;
      layoutWidth = width;
      layoutColumns = columns;
      renderWall();
    });
  });
  route();
  layoutWidth = $('photo-grid').clientWidth;
  layoutColumns = columnCount();
}).catch(() => { $('load-error').hidden = false; });
