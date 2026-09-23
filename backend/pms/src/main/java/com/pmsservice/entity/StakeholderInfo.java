package com.pmsservice.entity;

import com.pmsservice.enums.StakeholderType;

import java.time.Instant;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "stakeholder_info")
public class StakeholderInfo {

    @Id
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "stakeholder_id_generator"
    )
    @SequenceGenerator(
        name = "stakeholder_id_generator",
        sequenceName = "stakeholder_id_seq",
        allocationSize = 1
    )
    @Column(name = "stakeholder_id", nullable = false)
    private Integer stakeholderId;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(
        name = "stakeholder_category",
        nullable = false,
        columnDefinition = "stakeholder_type"
    )
    private StakeholderType stakeholderCategory;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "primary_phone_code", nullable = false)
    private Short primaryPhoneCode;

    @Column(name = "primary_phone_num", nullable = false)
    private Long primaryPhoneNum;

    @Column(name = "secondary_phone_code")
    private Short secondaryPhoneCode;

    @Column(name = "secondary_phone_num")
    private Long secondaryPhoneNum;

    @Column(name = "email", nullable = false, unique = true, length = 254)
    private String email;

    @Column(name = "primary_address", nullable = false)
    private String primaryAddress;

    @Column(name = "secondary_address")
    private String secondaryAddress;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "state_or_province")
    private String stateOrProvince;

    @Column(name = "country", nullable = false)
    private String country;

    @Column(name = "related_docs")
    private byte[] relatedDocs;

    @Column(name = "xtra_comments")
    private String extraComments;

    @Column(name = "postal_code", length = 12)
    private String postalCode;
    
    @Column(name = "created_by", nullable = false)
    private Integer createdBy;

    @Column(name = "created_date", nullable = false)
    private Instant createdDate;

    @Column(name = "modified_by")
    private Integer modifiedBy;

    @Column(name = "modified_date")
    private Instant modifiedDate;

    @Column(name = "is_active", nullable = false)
    private Boolean active;


    // Getters and Setters

    public Integer getStakeholderId() {
        return stakeholderId;
    }

    public void setStakeholderId(Integer stakeholderId) {
        this.stakeholderId = stakeholderId;
    }

    public StakeholderType getStakeholderCategory() {
        return stakeholderCategory;
    }

    public void setStakeholderCategory(StakeholderType stakeholderCategory) {
        this.stakeholderCategory = stakeholderCategory;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Short getPrimaryPhoneCode() {
        return primaryPhoneCode;
    }

    public void setPrimaryPhoneCode(Short primaryPhoneCode) {
        this.primaryPhoneCode = primaryPhoneCode;
    }

    public Long getPrimaryPhoneNum() {
        return primaryPhoneNum;
    }

    public void setPrimaryPhoneNum(Long primaryPhoneNum) {
        this.primaryPhoneNum = primaryPhoneNum;
    }

    public Short getSecondaryPhoneCode() {
        return secondaryPhoneCode;
    }

    public void setSecondaryPhoneCode(Short secondaryPhoneCode) {
        this.secondaryPhoneCode = secondaryPhoneCode;
    }

    public Long getSecondaryPhoneNum() {
        return secondaryPhoneNum;
    }

    public void setSecondaryPhoneNum(Long secondaryPhoneNum) {
        this.secondaryPhoneNum = secondaryPhoneNum;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPrimaryAddress() {
        return primaryAddress;
    }

    public void setPrimaryAddress(String primaryAddress) {
        this.primaryAddress = primaryAddress;
    }

    public String getSecondaryAddress() {
        return secondaryAddress;
    }

    public void setSecondaryAddress(String secondaryAddress) {
        this.secondaryAddress = secondaryAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStateOrProvince() {
        return stateOrProvince;
    }

    public void setStateOrProvince(String stateOrProvince) {
        this.stateOrProvince = stateOrProvince;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public byte[] getRelatedDocs() {
        return relatedDocs;
    }

    public void setRelatedDocs(byte[] relatedDocs) {
        this.relatedDocs = relatedDocs;
    }

    public String getExtraComments() {
        return extraComments;
    }

    public void setExtraComments(String extraComments) {
        this.extraComments = extraComments;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }
    
    public Integer getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Integer createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public Integer getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(Integer modifiedBy) {
        this.modifiedBy = modifiedBy;
    }

    public Instant getModifiedDate() {
        return modifiedDate;
    }

    public void setModifiedDate(Instant modifiedDate) {
        this.modifiedDate = modifiedDate;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}