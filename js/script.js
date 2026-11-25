const highlights = document.getElementById('destaques');
bootstrap.Carousel.getOrCreateInstance(highlights);
highlights.addEventListener('slid.bs.carousel', event => {
  const previousSlide = highlights.querySelectorAll('.carousel-item')[event.from];
  if (previousSlide.contains(document.activeElement)) {
    highlights.querySelector('.campaign-indicators .active').focus();
  }
});

const techniques = [
 {
  id: 'capping',
  effect: 'intenso',
  name: 'Capping',
  type: 'VOLUME E DURABILIDADE',
  photoAlt: 'Dois closes de olhos com cílios volumosos',
  desc: 'Indico o Capping para quem gosta de cílios bem volumosos e preenchidos. A extensão dura até 30 dias, sem manutenção, e deixa o olhar marcante.',
  more: 'Depois desse período, faço uma nova aplicação. Como a durabilidade é maior, o valor é um pouco mais alto que o das outras técnicas.'
 },
 {id:'brasileiro',photo:'olhar-definido',effect:'leve',name:'Volume Brasileiro',type:'LEVE E DEFINIDO',desc:'Uma extensão de acabamento leve, alinhado e bem definido. Versátil para quem prefere um toque discreto no dia a dia, mantendo a naturalidade dos fios.',more:'Busco definir seu olhar com delicadeza, respeitando as características dos seus cílios naturais.'},
 {id:'egipcio',effect:'volume',name:'Volume Egípcio',type:'PREENCHIMENTO DELICADO',desc:'Fios mais preenchidos, com volume e acabamento delicado. Uma opção para quem gosta de definição visível sem abrir mão de um estilo equilibrado.',more:'Adapto o desenho aos seus cílios naturais e ao efeito que você prefere.'},
 {id:'glamour',photo:'detalhe-cilios',effect:'volume',name:'Volume Glamour',type:'DENSIDADE E DEFINIÇÃO',desc:'Mais densidade e preenchimento, com um acabamento encorpado e delicado. Uma técnica para quem aprecia cílios destacados e um estilo expressivo.',more:'Distribuo os fios de acordo com o formato dos seus olhos e com o acabamento que você prefere.'},
 {id:'ingles',effect:'volume',name:'Volume Inglês',type:'VOLUME EQUILIBRADO',desc:'Bastante preenchimento com um acabamento sofisticado e equilibrado. Uma alternativa para quem gosta de volume visível e de um estilo versátil.',more:'Ajusto a intensidade do volume conforme seus cílios naturais.'},
 {id:'mega',effect:'intenso',name:'Mega Volume',type:'EFEITO INTENSO',desc:'Um acabamento expressivo, com bastante volume e fios preenchidos. Ideal para quem prefere a estética de cílios intensos.',more:'Personalizo o volume para criar um efeito marcante, respeitando seus cílios naturais.'}
];
const cards = document.getElementById('cards');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const catalogStatus = document.getElementById('catalog-status');
const filters = document.querySelectorAll('#tecnicas [data-effect]');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const cardById = new Map();

const detail = document.getElementById('detail');
const agenda = document.getElementById('agenda');
const agendaCopy = document.getElementById('chosen');
const agendaLink = document.getElementById('agenda-wa');
const defaultAgendaCopy = agendaCopy.textContent;
const whatsapp = 'https://wa.me/5512974063644?text=';
let selection;
let bookingFromDetail = false;

function showDetail(technique, trigger) {
  selection = { technique, trigger };
  document.getElementById('detail-title').textContent = technique.name;
  document.getElementById('detail-desc').textContent = technique.desc + ' ' + technique.more;
  const photo = document.getElementById('detail-img');
  photo.src = `assets/${technique.photo ?? technique.id}.webp`;
  photo.alt = technique.photoAlt ?? `Detalhe de ${technique.name}`;
  bootstrap.Modal.getOrCreateInstance(detail).show(trigger);
}

function defaultAgenda() {
  agendaCopy.textContent = defaultAgendaCopy;
  agendaLink.href = whatsapp + encodeURIComponent('Olá, Pietra! Gostaria de saber mais sobre os atendimentos.');
}

defaultAgenda();
document.getElementById('detail-book').addEventListener('click', () => {
  const { technique } = selection;
  bookingFromDetail = true;
  detail.addEventListener('hidden.bs.modal', () => {
    agendaCopy.textContent = `Quer agendar a aplicação de ${technique.name}? Me chame pelo WhatsApp para consultar valores e horários.`;
    agendaLink.href = whatsapp + encodeURIComponent(`Olá, Pietra! Gostaria de saber mais sobre ${technique.name}.`);
    bootstrap.Modal.getOrCreateInstance(agenda).show();
  }, { once: true });
  bootstrap.Modal.getOrCreateInstance(detail).hide();
});

detail.addEventListener('hidden.bs.modal', () => {
  if (!bookingFromDetail) selection?.trigger.focus();
});

agenda.addEventListener('hidden.bs.modal', () => {
  defaultAgenda();
  if (bookingFromDetail) {
    bookingFromDetail = false;
    selection.trigger.focus();
  }
});

