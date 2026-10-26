package com.contactbook.repository;

import com.contactbook.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findByNameContainingIgnoreCaseOrderByNameAsc(String name);
    List<Contact> findAllByOrderByNameAsc();
}
