import { useState } from 'react';

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbyQpmuzR2276fn3yqY_gJEKvCSabtVYRWHY6OQ3xHkFln_V4IeRafp76cyIuRF_Qt1VTA/exec';

type QuoteFormState = {
  nom: string;
  telephone: string;
  email: string;
  service: string;
  zone: string;
  message: string;
};

const initialForm: QuoteFormState = {
  nom: '',
  telephone: '',
  email: '',
  service: '',
  zone: '',
  message: '',
};

const services = [
  {
    number: '01',
    title: 'Nettoyage de bureaux',
    text: 'Entretien régulier de bureaux, espaces professionnels et parties communes avec une qualité constante et un rendu soigné.',
  },
  {
    number: '02',
    title: "Nettoyage d'immeubles",
    text: "Interventions pour copropriétés, résidences, halls d'immeubles et espaces partagés avec une présentation impeccable.",
  },
  {
    number: '03',
    title: 'Nettoyage de chantier',
    text: 'Remise en état après travaux, enlèvement des poussières, nettoyage de fin de chantier et préparation avant livraison.',
  },
  {
    number: '04',
    title: "Nettoyage d'appartements",
    text: 'Ménage complet pour appartements, locations, états des lieux, remises en état, résidences et immeubles collectifs.',
  },
];

const points = [
  'Entreprise locale basée à Marseille',
  'Interventions rapides et soignées',
  'Devis clair et sans surprise',
  "Équipe sérieuse et à l'écoute",
];

const miniCards = [
  {
    title: 'Réactivité',
    text: 'Réponse rapide aux demandes de devis et planification efficace des interventions.',
  },
  {
    title: 'Sérieux',
    text: 'Présentation soignée, ton professionnel et parcours utilisateur simple et fluide.',
  },
  {
    title: 'Proximité',
    text: 'Ancrage local à Marseille pour rassurer et faciliter la prise de contact des prospects.',
  },
  {
    title: 'Clarté',
    text: 'Informations utiles, lisibles et orientées conversion pour obtenir plus de demandes de devis.',
  },
];

const steps = [
  {
    number: '1',
    title: 'Vous nous contactez',
    text: 'Par téléphone ou via le formulaire, expliquez votre besoin en quelques lignes.',
  },
  {
    number: '2',
    title: 'Nous étudions votre demande',
    text: 'Nous revenons vers vous avec une solution adaptée et un devis clair, sans surprise.',
  },
  {
    number: '3',
    title: 'Nous intervenons',
    text: "L'équipe réalise une prestation soignée avec un vrai souci du détail et de la satisfaction client.",
  },
];

const zones = ['Marseille', 'Aubagne', 'La Ciotat', 'Aix-en-Provence', 'Vitrolles', 'Cassis'];

function validateForm(form: QuoteFormState): string | null {
  if (!form.nom.trim()) return 'Le nom est requis.';
  if (!form.telephone.trim()) return 'Le téléphone est requis.';
  if (!form.email.trim()) return "L'e-mail est requis.";
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return 'Veuillez saisir un e-mail valide.';
  if (!form.service.trim()) return 'Veuillez sélectionner un service.';
  if (!form.zone.trim()) return "La zone d'intervention est requise.";
  if (!form.message.trim()) return 'Le message est requis.';
  return null;
}

function runTests(): void {
  console.assert(validateForm({ ...initialForm, nom: 'Jean' }) === 'Le téléphone est requis.', 'Test 1 échoué');
  console.assert(
    validateForm({
      nom: 'Jean',
      telephone: '0600000000',
      email: 'jean@mail.com',
      service: 'Nettoyage de bureaux',
      zone: 'Marseille',
      message: 'Bonjour',
    }) === null,
    'Test 2 échoué',
  );
  console.assert(
    validateForm({
      nom: 'Jean',
      telephone: '0600000000',
      email: 'email-invalide',
      service: 'Nettoyage de bureaux',
      zone: 'Marseille',
      message: 'Bonjour',
    }) === 'Veuillez saisir un e-mail valide.',
    'Test 3 échoué',
  );
}

