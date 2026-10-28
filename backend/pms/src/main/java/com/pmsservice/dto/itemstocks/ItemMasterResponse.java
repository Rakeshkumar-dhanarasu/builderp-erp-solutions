package com.pmsservice.dto.itemstocks;

public record ItemMasterResponse(
    Short itemId,
    String itemName,
    String itemCategory
) {}