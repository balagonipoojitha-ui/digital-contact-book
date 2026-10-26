package com.contactbook.service;

import com.contactbook.model.Contact;
import com.contactbook.repository.ContactRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ContactService {
    private final ContactRepository repository;

    public ContactService(ContactRepository repository) {
        this.repository = repository;
    }

    public List<Contact> getAll(String name) {
        if (name == null || name.isBlank()) {
            return repository.findAllByOrderByNameAsc();
        }
        return repository.findByNameContainingIgnoreCaseOrderByNameAsc(name.trim());
    }

    public Contact getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact not found."));
    }

    public Contact create(Contact contact) {
        contact.setId(null);
        clean(contact);
        return repository.save(contact);
    }

    public Contact update(Long id, Contact details) {
        Contact existing = getById(id);
        existing.setName(details.getName().trim());
        existing.setPhone(details.getPhone().trim());
        existing.setEmail(details.getEmail().trim());
        return repository.save(existing);
    }

    public void delete(Long id) {
        Contact existing = getById(id);
        repository.delete(existing);
    }

    private void clean(Contact contact) {
        contact.setName(contact.getName().trim());
        contact.setPhone(contact.getPhone().trim());
        contact.setEmail(contact.getEmail().trim());
    }
}
