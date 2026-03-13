import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Phone, MapPin, Clock, ChevronRight } from 'lucide-react';

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const WHATSAPP = 'https://wa.me/+6588756903';

const NAV_LINKS = [
  { label: 'Automotive', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact Us', href: '#contact' },
];

const HERO_SLIDES = [
  {
    bg: 'https://vos.sg/wp-content/uploads/2023/09/Slider.png',
    label: 'Award-Winning Automotive Studio',
    heading: 'The Epitome of\nAutomotive Elegance',
    sub: "Singapore's leading Multi-Disciplinary and Award-Winning Automotive Design Craft Studio",
  },
  {
    bg: 'https://vos.sg/wp-content/uploads/2023/09/Slider-1.png',
    label: 'Bespoke Vehicle Styling',
    heading: 'Transform Your\nVision Into Reality',
    sub: 'From subtle refinements to bold statements — every build is a unique masterpiece crafted for you.',
  },
];

const SERVICE_CARDS = [
  { name: 'Car Wraps', img: 'https://vos.sg/wp-content/uploads/2023/09/Image-Overlay-4.png' },
  { name: 'Spray Paint', img: 'https://vos.sg/wp-content/uploads/2023/11/G63-1-1-scaled.jpg' },
  { name: 'Solar Film Tinting', img: 'https://vos.sg/wp-content/uploads/2023/09/Image-Overlay-6.png' },
  { name: 'Bodykits', img: 'https://vos.sg/wp-content/uploads/2023/09/Image-Overlay-9.png' },
  { name: 'Paint Protection Film', img: 'https://vos.sg/wp-content/uploads/2023/11/processed-44b8180a-2b5c-4e56-84c6-e4092fd92a22_QYs7RXL9.jpeg' },
  { name: 'Graphic Design', img: 'https://vos.sg/wp-content/uploads/2023/11/processed-1a129860-0d9a-44bd-8c53-4dd8d888f413_rbQ90m8o.jpeg' },
];

const MEDIA_LOGOS = [
  { alt: 'GeekCulture', src: 'https://vos.sg/wp-content/uploads/2023/12/geekculture-logo.png' },
  { alt: 'Evo Magazine', src: 'https://vos.sg/wp-content/uploads/2023/12/Evo-mag-logo.png' },
  { alt: 'BurnPavement', src: 'https://vos.sg/wp-content/uploads/2023/12/burnpavement-logo.png' },
  { alt: 'BoldMedia', src: 'https://vos.sg/wp-content/uploads/2023/12/Boldmedia-logo.png' },
  { alt: 'AsiaOne', src: 'https://vos.sg/wp-content/uploads/2023/12/AsiaOne-logo.png' },
  { alt: 'Motorost', src: 'https://vos.sg/wp-content/uploads/2023/12/motorost.jpg' },
  { alt: 'MyACRForum', src: 'https://vos.sg/wp-content/uploads/2023/12/myacrforum-logo-1.png' },
  { alt: 'SGCarMart', src: 'https://vos.sg/wp-content/uploads/2023/12/sgcarmart-logo.jpg' },
];

const GOLD = '#f6bd2d';

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const current = HERO_SLIDES[slide];

  return (
    <div style={{ fontFamily: "'Heebo', sans-serif" }} className="bg-white text-black min-h-screen">

      {/* ── NAV ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-black shadow-xl' : 'bg-black/80'
        }`}
      >
        <div style={{ maxWidth: 1400 }} className="mx-auto px-8 py-4 flex items-center justify-between">
          <a href="#home">
            <img
              src="https://vos.sg/wp-content/uploads/2025/06/Vos-Logo-Facelift-3.png"
              alt="VOS Automotive"
              className="h-10 w-auto"
            />
          </a>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-white hover:text-[#f6bd2d] transition-colors tracking-wide"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => navigate('/customize')}
              className="ml-4 px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white"
              style={{ background: GOLD, fontFamily: "'Heebo', sans-serif" }}
            >
              Customize Your Car
            </button>
          </div>

          <button className="md:hidden text-white" onClick={() => setMenuOpen((o) => !o)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-black border-t border-zinc-800 px-8 py-4 space-y-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-white hover:text-[#f6bd2d] transition-colors py-1"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => { setMenuOpen(false); navigate('/customize'); }}
              className="block w-full text-center px-6 py-2.5 text-sm font-semibold text-black hover:bg-white transition-colors"
              style={{ background: GOLD }}
            >
              Customize Your Car
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO SLIDER ── */}
      <section id="home" className="relative overflow-hidden" style={{ height: '100vh' }}>
        <div
          className="absolute inset-0 transition-all duration-1000 bg-cover bg-center"
          style={{ backgroundImage: `url('${current.bg}')` }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.55)' }} />

        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <div style={{ maxWidth: 900 }}>
            <p
              className="mb-5 tracking-[0.15em] uppercase text-base font-medium"
              style={{ color: GOLD }}
            >
              {current.label}
            </p>
            <h1
              className="text-white mb-5 font-normal"
              style={{
                fontFamily: "'Russo One', sans-serif",
                fontSize: 'clamp(30px, 5vw, 63px)',
                letterSpacing: 3,
                lineHeight: 1.15,
                whiteSpace: 'pre-line',
              }}
            >
              {current.heading}
            </h1>
            <p className="text-white/80 text-base mb-8 mx-auto" style={{ maxWidth: 500 }}>
              {current.sub}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/customize')}
                className="px-8 py-3 text-base font-semibold text-black hover:bg-white transition-colors"
                style={{ background: GOLD, fontFamily: "'Heebo', sans-serif" }}
              >
                Try 3D Customizer
              </button>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 text-base font-semibold text-black hover:bg-white transition-colors"
                style={{ background: GOLD }}
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className="w-2.5 h-2.5 rounded-full border transition-colors"
              style={{
                borderColor: GOLD,
                background: i === slide ? GOLD : 'transparent',
              }}
            />
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="bg-white py-20">
        <div style={{ maxWidth: 1400 }} className="mx-auto px-8">
          <div className="mb-12">
            <p
              className="text-sm font-medium tracking-[0.15em] uppercase mb-3"
              style={{ color: GOLD }}
            >
              What We Offer
            </p>
            <h2
              className="font-normal"
              style={{ fontFamily: "'Russo One', sans-serif", fontSize: 48, color: '#000', lineHeight: '52px' }}
            >
              Our Services
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
            {SERVICE_CARDS.map((s) => (
              <a
                key={s.name}
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group overflow-hidden"
                style={{ paddingTop: '75%' }}
              >
                {/* BG image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${s.img}')` }}
                />
                {/* Overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{ background: 'rgba(0,0,0,0.6)' }}
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'rgba(0,0,0,0)' }}
                />
                {/* Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <p
                    className="text-white text-center font-normal"
                    style={{
                      fontFamily: "'Russo One', sans-serif",
                      fontSize: 'clamp(18px, 2.5vw, 40px)',
                      lineHeight: 1.25,
                    }}
                  >
                    {s.name}
                  </p>
                  <span
                    className="mt-3 px-5 py-1.5 text-sm font-semibold text-black opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: GOLD }}
                  >
                    Enquire Now
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVENTS / HIGHLIGHTS ── */}
      <section className="bg-black py-20">
        <div style={{ maxWidth: 1400 }} className="mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-sm font-medium tracking-[0.15em] uppercase mb-3" style={{ color: GOLD }}>
                Event Highlights
              </p>
              <h2
                className="text-white font-normal mb-6"
                style={{ fontFamily: "'Russo One', sans-serif", fontSize: 48, lineHeight: '52px' }}
              >
                Retro Havoc &<br />Road Block
              </h2>
              <p className="text-white/70 text-base mb-8 leading-relaxed">
                We are proud to be part of Singapore's most exciting automotive events.
                From track days to curated car meets, VOS Automotive brings passion and craftsmanship to every occasion.
              </p>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 text-base font-semibold text-black hover:bg-white transition-colors"
                style={{ background: GOLD }}
              >
                WhatsApp Us
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <img
                src="https://vos.sg/wp-content/uploads/2023/11/376824618_787375210056066_2825619917036016550_n.jpg"
                alt="Event highlight"
                className="w-full object-cover aspect-square"
              />
              <img
                src="https://vos.sg/wp-content/uploads/2023/11/373538032_783028283824092_6422931864049826400_n.jpg"
                alt="Event highlight"
                className="w-full object-cover aspect-square"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="bg-white py-20">
        <div style={{ maxWidth: 1400 }} className="mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="https://vos.sg/wp-content/uploads/2023/10/editors_images_1668121057207-vos-featured-scaled.jpg"
                alt="VOS Automotive workshop"
                className="w-full object-cover"
                style={{ boxShadow: '0px 4px 10px 0px rgba(255,255,255,0.31)' }}
              />
            </div>
            <div>
              <p className="text-sm font-medium tracking-[0.15em] uppercase mb-3" style={{ color: GOLD }}>
                About Us
              </p>
              <h2
                className="font-normal mb-6"
                style={{ fontFamily: "'Russo One', sans-serif", fontSize: 48, lineHeight: '52px', color: '#000' }}
              >
                Crafting Automotive Masterpieces
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Transform your car into a masterpiece with Vos Automotive Styling. Our boutique
                offers bespoke vehicle styling services, meticulously tailored to your unique aesthetic vision.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Whether you desire a subtle colour shift or a head-turning graphic design, our team of experts
                brings your dream to life with meticulous attention to detail.
              </p>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 text-base font-semibold text-black hover:bg-gray-100 border transition-colors"
                style={{ borderColor: GOLD, background: GOLD }}
              >
                Get In Touch
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR PRICES CTA ── */}
      <section
        className="relative py-60"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)), url('https://vos.sg/wp-content/uploads/2023/09/Pexels-Photo-by-Auto-Records.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ maxWidth: 1400 }} className="mx-auto px-8 text-center">
          <h2
            className="text-white font-normal mb-6"
            style={{ fontFamily: "'Russo One', sans-serif", fontSize: 48, lineHeight: '52px' }}
          >
            Our Prices
          </h2>
          <p className="text-white/80 text-base mb-12">
            Every project is a unique masterpiece. You are only steps away from achieving your work of art.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/customize')}
              className="px-8 py-3 text-base font-semibold text-black hover:bg-white transition-colors"
              style={{ background: GOLD }}
            >
              Try 3D Customizer
            </button>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 text-base font-semibold text-black hover:bg-white transition-colors"
              style={{ background: GOLD }}
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── AS SEEN ON ── */}
      <section className="bg-white py-16">
        <div style={{ maxWidth: 1400 }} className="mx-auto px-8">
          <h2
            className="font-normal mb-12"
            style={{ fontFamily: "'Russo One', sans-serif", fontSize: 48, lineHeight: '52px', color: '#000' }}
          >
            As Seen On
          </h2>
          <div className="flex flex-wrap items-center gap-6">
            {MEDIA_LOGOS.map((logo) => (
              <div key={logo.alt} className="h-12 flex items-center">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LATEST NEWS ── */}
      <section id="gallery" className="bg-white py-16 border-t border-gray-100">
        <div style={{ maxWidth: 1400 }} className="mx-auto px-8">
          <p className="text-sm font-medium tracking-[0.15em] uppercase mb-3" style={{ color: GOLD }}>
            Stay Informed
          </p>
          <h2
            className="font-normal mb-10"
            style={{ fontFamily: "'Russo One', sans-serif", fontSize: 48, lineHeight: '52px', color: '#000' }}
          >
            Latest News
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                href: 'https://vos.sg/car-wrap-singapore-leads-pack/',
                img: 'https://vos.sg/wp-content/uploads/2023/09/Image-Overlay-4.png',
                date: '21 Jun 2025',
                title: 'Car Wrap Singapore — Why Vos Autostyle Leads the Pack',
                excerpt: "If you're searching for the best car wrap in Singapore, chances are you're not looking for average — and neither are we.",
              },
              {
                href: 'https://vos.sg/veni-vidi-vos/',
                img: 'https://vos.sg/wp-content/uploads/2023/11/EVO-Magazine-png-9463x26114-.png',
                date: '25 Oct 2023',
                title: 'Veni, Vidi, Vos',
                excerpt: "Just like how an architect might build you the house of your dreams, Vos Automotive Styling provides a bespoke solution to realise your automotive aesthetic visions.",
              },
              {
                href: 'https://vos.sg/vos-automotive-combines-expertise-and-quality-products-so-your-car-will-always-look-outstanding/',
                img: 'https://vos.sg/wp-content/uploads/2023/10/editors_images_1668121057207-vos-featured-scaled.jpg',
                date: '07 Dec 2022',
                title: 'Vos Automotive Combines Expertise And Quality Products',
                excerpt: 'Car customisation garages are a dime a dozen, but extensive product knowledge and years of experience is something that cannot be replicated.',
              },
            ].map((post) => (
              <a key={post.href} href={post.href} target="_blank" rel="noopener noreferrer" className="group">
                <div className="overflow-hidden mb-4">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-xs text-gray-400 mb-2">{post.date}</p>
                <h3
                  className="text-base font-semibold mb-2 group-hover:text-[#f6bd2d] transition-colors"
                  style={{ fontFamily: "'Russo One', sans-serif" }}
                >
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section
        id="contact"
        className="relative"
        style={{
          backgroundImage: `linear-gradient(rgba(30,55,0,0.40),rgba(30,55,0,0.40)), url('https://vos.sg/wp-content/uploads/2023/09/Contact-Us-3.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ maxWidth: 1400 }} className="mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center justify-between py-14 gap-8">
            <div>
              <h3
                className="text-white font-normal mb-2"
                style={{ fontFamily: "'Russo One', sans-serif", fontSize: 48, lineHeight: '52px' }}
              >
                Contact Us
              </h3>
              <p className="text-white/80 text-base">
                If you have any queries regarding our services, get in touch with us via WhatsApp.
              </p>
            </div>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 text-base font-semibold text-black hover:bg-white transition-colors shrink-0"
              style={{ background: GOLD }}
            >
              <svg width="20" height="24" viewBox="0 0 24 28" fill="currentColor">
                <path d="M15.391 15.219c0.266 0 2.812 1.328 2.922 1.516 0.031 0.078 0.031 0.172 0.031 0.234 0 0.391-0.125 0.828-0.266 1.188-0.359 0.875-1.813 1.437-2.703 1.437-0.75 0-2.297-0.656-2.969-0.969-2.234-1.016-3.625-2.75-4.969-4.734-0.594-0.875-1.125-1.953-1.109-3.031v-0.125c0.031-1.031 0.406-1.766 1.156-2.469 0.234-0.219 0.484-0.344 0.812-0.344 0.187 0 0.375 0.047 0.578 0.047 0.422 0 0.5 0.125 0.656 0.531 0.109 0.266 0.906 2.391 0.906 2.547 0 0.594-1.078 1.266-1.078 1.625 0 0.078 0.031 0.156 0.078 0.234 0.344 0.734 1 1.578 1.594 2.141 0.719 0.688 1.484 1.141 2.359 1.578 0.109 0.063 0.219 0.109 0.344 0.109 0.469 0 1.25-1.516 1.656-1.516zM12.219 23.5c5.406 0 9.812-4.406 9.812-9.812s-4.406-9.812-9.812-9.812-9.812 4.406-9.812 9.812c0 2.063 0.656 4.078 1.875 5.75l-1.234 3.641 3.781-1.203c1.594 1.047 3.484 1.625 5.391 1.625zM12.219 1.906c6.5 0 11.781 5.281 11.781 11.781s-5.281 11.781-11.781 11.781c-1.984 0-3.953-0.5-5.703-1.469l-6.516 2.094 2.125-6.328c-1.109-1.828-1.687-3.938-1.687-6.078 0-6.5 5.281-11.781 11.781-11.781z" />
              </svg>
              Send a Message
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-black pt-16 pb-8">
        <div style={{ maxWidth: 1400 }} className="mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <img
                src="https://vos.sg/wp-content/uploads/2025/06/Vos-Logo-Facelift-3.png"
                alt="VOS Automotive"
                className="h-12 w-auto mb-5"
              />
              <div className="flex items-start gap-2 text-zinc-400 text-sm mb-3">
                <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: GOLD }} />
                <span>OneKA @ Macpherson,<br />1 Kampong Ampat, #05-12<br />Singapore 368314</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <Phone size={14} style={{ color: GOLD }} />
                <a href="tel:+6588756903" className="hover:text-white transition-colors">+65 8875 6903</a>
              </div>
            </div>

            <div>
              <h4
                className="text-white font-normal mb-4"
                style={{ fontFamily: "'Russo One', sans-serif" }}
              >
                Services
              </h4>
              <div className="w-8 h-px mb-4" style={{ background: GOLD }} />
              <ul className="space-y-2 text-zinc-400 text-sm">
                {['Car Wraps', 'Paint Protection Film', 'Solar Film Tinting', 'Spray', 'Graphic Design', 'Bodykits'].map((s) => (
                  <li key={s}>
                    <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                      className="hover:text-[#f6bd2d] transition-colors flex items-center gap-1">
                      <ChevronRight size={12} /> {s}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4
                className="text-white font-normal mb-4"
                style={{ fontFamily: "'Russo One', sans-serif" }}
              >
                Quick Links
              </h4>
              <div className="w-8 h-px mb-4" style={{ background: GOLD }} />
              <ul className="space-y-2 text-zinc-400 text-sm">
                <li><a href="#about" className="hover:text-[#f6bd2d] transition-colors flex items-center gap-1"><ChevronRight size={12} /> About Us</a></li>
                <li>
                  <button
                    onClick={() => navigate('/customize')}
                    className="hover:text-[#f6bd2d] transition-colors flex items-center gap-1 text-zinc-400 text-sm"
                  >
                    <ChevronRight size={12} /> Customize Your Car
                  </button>
                </li>
                <li><a href="#contact" className="hover:text-[#f6bd2d] transition-colors flex items-center gap-1"><ChevronRight size={12} /> Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4
                className="text-white font-normal mb-4"
                style={{ fontFamily: "'Russo One', sans-serif" }}
              >
                Business Hours
              </h4>
              <div className="w-8 h-px mb-4" style={{ background: GOLD }} />
              <div className="flex items-start gap-2 text-zinc-400 text-sm mb-8">
                <Clock size={14} className="mt-0.5 shrink-0" style={{ color: GOLD }} />
                <span>10:00 AM – 7:00 PM<br />Closed on Sundays</span>
              </div>
              <h4
                className="text-white font-normal mb-3"
                style={{ fontFamily: "'Russo One', sans-serif" }}
              >
                Follow Us
              </h4>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/VosAutoStyle/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 transition-colors hover:text-black"
                  style={{ ['--hover-bg' as string]: GOLD }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = GOLD; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
                >
                  <FacebookIcon />
                </a>
                <a
                  href="https://www.instagram.com/vos.sg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 transition-colors hover:text-black"
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = GOLD; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
                >
                  <InstagramIcon />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-6 text-center text-zinc-500 text-sm">
            Copyright © 2026 VOS Automotive. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