techniques.forEach(technique => {
  const card = document.createElement('article');
  card.className = 'service';
  card.id = technique.id;
  card.innerHTML = `
    <div class="service-img glow tilt">
      <img src="assets/${technique.photo ?? technique.id}.webp" alt="${technique.photoAlt ?? `Detalhe da técnica ${technique.name}`}" loading="lazy" decoding="async">
    </div>
    <div class="service-body">
      <div class="eyebrow">${technique.type}</div>
      <h3>${technique.name}</h3>
      <p>${technique.desc}</p>
      <button class="detail-link" type="button" aria-label="Conheça a técnica ${technique.name}">Conheça a técnica</button>
    </div>
  `;
  card.querySelector('button').addEventListener('click', event => showDetail(technique, event.currentTarget));
  cards.append(card);
  cardById.set(technique.id, card);
});

function updateCarouselControls() {
  prev.disabled = cards.scrollLeft < 3;
  next.disabled = cards.scrollLeft + cards.clientWidth >= cards.scrollWidth - 3;
}

function scrollBehavior() {
  return reduceMotion.matches ? 'instant' : 'smooth';
}

function moveCarousel(direction) {
  const firstCard = cards.querySelector('.service:not([hidden])');
  const gap = parseFloat(getComputedStyle(cards).columnGap) || 0;
  cards.scrollBy({ left: direction * (firstCard.offsetWidth + gap), behavior: scrollBehavior() });
}

function filterCatalog(effect) {
  let visible = 0;
  techniques.forEach(technique => {
    const show = effect === 'todos' || technique.effect === effect;
    cardById.get(technique.id).hidden = !show;
    if (show) visible += 1;
  });
  filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.effect === effect)));
  if (catalogStatus) catalogStatus.textContent = visible === 1 ? '1 técnica' : `${visible} técnicas`;
  cards.scrollTo({ left: 0, behavior: 'instant' });
  updateCarouselControls();
}

filters.forEach(button => button.addEventListener('click', () => filterCatalog(button.dataset.effect)));
document.querySelectorAll('[data-catalog-effect]').forEach(link => {
  link.addEventListener('click', () => filterCatalog(link.dataset.catalogEffect));
});
prev.addEventListener('click', () => moveCarousel(-1));
next.addEventListener('click', () => moveCarousel(1));
cards.addEventListener('scroll', updateCarouselControls, { passive: true });
window.addEventListener('resize', updateCarouselControls);
filterCatalog('todos');

cards.addEventListener('keydown', event => {
  if (event.target !== cards || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  const goingBack = event.key === 'ArrowLeft';
  if (goingBack ? prev.disabled : next.disabled) return;
  event.preventDefault();
  moveCarousel(goingBack ? -1 : 1);
});

window.addEventListener('hashchange', () => {
  const card = cardById.get(location.hash.slice(1));
  if (card?.hidden) {
    filterCatalog('todos');
    card.scrollIntoView({ block: 'start', inline: 'start', behavior: scrollBehavior() });
  }
});

const initialCard = cardById.get(location.hash.slice(1));
if (initialCard) {
  requestAnimationFrame(() => initialCard.scrollIntoView({ block: 'start', inline: 'start', behavior: 'instant' }));
}

const menu = document.getElementById('menu');
document.querySelectorAll('.navbar a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    const targetId = link.hash.slice(1);
    const card = cardById.get(targetId);
    const target = card ?? document.getElementById(targetId);
    if (card?.hidden) filterCatalog('todos');

    if (menu.classList.contains('show')) {
      if (target) {
        menu.addEventListener('hidden.bs.collapse', () => {
          if (location.hash === link.hash) {
            target.scrollIntoView({ block: 'start', inline: 'start', behavior: scrollBehavior() });
          }
        }, { once: true });
      }
      bootstrap.Collapse.getOrCreateInstance(menu, { toggle: false }).hide();
    }
  });
});

const topButton = document.getElementById('backtop');
window.addEventListener('scroll', () => topButton.classList.toggle('show', scrollY > 450), { passive: true });
topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: scrollBehavior() }));

if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.tilt, .glow').forEach(element => {
    element.addEventListener('pointermove', event => {
      if (reduceMotion.matches) return;
      const bounds = element.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      element.style.setProperty('--rx', `${(.5 - y) * 7}deg`);
      element.style.setProperty('--ry', `${(x - .5) * 7}deg`);
      element.style.setProperty('--gx', `${x * 100}%`);
      element.style.setProperty('--gy', `${y * 100}%`);
    });
    element.addEventListener('pointerleave', () => {
      element.style.setProperty('--rx', '0deg');
      element.style.setProperty('--ry', '0deg');
    });
  });
}

const touchScreen = matchMedia('(hover: none), (any-pointer: coarse)');
if (touchScreen.matches && !reduceMotion.matches && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (!reduceMotion.matches) entry.target.classList.add('touch-reveal');
      revealObserver.unobserve(entry.target);
    }
  }, { threshold: .15 });

  document.querySelectorAll('.shortcuts, #tecnicas .section-head, .result-card, .about-grid, #atendimento, #manutencao')
    .forEach(section => revealObserver.observe(section));
}

document.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'touch' || reduceMotion.matches) return;
  const photo = event.target.closest('.campaign-image img, .service-img img, .result-photo, .about-photo img, .maintenance-photo img');
  if (photo) photo.classList.add('touch-highlight');
}, { passive: true });

for (const eventType of ['animationend', 'animationcancel']) {
  document.addEventListener(eventType, event => {
    if (event.animationName === 'touch-photo-highlight') {
      event.target.classList.remove('touch-highlight');
    }
  });
}
