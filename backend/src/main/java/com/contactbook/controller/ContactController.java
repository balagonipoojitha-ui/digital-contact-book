package com.contactbook.controller;

import com.contactbook.model.Contact;
import com.contactbook.service.ContactService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class ContactController {
    private final ContactService service;

    public ContactController(ContactService service) {
        this.service = service;
    }

    public record ContactRequest(
            @NotBlank(message = "Name is required.")
            @Size(max = 100, message = "Name must be 100 characters or fewer.")
            String name,
            @NotBlank(message = "Phone number is required.")
            @Size(max = 20, message = "Phone number must be 20 characters or fewer.")
            String phone,
            @NotBlank(message = "Email is required.")
            @Email(message = "Enter a valid email address.")
            @Size(max = 150, message = "Email must be 150 characters or fewer.")
            String email
    ) {
        Contact toContact() {
            return new Contact(name, phone, email);
        }
    }

    @GetMapping
    public List<Contact> getAll(@RequestParam(required = false) String name) {
        return service.getAll(name);
    }

    @GetMapping("/{id}")
    public Contact getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Contact create(@Valid @RequestBody ContactRequest request) {
        return service.create(request.toContact());
    }

    @PutMapping("/{id}")
    public Contact update(@PathVariable Long id, @Valid @RequestBody ContactRequest request) {
        return service.update(id, request.toContact());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
