package com.pmsservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "item_master", schema = "public")
public class ItemMaster {

    @Id
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "item_master_id_generator"
    )
    @SequenceGenerator(
        name = "item_master_id_generator",
        sequenceName = "item_master_item_id_seq",
        schema = "public",
        allocationSize = 1
    )
    @Column(name = "item_id", nullable = false)
    private Short itemId;

    @Column(name = "item_name", nullable = false, length = 255)
    private String itemName;

    @Column(name = "item_category", nullable = false, length = 255)
    private String itemCategory;

    public Short getItemId() {
        return itemId;
    }

    public void setItemId(Short itemId) {
        this.itemId = itemId;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getItemCategory() {
        return itemCategory;
    }

    public void setItemCategory(String itemCategory) {
        this.itemCategory = itemCategory;
    }
}