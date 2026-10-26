import { Mail, Phone, Pencil, Trash2, ContactRound } from 'lucide-react';

const palette = ['lavender', 'mint', 'peach', 'sky', 'rose', 'lemon'];

function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || '?';
}

export default function ContactList({ contacts, onEdit, onDelete }) {
  if (!contacts.length) {
    return (
      <div className="empty-state">
        <div className="empty-icon"><ContactRound size={30} /></div>
        <h3>No contacts found</h3>
        <p>Try another name or add a new contact to your address book.</p>
      </div>
    );
  }

  return (
    <div className="contact-grid">
      {contacts.map((contact, index) => (
        <article className="contact-card" key={contact.id}>
          <div className="contact-card-top">
            <div className={`avatar ${palette[index % palette.length]}`}>{initials(contact.name)}</div>
            <div className="contact-actions">
              <button className="icon-button" type="button" onClick={() => onEdit(contact)} aria-label={`Edit ${contact.name}`} title="Edit contact"><Pencil size={16} /></button>
              <button className="icon-button delete-button" type="button" onClick={() => onDelete(contact)} aria-label={`Delete ${contact.name}`} title="Delete contact"><Trash2 size={16} /></button>
            </div>
          </div>
          <h3 className="contact-name">{contact.name}</h3>
          <div className="contact-detail"><Phone size={15} /><a href={`tel:${contact.phone}`}>{contact.phone}</a></div>
          <div className="contact-detail"><Mail size={15} /><a href={`mailto:${contact.email}`} title={contact.email}>{contact.email}</a></div>
        </article>
      ))}
    </div>
  );
}