runTests();

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState<QuoteFormState>(initialForm);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ): void {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const validationError = validateForm(form);

    if (validationError) {
      setErrorMessage(validationError);
      setSuccessMessage('');
      return;
    }

    try {
      setIsSending(true);
      setErrorMessage('');
      setSuccessMessage('');

      const payload = {
        nom: form.nom.trim(),
        telephone: form.telephone.trim(),
        email: form.email.trim(),
        service: form.service.trim(),
        zone: form.zone.trim(),
        message: form.message.trim(),
      };

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();

      let result: { success?: boolean; error?: string } = {};
      try {
        result = JSON.parse(text);
      } catch {
        result = { success: response.ok };
      }

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Erreur lors de l'envoi.");
      }

      setForm(initialForm);
      setSuccessMessage('Votre demande a bien été envoyée.');
    } catch (error) {
      console.error(error);
      setSuccessMessage('');
      setErrorMessage("Une erreur est survenue lors de l'envoi du formulaire.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-17994129484"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'AW-17994129484');
</script>
        <div className="container nav-wrap">
          <a href="#home" className="brand">
            <div className="brand-logo-wrap">
              <img src="/logo-clean-provence.jpg" alt="Logo Clean Provence" className="brand-logo" />
            </div>
            <div>
              <p className="brand-title">Clean Provence</p>
              <p className="brand-subtitle">Entreprise de nettoyage à Marseille</p>
            </div>
          </a>

          <button
            type="button"
            className="menu-button"
            aria-label="Ouvrir le menu"
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
            <a href="#services" onClick={() => setMenuOpen(false)}>
              Services
            </a>
            <a href="#apropos" onClick={() => setMenuOpen(false)}>
              À propos
            </a>
            <a href="#zones" onClick={() => setMenuOpen(false)}>
              Zones
            </a>
<a href="tel:+33784728114" className="btn btn-primary">
  📞 Appeler maintenant
</a>
            
            <a href="#contact" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
              Demander un devis
            </a>
          </nav>
        </div>
      </header>

      <main id="home">
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <div className="hero-badge">Nettoyage professionnel • Marseille et alentours</div>
              <h1>
                Une image propre, <span>sérieuse et rassurante</span> pour vos espaces.
              </h1>
              <p className="hero-text">
                Clean Provence accompagne les entreprises, copropriétés et particuliers avec un service de nettoyage fiable,
                réactif et soigné. Un site clair, une image pro et une prise de contact simple pour donner confiance dès les
                premières secondes.
              </p>
              <div className="hero-actions">
                <a href="#contact" className="btn btn-dark">
                  Obtenir un devis rapide
                </a>
                <a href="#services" className="btn btn-outline">
                  Voir nos services
                </a>
              </div>
              <div className="points-grid">
                {points.map((point) => (
                  <div key={point} className="point-card">
                    <div className="point-line" />
                    <p>{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-card">
              <img src="/logo-clean-provence.jpg" alt="Logo Clean Provence" className="hero-logo" />
              <div className="floating-box floating-left">
                <p>Disponibilité</p>
                <strong>Rapide & flexible</strong>
              </div>
              <div className="floating-box floating-right colored">
                <p>Intervention</p>
                <strong>Marseille + alentours</strong>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="section">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Nos services</p>
              <h2>Entreprise de nettoyage professionnelle à Marseille</h2>
              <p>
                Clean Provence est une entreprise de nettoyage à Marseille spécialisée dans l’entretien pour professionnels et particuliers. 
                Nous intervenons pour le nettoyage de bureaux, commerces, appartements, vitrines, locations Airbnb et le nettoyage de 
                fin de chantier. Nos équipes assurent un travail soigné, rapide et efficace pour garantir des locaux propres et impeccables. 
                Intervention à Marseille et aux alentours avec devis gratuit et service professionnel adapté à chaque besoin.
              </p>
            </div>
            <div className="services-grid">
              {services.map((service) => (
                <article key={service.title} className="service-card">
                  <div className="service-number">{service.number}</div>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="apropos" className="section section-soft">
          <div className="container about-grid">
            <div>
              <p className="eyebrow green">À propos</p>
              <h2>Votre entreprise de nettoyage de confiance à Marseille</h2>
              <p className="body-large">
                Notre force repose sur quatre engagements : réactivité, avec des réponses rapides aux demandes de devis ; sérieux, avec un service professionnel et soigné ; 
                proximité, grâce à notre ancrage local à Marseille ; et clarté, avec des prestations simples et transparentes pour faciliter la prise de contact.
                Nous intervenons rapidement à Marseille et aux alentours avec un service fiable et un devis gratuit.
              </p>
              <p className="body-large">
             
              </p>
            </div>
            <div className="mini-grid">
              {miniCards.map((item) => (
                <div key={item.title} className="mini-card">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container dark-box">
            <div className="steps-grid">
              {steps.map((step) => (
                <article key={step.number} className="step-card">
                  <div className="step-number">{step.number}</div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="zones" className="section">
          <div className="container">
            <div className="zones-top">
              <div>
                <p className="eyebrow">Zones d'intervention</p>
                <h2>Présents à Marseille et dans les environs</h2>
              </div>
              <p className="zones-copy">
                Clean Provence intervient à Marseille et dans les villes alentours comme Aubagne, Allauch ou Cassis, ainsi que d’autres communes, avec intervention rapide et devis gratuit.
              </p>
            </div>
            <div className="zones-list">
              {zones.map((zone) => (
                <span key={zone} className="zone-pill">
                  {zone}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section section-soft">
          <div className="container contact-grid">
            <div>
              <p className="eyebrow green">Contact</p>
              <h2>Demandez votre devis GRATUIT !</h2>
              <p className="body-large">
                Vous avez besoin d’un service de nettoyage à Marseille ou dans les environs ? Contactez Clean Provence pour obtenir un devis gratuit et rapide. Que ce soit pour le nettoyage de bureaux, d’appartements, de commerces, de locations Airbnb ou un nettoyage de fin de chantier, nous étudions votre besoin et vous proposons une solution adaptée.

Remplissez le formulaire ou appelez-nous directement pour recevoir votre devis et planifier votre intervention rapidement. Clean Provence vous répond dans les meilleurs délais.
              </p>

              <div className="info-list">
                <div className="info-card">
                  <span>Téléphone</span>
                  <strong>07 84 72 81 14</strong>
                </div>
                <div className="info-card">
                  <span>E-mail</span>
                  <strong>provenceclean4@gmail.com</strong>
                </div>
                <div className="info-card">
                  <span>Ville</span>
                  <strong>Marseille + alentours</strong>
                </div>
              </div>
            </div>

            <div className="form-card">
              <form onSubmit={handleSubmit} className="form-layout">
                <div className="form-grid">
                  <div>
                    <label htmlFor="nom">Nom</label>
                    <input id="nom" name="nom" value={form.nom} onChange={handleChange} placeholder="Votre nom" />
                  </div>
                  <div>
                    <label htmlFor="telephone">Téléphone</label>
                    <input
                      id="telephone"
                      name="telephone"
                      value={form.telephone}
                      onChange={handleChange}
                      placeholder="Votre téléphone"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email">E-mail</label>
                  <input id="email" name="email" value={form.email} onChange={handleChange} placeholder="Votre e-mail" />
                </div>

                <div className="form-grid">
                  <div>
                    <label htmlFor="service">Type de besoin</label>
                    <select id="service" name="service" value={form.service} onChange={handleChange}>
                      <option value="">Sélectionnez un service</option>
                      <option value="Nettoyage de bureaux">Nettoyage de bureaux</option>
                      <option value="Nettoyage d'immeubles">Nettoyage d'immeubles</option>
                      <option value="Nettoyage de chantier">Nettoyage de chantier</option>
                      <option value="Nettoyage d'appartements">Nettoyage d'appartements</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="zone">Zone d'intervention</label>
                    <input
                      id="zone"
                      name="zone"
                      value={form.zone}
                      onChange={handleChange}
                      placeholder="Ex : Marseille 13008"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre besoin"
                  />
                </div>

                <button type="submit" className="btn btn-primary full" disabled={isSending}>
                  {isSending ? 'Envoi en cours...' : 'Envoyer ma demande'}
                </button>

                {successMessage ? <div className="message success">{successMessage}</div> : null}
                {errorMessage ? <div className="message error">{errorMessage}</div> : null}

                <div className="message info"></div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-wrap">
          <p>© Clean Provence — Entreprise de nettoyage Marseille</p>
          <div className="footer-links">
            <a href="#services">Services</a>
            <a href="#apropos">À propos</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
      <a href="tel:+33784728114" className="call-button">
  📞 Appeler
</a>
    </div>
  );
}
