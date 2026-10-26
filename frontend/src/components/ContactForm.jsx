import { useEffect, useState } from 'react';
import { X, UserRound, Phone, Mail } from 'lucide-react';

const emptyForm = { name: '', phone: '', email: '' };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm({ initialContact, onSave, onCancel, saving }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initialContact
      ? { name: initialContact.name, phone: initialContact.phone, email: initialContact.email }
      : emptyForm);
    setErrors({});
  }, [initialContact]);

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setErrors({ ...errors, [event.target.name]: '' });
  }

  async function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required.';
    if (!form.phone.trim()) nextErrors.phone = 'Phone number is required.';
    if (!form.email.trim()) nextErrors.email = 'Email is required.';
    else if (!emailPattern.test(form.email.trim())) nextErrors.email = 'Enter a valid email address.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    await onSave({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim()
    });
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div className="modal-heading">
          <div>
            <span className="eyebrow">{initialContact ? 'UPDATE DETAILS' : 'NEW ENTRY'}</span>
            <h2 id="form-title">{initialContact ? 'Edit contact' : 'Add a contact'}</h2>
            <p>Keep important people just a click away.</p>
          </div>
          <button className="icon-button" type="button" onClick={onCancel} aria-label="Close form"><X size={19} /></button>
        </div>
        <form onSubmit={submit} noValidate>
          <label className="field-label" htmlFor="name">Full name</label>
          <div className={`input-wrap ${errors.name ? 'invalid' : ''}`}>
            <UserRound size={18} />
            <input id="name" name="name" value={form.name} onChange={change} placeholder="e.g. Ravi Kumar" maxLength={100} autoFocus />
          </div>
          {errors.name && <span className="field-error">{errors.name}</span>}

          <label className="field-label" htmlFor="phone">Phone number</label>
          <div className={`input-wrap ${errors.phone ? 'invalid' : ''}`}>
            <Phone size={18} />
            <input id="phone" name="phone" type="tel" value={form.phone} onChange={change} placeholder="e.g. +91 98765 43210" maxLength={20} />
          </div>
          {errors.phone && <span className="field-error">{errors.phone}</span>}

          <label className="field-label" htmlFor="email">Email address</label>
          <div className={`input-wrap ${errors.email ? 'invalid' : ''}`}>
            <Mail size={18} />
            <input id="email" name="email" type="email" value={form.email} onChange={change} placeholder="e.g. ravi@example.com" maxLength={150} />
          </div>
          {errors.email && <span className="field-error">{errors.email}</span>}

          <div className="modal-actions">
            <button className="button button-secondary" type="button" onClick={onCancel}>Cancel</button>
            <button className="button button-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : initialContact ? 'Save changes' : 'Save contact'}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
