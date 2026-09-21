'use strict';
document.addEventListener('DOMContentLoaded',()=>{
 const paths={
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
  settings:'<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="8" cy="18" r="2"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  back:'<path d="m14 5-7 7 7 7"/>',
  camera:'<path d="M4 7h4l2-3h4l2 3h4v13H4z"/><circle cx="12" cy="13" r="4"/>',
  gallery:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 5-5 4 4 4-6 5 7"/>',
  pdf:'<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h6"/>',
  more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>'
 };
 const svg=name=>'<svg class="rks-icon" viewBox="0 0 24 24" aria-hidden="true">'+paths[name]+'</svg>';
 for(const [id,icon] of Object.entries({searchToggle:'search',settingsButton:'settings',addNtdButton:'plus'})){
  const el=document.getElementById(id);if(el)el.innerHTML=svg(icon);
 }
 for(const el of document.querySelectorAll('.detail-action')){
  const icon=el.querySelector('.detail-symbol,.more-dots');if(!icon)continue;
  icon.innerHTML=svg(el.classList.contains('pdf-action')?'pdf':el.classList.contains('more-action')?'more':/new/i.test(el.id)?'plus':'back');
 }
 for(const el of document.querySelectorAll('.media-button')){
  const icon=el.querySelector('span[aria-hidden]');if(icon)icon.innerHTML=svg(el.classList.contains('camera-button')?'camera':'gallery');
 }
 for(const el of document.querySelectorAll('.search-input-shell>span'))el.innerHTML=svg('search');
 for(const dialog of document.querySelectorAll('dialog')){
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
 }
});
