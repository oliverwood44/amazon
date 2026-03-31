(function(){
  var cfg = window.SITE_CONFIG || {};
  var defaults = {
    brandName: "Atelier Rangement",
    amazonUrl: "#",
    pinterestTagId: "2612629233865",
    defaultBoard: "Organisation cuisine",
    supportEmail: "bonjour@example.com"
  };
  cfg = Object.assign({}, defaults, cfg);

  var brand = document.getElementById('brandName');
  var footerBrand = document.getElementById('footerBrandName');
  if (brand) brand.textContent = cfg.brandName;
  if (footerBrand) footerBrand.textContent = cfg.brandName;

  var url = new URL(window.location.href);
  var qs = new URLSearchParams(url.search);
  var sourceSnapshot = {};
  ['src','utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function(key){
    var value = qs.get(key);
    if (value) sourceSnapshot[key] = value;
  });
  if (Object.keys(sourceSnapshot).length){
    try { localStorage.setItem('apf_last_source', JSON.stringify(sourceSnapshot)); } catch(e){}
  } else {
    try {
      var cached = localStorage.getItem('apf_last_source');
      if (cached) sourceSnapshot = JSON.parse(cached);
    } catch(e){}
  }

  function enrichAmazonUrl(baseUrl){
    if (!baseUrl || baseUrl === '#') return '#';
    var out = new URL(baseUrl, window.location.origin);
    if (sourceSnapshot.src && !out.searchParams.get('src')) out.searchParams.set('src', sourceSnapshot.src);
    if (sourceSnapshot.utm_source && !out.searchParams.get('utm_source')) out.searchParams.set('utm_source', sourceSnapshot.utm_source);
    if (sourceSnapshot.utm_medium && !out.searchParams.get('utm_medium')) out.searchParams.set('utm_medium', sourceSnapshot.utm_medium);
    if (sourceSnapshot.utm_campaign && !out.searchParams.get('utm_campaign')) out.searchParams.set('utm_campaign', sourceSnapshot.utm_campaign);
    if (sourceSnapshot.utm_content && !out.searchParams.get('utm_content')) out.searchParams.set('utm_content', sourceSnapshot.utm_content);
    if (sourceSnapshot.utm_term && !out.searchParams.get('utm_term')) out.searchParams.set('utm_term', sourceSnapshot.utm_term);
    return out.toString();
  }

  function bindButtons(){
    var finalUrl = enrichAmazonUrl(cfg.amazonUrl);
    document.querySelectorAll('.js-amazon-link').forEach(function(el){
      el.setAttribute('href', finalUrl);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener sponsored nofollow');
      el.addEventListener('click', function(){
        if (window.pintrk) {
          window.pintrk('track', 'lead', {
            lead_type: 'amazon_click',
            pin_src: sourceSnapshot.src || 'unknown'
          });
        }
      });
    });
  }

  function injectPinterestTag(){
    if (!cfg.pinterestTagId || cfg.pinterestTagId.indexOf('REPLACE') === 0) return;
    !function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
    n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");
    t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];
    r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
    window.pintrk('load', cfg.pinterestTagId);
    window.pintrk('page');
    window.pintrk('track', 'pagevisit', {page_name: 'landing'});
  }

  injectPinterestTag();
  bindButtons();
})();
