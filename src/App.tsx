import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'clean_provence_quotes';

type Quote = {
  id: string;
  date: string;
  nom: string;
  telephone: string;
  email: string;
  service: string;
  zone: string;
  message: string;
};

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

function safeParseQuotes(value: string | null): Quote[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is Quote =>
        item &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        typeof item.date === 'string' &&
        typeof item.nom === 'string' &&
        typeof item.telephone === 'string' &&
        typeof item.email === 'string' &&
        typeof item.service === 'string' &&
        typeof item.zone === 'string' &&
        typeof item.message === 'string',
    );
  } catch {
    return [];
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 'Date invalide';

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function toCsv(quotes: Quote[]): string {
  const headers = ['Date', 'Nom', 'Téléphone', 'E-mail', 'Service', 'Zone', 'Message'];
  const rows = quotes.map((quote) => [
    formatDate(quote.date),
    quote.nom,
    quote.telephone,
    quote.email,
    quote.service,
    quote.zone,
    quote.message,
  ]);

  return [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
    .join('\n');
}

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
  console.assert(Array.isArray(safeParseQuotes(null)), 'Test 1 échoué');
  console.assert(safeParseQuotes('not-json').length === 0, 'Test 2 échoué');
  console.assert(validateForm({ ...initialForm, nom: 'Jean' }) === 'Le téléphone est requis.', 'Test 3 échoué');
  console.assert(
    validateForm({
      nom: 'Jean',
      telephone: '0600000000',
      email: 'jean@mail.com',
      service: 'Nettoyage de bureaux',
      zone: 'Marseille',
      message: 'Bonjour',
    }) === null,
    'Test 4 échoué',
  );
  console.assert(
    toCsv([
      {
        id: '1',
        date: '2026-03-06T12:00:00.000Z',
        nom: 'Jean "Dupont"',
        telephone: '0600000000',
        email: 'jean@mail.com',
        service: 'Nettoyage de bureaux',
        zone: 'Marseille',
        message: 'Bonjour',
      },
    ]).includes('"Jean ""Dupont"""'),
    'Test 5 échoué',
  );
}

runTests();

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState<QuoteFormState>(initialForm);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setQuotes(safeParseQuotes(window.localStorage.getItem(STORAGE_KEY)));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = window.setTimeout(() => setSuccessMessage(''), 4000);
    return () => window.clearTimeout(timer);
  }, [successMessage]);

  const displayedQuotes = useMemo(() => [...quotes].reverse(), [quotes]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ): void {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const validationError = validateForm(form);

    if (validationError) {
      setErrorMessage(validationError);
      setSuccessMessage('');
      return;
    }

    const newQuote: Quote = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      date: new Date().toISOString(),
      nom: form.nom.trim(),
      telephone: form.telephone.trim(),
      email: form.email.trim(),
      service: form.service.trim(),
      zone: form.zone.trim(),
      message: form.message.trim(),
    };

    setQuotes((current) => [...current, newQuote]);
    setForm(initialForm);
    setErrorMessage('');
    setSuccessMessage('Votre demande a bien été enregistrée. Elle apparaît dans le tableau des devis en bas de page.');
  }

  function downloadCsv(): void {
    if (quotes.length === 0) {
      setErrorMessage('Aucune demande à exporter.');
      return;
    }

    const csv = toCsv(quotes);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'demandes-devis-clean-provence.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    setErrorMessage('');
  }

  function clearQuotes(): void {
    const confirmed = window.confirm('Voulez-vous vraiment supprimer toutes les demandes enregistrées ?');
    if (!confirmed) return;
    setQuotes([]);
    setSuccessMessage('');
    setErrorMessage('');
  }

  return (
    <div className="app-shell">
      <header className="site-header">
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
            <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
            <a href="#apropos" onClick={() => setMenuOpen(false)}>À propos</a>
            <a href="#zones" onClick={() => setMenuOpen(false)}>Zones</a>
            <a href="#contact" className="btn btn-dark" onClick={() => setMenuOpen(false)}>Demander un devis</a>
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
                Clean Provence accompagne les entreprises, copropriétés et particuliers avec un service de nettoyage fiable, réactif et soigné. Un site clair, une image pro et une prise de contact simple pour donner confiance dès les premières secondes.
              </p>
              <div className="hero-actions">
                <a href="#contact" className="btn btn-dark">Obtenir un devis rapide</a>
                <a href="#services" className="btn btn-outline">Voir nos services</a>
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
              <h2>Des prestations simples, claires et professionnelles</h2>
              <p>
                Un site vitrine efficace doit rassurer immédiatement. Chaque service est présenté clairement pour aider vos visiteurs à comprendre en quelques secondes ce que vous proposez.
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
              <h2>Une entreprise locale qui mise sur la confiance</h2>
              <p className="body-large">
                Clean Provence est pensée pour inspirer le sérieux, la propreté et la proximité. Le site reprend une identité visuelle moderne et rassurante afin de valoriser l'image de l'entreprise auprès des clients particuliers comme professionnels.
              </p>
              <p className="body-large">
                L'objectif est simple : montrer que vous êtes une entreprise fiable, bien organisée et prête à intervenir rapidement avec une vraie exigence de qualité.
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
                Le site met en avant votre présence locale pour améliorer la confiance et faciliter la prise de contact des prospects proches de votre secteur.
              </p>
            </div>
            <div className="zones-list">
              {zones.map((zone) => (
                <span key={zone} className="zone-pill">{zone}</span>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section section-soft">
          <div className="container contact-grid">
            <div>
              <p className="eyebrow green">Contact</p>
              <h2>Demandez votre devis</h2>
              <p className="body-large">
                Le formulaire est pensé pour être simple, rassurant et utile. Chaque demande est enregistrée automatiquement dans le navigateur et peut être exportée en CSV pour que l'entreprise voie toutes les demandes reçues.
              </p>

              <div className="info-list">
                <div className="info-card">
                  <span>Téléphone</span>
                  <strong>07 84 72 81 14</strong>
                </div>
                <div className="info-card">
                  <span>E-mail</span>
                  <strong>cleanprovence13000@gmail.com</strong>
                </div>
                <div className="info-card">
                  <span>Ville</span>
                  <strong>Marseille et dans les environs</strong>
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
                    <input id="telephone" name="telephone" value={form.telephone} onChange={handleChange} placeholder="Votre téléphone" />
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
                    <input id="zone" name="zone" value={form.zone} onChange={handleChange} placeholder="Ex : Marseille 13008" />
                  </div>
                </div>

                <div>
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange} placeholder="Décrivez votre besoin" />
                </div>

                <button type="submit" className="btn btn-primary full">Envoyer ma demande</button>

                {successMessage ? <div className="message success">{successMessage}</div> : null}
                {errorMessage ? <div className="message error">{errorMessage}</div> : null}

                <div className="message info">
                  Version GitHub prête à héberger. Les demandes sont stockées via localStorage. Pour une vraie réception centralisée des devis, il faudra ensuite connecter le formulaire à un backend ou à Google Sheets.
                </div>
              </form>
            </div>
          </div>

          <div className="container quotes-box-wrap">
            <div className="quotes-box">
              <div className="quotes-head">
                <div>
                  <h3>Demandes de devis enregistrées</h3>
                  <p>
                    {quotes.length} {quotes.length > 1 ? 'demandes' : 'demande'}
                  </p>
                </div>
                <div className="quotes-actions">
                  <button type="button" className="btn btn-outline" onClick={downloadCsv}>Exporter en CSV</button>
                  <button type="button" className="btn btn-outline danger" onClick={clearQuotes}>Vider les données</button>
                </div>
              </div>

              {displayedQuotes.length === 0 ? (
                <p className="empty-state">Aucune demande enregistrée pour le moment.</p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Nom</th>
                        <th>Téléphone</th>
                        <th>E-mail</th>
                        <th>Service</th>
                        <th>Zone</th>
                        <th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedQuotes.map((quote) => (
                        <tr key={quote.id}>
                          <td>{formatDate(quote.date)}</td>
                          <td>{quote.nom}</td>
                          <td>{quote.telephone}</td>
                          <td>{quote.email}</td>
                          <td>{quote.service}</td>
                          <td>{quote.zone}</td>
                          <td>{quote.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
    </div>
  );
}
