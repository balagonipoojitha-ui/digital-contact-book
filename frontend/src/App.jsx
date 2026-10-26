import { useCallback, useEffect, useMemo, useState } from 'react';
import { BookUser, Search, Plus, UsersRound, ContactRound, RefreshCw, X, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';
import { contactService } from './services/contactService.js';
import ContactForm from './components/ContactForm.jsx';
import ContactList from './components/ContactList.jsx';

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [modalContact, setModalContact] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadContacts = useCallback(async (query = search) => {
    setLoading(true);
    setError('');
    try {
      const data = await contactService.getAll(query);
      setContacts(data);
    } catch (err) {
      setError(err.message || 'Could not load contacts.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => loadContacts(search), 250);
    return () => clearTimeout(timer);
  }, [search, loadContacts]);

  const totalCount = useMemo(() => contacts.length, [contacts]);

  async function saveContact(data) {
    setSaving(true);
    setError('');
    try {
      if (modalContact) {
        await contactService.update(modalContact.id, data);
        setNotice('Contact updated successfully.');
      } else {
        await contactService.create(data);
        setNotice('Contact saved successfully.');
      }
      setModalContact(undefined);
      await loadContacts(search);
    } catch (err) {
      setError(err.message || 'Unable to save contact.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteContact(contact) {
    if (!window.confirm(`Delete ${contact.name} from your contacts?`)) return;
    setError('');
    setNotice('');
    try {
      await contactService.remove(contact.id);
      setNotice(`${contact.name} was deleted.`);
      await loadContacts(search);
    } catch (err) {
      setError(err.message || 'Unable to delete contact.');
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Digital Contact Book home">
          <span className="brand-mark"><BookUser size={23} strokeWidth={2.2} /></span>
          <span>contact<span className="brand-accent">book</span></span>
        </a>
        <div className="topbar-right"><span className="status-dot" /> Your personal address book</div>
      </header>

      <main className="main-content">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow hero-eyebrow"><BookOpen size={14} /> YOUR PEOPLE, ORGANIZED</span>
            <h1>Every connection,<br /><span>all in one place.</span></h1>
            <p>A simple, thoughtful space to keep the people who matter close at hand.</p>
            <button className="button button-primary add-main" onClick={() => { setModalContact(null); setNotice(''); }}><Plus size={18} /> Add new contact</button>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-card art-card-back"><span className="art-avatar avatar-mint">AM</span><span className="art-line line-long" /><span className="art-line line-short" /></div>
            <div className="art-card art-card-front"><span className="art-avatar avatar-lavender">RK</span><span className="art-line line-long" /><span className="art-line line-medium" /><span className="art-chip"><CheckCircle2 size={13} /> Connected</span></div>
            <div className="floating-dot dot-one" /><div className="floating-dot dot-two" />
          </div>
        </section>

        <section className="workspace">
          <div className="section-heading">
            <div>
              <span className="eyebrow">YOUR DIRECTORY</span>
              <h2>All contacts <span className="count-badge">{totalCount}</span></h2>
              <p>Manage and find your saved connections.</p>
            </div>
            <button className="button button-secondary refresh-button" onClick={() => loadContacts(search)} disabled={loading}><RefreshCw size={15} className={loading ? 'spin' : ''} /> Refresh</button>
          </div>

          <div className="toolbar">
            <div className="search-box">
              <Search size={19} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search contacts by name…" aria-label="Search contacts by name" />
              {search && <button className="clear-search" onClick={() => setSearch('')} aria-label="Clear search"><X size={16} /></button>}
            </div>
            <div className="toolbar-caption"><UsersRound size={16} /> {loading ? 'Loading…' : `${contacts.length} ${contacts.length === 1 ? 'contact' : 'contacts'} shown`}</div>
          </div>

          {notice && <div className="notice success-notice"><CheckCircle2 size={17} /> <span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss message"><X size={15} /></button></div>}
          {error && <div className="notice error-notice"><AlertCircle size={17} /><span>{error}</span><button onClick={() => setError('')} aria-label="Dismiss error"><X size={15} /></button></div>}

          {loading ? (
            <div className="loading-state"><span className="loader" /> Loading your contacts…</div>
          ) : contacts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><ContactRound size={30} /></div>
              <h3>{search.trim() ? 'No matching contacts' : 'Your address book is ready'}</h3>
              <p>{search.trim() ? `We couldn't find anyone named “${search.trim()}”. Try a different name.` : 'Start building your directory by adding your first contact.'}</p>
              {search.trim()
                ? <button className="button button-secondary" onClick={() => setSearch('')}>Clear search</button>
                : <button className="button button-primary" onClick={() => setModalContact(null)}><Plus size={17} /> Add first contact</button>}
            </div>
          ) : (
            <ContactList contacts={contacts} onEdit={(contact) => { setModalContact(contact); setNotice(''); }} onDelete={deleteContact} />
          )}
        </section>
        <footer className="footer"><span>Made to keep you connected.</span><span><span className="footer-dot" /> Stored securely in your database</span></footer>
      </main>

      {modalContact !== undefined && (
        <ContactForm
          initialContact={modalContact}
          onSave={saveContact}
          onCancel={() => setModalContact(undefined)}
          saving={saving}
        />
      )}
    </div>
  );
}
