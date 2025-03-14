package com.autopartes.BackendAutoPartes.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "item_types")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ItemType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToMany(mappedBy = "itemType")
    private List<Batch> batches;
}
