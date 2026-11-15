'use strict';
let data, currentAlbum, activePhotos = [], activeIndex = 0, trigger;
const $ = id => document.getElementById(id);
const dialog = $('lightbox');
const image = $('viewer-image');
const escapeHTML = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const columnCount = () => currentAlbum?.id === 'highlights' ? (innerWidth >= 1600 ? 4 : innerWidth >= 1024 ? 3 : 2) : (innerWidth >= 1180 ? 4 : innerWidth >= 720 ? 3 : 2);
function renderWall() {
  const curated = currentAlbum.id === 'highlights';
  $('photo-grid').classList.toggle('highlights-wall', curated);
  if (curated) {
    const grid = $('photo-grid');
    // Keep DOM and keyboard order identical to the curator's list.
    if (grid.dataset.curatedIds !== activePhotos.map(p => p.id).join(',')) {
      grid.innerHTML = activePhotos.map((p,i) => `<button type="button" class="photo-tile curated-photo ${i<2?'curated-hero':''}" data-index="${i}" data-photo-id="${p.id}" aria-label="Open photo ${i+1} of ${activePhotos.length}: ${escapeHTML(p.alt)}"><img src="${i<2?p.src:p.thumb}" ${i<2?'':`srcset="${p.thumb} ${Math.round(640 * Math.min(1,p.width/p.height))}w, ${p.src} ${Math.round(2048 * Math.min(1,p.width/p.height))}w" sizes="(min-width:1600px) 340px, (min-width:1024px) 440px, (min-width:600px) 46vw, 94vw"`} width="${p.width}" height="${p.height}" alt="${escapeHTML(p.alt)}" loading="${i<4?'eager':'lazy'}" decoding="async"><span class="zoom" aria-hidden="true">↗</span></button>`).join('');
      grid.dataset.curatedIds = activePhotos.map(p => p.id).join(',');
    }
    layoutHighlights();
    return;
  }
  delete $('photo-grid').dataset.curatedIds;
  $('photo-grid').style.height = '';
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
function layoutHighlights() {
  const grid = $('photo-grid');
  if (!grid.classList.contains('highlights-wall')) return;
  const width = grid.clientWidth;
  const gap = 14;
  const count = innerWidth >= 1600 ? 4 : innerWidth >= 1024 ? 3 : 2;
  const tileWidth = (width - gap * (count - 1)) / count;
  const heroColumns = 2;
  const heroWidth = (width - gap * (heroColumns - 1)) / heroColumns;
  const naturalHeroHeight = heroWidth * activePhotos[0].height / activePhotos[0].width;
  const heroHeight = Math.ceil(innerWidth >= 1024 ? Math.min(580, Math.max(420, naturalHeroHeight)) : naturalHeroHeight);
  const heroBlockHeight = heroColumns === 2 ? heroHeight : heroHeight * 2 + gap;
  const heights = Array(count).fill(heroBlockHeight + gap);
  const tiles = [...grid.children];
  tiles.forEach((tile,index) => {
    let x = index === 1 && heroColumns === 2 ? heroWidth + gap : 0;
    let y = index === 1 && heroColumns === 1 ? heroHeight + gap : 0;
    let w = heroWidth, h = heroHeight;
    if (index > 1) {
      // Lowest available top edge; tie goes to the leftmost column.
      // Positive tile heights make top edges monotonic in curator order.
      const column = heights.indexOf(Math.min(...heights));
      x = column * (tileWidth + gap);
      y = heights[column];
      w = tileWidth;
      h = Math.ceil(w * activePhotos[index].height / activePhotos[index].width);
      heights[column] = y + h + gap;
    }
    tile.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
  });
  grid.style.height = `${Math.max(...heights) - gap}px`;
}
function route() {
  const deepLink = /^#photo=(DSC_\d{4})$/.exec(location.hash);
  let id = deepLink ? 'all' : location.hash.replace(/^#(?:album\/)?/, '');
  if (id === 'group-photos') id = 'moments';
  if (!data.albums.some(a => a.id === id)) id = 'highlights';
  currentAlbum = data.albums.find(a => a.id === id);
  activePhotos = currentAlbum.ids.map(id => data.photos.find(p => p.id === id));
  $('photo-count').textContent = `${activePhotos.length} photographs`;
  $('filters').innerHTML = data.albums.filter(a => a.id !== 'parade').map(a => `<button type="button" class="filter-tab" role="tab" id="tab-${a.id}" aria-controls="photo-grid" aria-selected="${a.id === id}" tabindex="${a.id === id ? 0 : -1}" data-filter="${a.id}">${a.name}<span class="count">${a.ids.length}</span></button>`).join('');
  $('photo-grid').setAttribute('aria-labelledby', `tab-${id}`);
  renderWall();
  if (deepLink) {
    const index = activePhotos.findIndex(p => p.id === deepLink[1]);
    if (index >= 0) {
      trigger = null;
      updateViewer(index);
      if (!dialog.open) dialog.showModal();
      document.body.style.overflow = 'hidden';
      $('viewer-close').focus();
    }
  } else if (dialog.open) dialog.close();
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

const removalEmail = 'photographer@yizhoucp.com';
function removalRequest(photo) {
  const id = photo?.id || '';
  const subject = `Photo removal request${id ? ' — ' + id : ''}`;
  const body = [
    `Photo number: ${id}`,
    `Album: ${photo ? currentAlbum.name : ''}`,
    `Photo link: ${id ? 'https://www.jasonchen.ai/uplands-iff-2026/#photo=' + id : ''}`,
    '',
    "Who is in the photo (e.g. me / my child, what they're wearing): ",
    'Request: remove the photo / blur a face (choose one): ',
    'Your name (optional): ',
    '',
    'Sent from the photo album removal link.'
  ].join('\r\n');
  return {subject, body, mailto:`mailto:${removalEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`};
}
$('footer-removal').href = removalRequest().mailto;
$('viewer-copy-request').addEventListener('click', async () => {
  const request = removalRequest(activePhotos[activeIndex]);
  const text = `To: ${removalEmail}\r\nSubject: ${request.subject}\r\n\r\n${request.body}`;
  let copied = false;
  try { await navigator.clipboard.writeText(text); copied = true; } catch {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('aria-label', 'Copy photo removal request');
    field.style.cssText = 'position:fixed;left:0;top:0;opacity:0';
    dialog.appendChild(field);
    field.focus(); field.select();
    try { copied = document.execCommand('copy'); } catch {}
    field.remove();
    $('viewer-copy-request').focus();
  }
  $('removal-status').textContent = copied
    ? `Copied — paste into any email to ${removalEmail}`
    : 'Copy unavailable. Select and copy the request below.';
  $('removal-copy-fallback').hidden = copied;
  $('removal-copy-fallback').value = copied ? '' : text;
});

let imageGeneration = 0;
function clearViewerImage() {
  resetPhotoZoom();
  image.hidden = true;
  image.removeAttribute('src');
  image.alt = '';
}
async function loadViewerImage(photo) {
  const generation = ++imageGeneration;
  clearViewerImage();
  const status = $('viewer-image-status');
  status.hidden = false;
  status.textContent = 'Loading photo…';
  const pending = new Image();
  pending.src = photo.src;
  try {
    await pending.decode();
    if (generation !== imageGeneration) return;
    image.src = photo.src;
    image.alt = photo.alt;
    await image.decode();
    if (generation !== imageGeneration) return;
    image.hidden = false;
    status.hidden = true;
    window.iffTrack?.('photo_view', photo.id);
  } catch {
    if (generation !== imageGeneration) return;
    clearViewerImage();
    status.textContent = 'Unable to load this photo. Please reopen it to try again.';
  }
}
function updateViewer(index) {
  activeIndex = (index + activePhotos.length) % activePhotos.length;
  const photo = activePhotos[activeIndex];
  loadViewerImage(photo);
  $('viewer-counter').textContent = `${currentAlbum.name} · ${activeIndex + 1} / ${activePhotos.length}`;
  $('viewer-name').textContent = photo.id;
  $('viewer-removal').href = removalRequest(photo).mailto;
  $('removal-status').textContent = '';
  $('removal-copy-fallback').hidden = true;
  $('removal-copy-fallback').value = '';
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
$('viewer-close').onclick = () => { ++imageGeneration; clearViewerImage(); dialog.close(); };
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
  const sharedPhotoId = preparedId;
  shareButton.disabled = true;
  try {
    // File is prepared before this gesture: Safari requires immediate user activation.
    await navigator.share({files:[file]});
    window.iffTrack?.('share', sharedPhotoId);
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
    window.iffTrack?.('download', photo.id);
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
dialog.addEventListener('close', () => { if (dialog.open) return; ++imageGeneration; clearViewerImage(); $('viewer-image-status').hidden = true; document.body.style.overflow = ''; trigger?.focus({preventScroll:true}); });
dialog.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { e.preventDefault(); updateViewer(activeIndex + 1); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); updateViewer(activeIndex - 1); }
});
let photoZoom = 1, photoPan = {x:0,y:0}, gesture = null, lastTap = 0;
const stage = $('viewer-stage');
function resetPhotoZoom() {
  photoZoom = 1;
  photoPan = {x:0,y:0};
  gesture = null;
  image.style.transform = '';
}
function applyPhotoZoom() {
  const maxX = Math.max(0, (image.offsetWidth * photoZoom - stage.clientWidth) / 2);
  const maxY = Math.max(0, (image.offsetHeight * photoZoom - stage.clientHeight) / 2);
  photoPan.x = Math.max(-maxX, Math.min(maxX, photoPan.x));
  photoPan.y = Math.max(-maxY, Math.min(maxY, photoPan.y));
  image.style.transform = `translate(${photoPan.x}px, ${photoPan.y}px) scale(${photoZoom})`;
}
function pinchPoints(touches) {
  const a = touches[0], b = touches[1];
  return {distance:Math.hypot(b.clientX-a.clientX,b.clientY-a.clientY),x:(a.clientX+b.clientX)/2,y:(a.clientY+b.clientY)/2};
}
stage.addEventListener('touchstart', e => {
  if (image.hidden || e.target.closest('button')) return;
  if (e.touches.length >= 2) {
    const point = pinchPoints(e.touches);
    gesture = {kind:'pinch',point,zoom:photoZoom,pan:{...photoPan}};
  } else {
    const t = e.touches[0];
    gesture = {kind:photoZoom>1?'pan':'swipe',x:t.clientX,y:t.clientY,pan:{...photoPan},moved:false};
  }
}, {passive:true});
stage.addEventListener('touchmove', e => {
  if (!gesture) return;
  e.preventDefault();
  if (gesture.kind === 'pinch' && e.touches.length >= 2) {
    const point = pinchPoints(e.touches), start = gesture.point;
    photoZoom = Math.max(1, Math.min(4, gesture.zoom * point.distance / Math.max(start.distance,1)));
    const ratio = photoZoom / gesture.zoom;
    const box = stage.getBoundingClientRect();
    photoPan = {
      x:gesture.pan.x + point.x-start.x + (start.x-box.left-box.width/2-gesture.pan.x)*(1-ratio),
      y:gesture.pan.y + point.y-start.y + (start.y-box.top-box.height/2-gesture.pan.y)*(1-ratio)
    };
    applyPhotoZoom();
  } else if (gesture.kind !== 'pinch' && e.touches.length === 1) {
    const t = e.touches[0];
    gesture.moved ||= Math.hypot(t.clientX-gesture.x,t.clientY-gesture.y)>10;
    if (gesture.kind === 'pan') {
      photoPan = {x:gesture.pan.x+t.clientX-gesture.x,y:gesture.pan.y+t.clientY-gesture.y};
      applyPhotoZoom();
    }
  }
}, {passive:false});
stage.addEventListener('touchend', e => {
  if (!gesture) return;
  if (gesture.kind === 'pinch') {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      gesture = {kind:'pan',x:t.clientX,y:t.clientY,pan:{...photoPan},moved:true};
    } else gesture = null;
    lastTap = 0;
    return;
  }
  const current = gesture;
  gesture = null;
  const t = e.changedTouches[0], dx=t.clientX-current.x, dy=t.clientY-current.y;
  if (current.kind === 'swipe' && Math.abs(dx)>50 && Math.abs(dx)>Math.abs(dy)*1.5) {
    lastTap = 0;
    updateViewer(activeIndex+(dx<0?1:-1));
  } else if (!current.moved && Math.abs(dx)<10 && Math.abs(dy)<10) {
    const now = Date.now();
    if (now-lastTap<300) {
      if (photoZoom>1) resetPhotoZoom();
      else {photoZoom=2;applyPhotoZoom();}
      lastTap=0;
    } else lastTap=now;
  }
}, {passive:true});
stage.addEventListener('touchcancel', () => {gesture=null;lastTap=0;}, {passive:true});
fetch('photos.json?v=20261115-8').then(r => { if (!r.ok) throw Error('Unable to load photos'); return r.json(); }).then(value => {
  data = value;
  data.albums.splice(1, 0, {id:'all',name:'All',ids:data.photos.map(p => p.id)});
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
