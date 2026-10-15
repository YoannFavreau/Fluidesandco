/* Bandeau cookies + Google Analytics (consentement RGPD / CNIL).
   - Rien n'est envoyé à Google tant que le visiteur n'a pas cliqué sur « Accepter ».
   - Le choix est mémorisé 6 mois (localStorage « fc-consent »). Le lien « Gérer mes cookies » du pied de page le rouvre.
   - L'identifiant Google Analytics se règle dans le <head> de chaque page (window.GA_ID). */
(function(){
  var KEY='fc-consent', MONTHS=6;
  function get(){try{var v=JSON.parse(localStorage.getItem(KEY)||'null');if(v&&Date.now()-v.t<MONTHS*30*864e5)return v.v}catch(e){}return null}
  function set(v){try{localStorage.setItem(KEY,JSON.stringify({v:v,t:Date.now()}))}catch(e){}}
  var loaded=false;
  function grant(){
    if(window.gtag)gtag('consent','update',{analytics_storage:'granted'});
    if(loaded||!window.GA_ID)return;loaded=true;
    var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+window.GA_ID;document.head.appendChild(s);
  }
  function revoke(){
    if(window.gtag)gtag('consent','update',{analytics_storage:'denied'});
    if(window.GA_ID)window['ga-disable-'+window.GA_ID]=true;
    // supprime les cookies _ga déposés auparavant
    var h=location.hostname.split('.'),d=[location.hostname];if(h.length>1)d.push('.'+h.slice(-2).join('.'));
    document.cookie.split(';').forEach(function(c){var n=c.split('=')[0].trim();if(/^_ga/.test(n))d.forEach(function(x){document.cookie=n+'=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain='+x;});document.cookie=n+'=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'})
  }
  function close(){var b=document.getElementById('ck');if(b)b.remove()}
  function choose(v){set(v);if(v==='granted'){window['ga-disable-'+window.GA_ID]=false;grant()}else revoke();close()}
  function open(){
    if(document.getElementById('ck'))return;
    var b=document.createElement('div');b.id='ck';b.setAttribute('role','dialog');b.setAttribute('aria-labelledby','ckt');b.setAttribute('aria-live','polite');
    var root=(document.body.dataset.root||'')+'mentions-legales/'+(location.protocol==='file:'?'index.html':'');
    b.innerHTML='<div class="ck-in"><div><p class="ck-t" id="ckt">Votre avis sur les cookies</p><p class="ck-p">J’utilise Google Analytics pour mesurer la fréquentation du site et l’améliorer. Aucune donnée n’est envoyée sans votre accord. <a href="'+root+'#cookies">En savoir plus</a></p></div><div class="ck-b"><button type="button" class="btn ghost" data-v="denied">Refuser</button><button type="button" class="btn cu" data-v="granted">Accepter</button></div></div>';
    b.addEventListener('click',function(e){var v=e.target.closest&&e.target.closest('[data-v]');if(v)choose(v.dataset.v)});
    var st=document.querySelector('.sticky');if(st)b.style.bottom=st.offsetHeight+'px';b.style.paddingBottom='12px';document.body.appendChild(b);
  }
  window.fcCookies=open;
  function init(){
    var v=get();
    if(v==='granted')grant();else if(v==='denied'){/* refus mémorisé */}else open();
    document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-cookies]');if(a){e.preventDefault();open()}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
