
package com.pmsservice.controller;

import com.pmsservice.dto.itemstocks.*;
import com.pmsservice.projection.ItemAvailabilityProjection;
import com.pmsservice.service.ItemInventoryService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pms")
public class ItemInventoryController {

    private final ItemInventoryService itemInventoryService;

    public ItemInventoryController(
            ItemInventoryService itemInventoryService) {
        this.itemInventoryService = itemInventoryService;
    }

    // ==================== ITEM MASTER ====================

    @PostMapping("/item-master")
    @ResponseStatus(HttpStatus.CREATED)
    public ItemMasterResponse createItem(
            @RequestBody ItemMasterRequest request) {
        return itemInventoryService.createItem(request);
    }

    @GetMapping("/item-master")
    public List<ItemMasterResponse> getAllItems() {
        return itemInventoryService.getAllItems();
    }

    @GetMapping("/item-master/{itemId}")
    public ItemMasterResponse getItemById(
            @PathVariable Short itemId) {
        return itemInventoryService.getItemById(itemId);
    }

    @PutMapping("/item-master/{itemId}")
    public ItemMasterResponse updateItem(
            @PathVariable Short itemId,
            @RequestBody ItemMasterRequest request) {
        return itemInventoryService.updateItem(itemId, request);
    }

    @DeleteMapping("/item-master/{itemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteItem(@PathVariable Short itemId) {
        itemInventoryService.deleteItem(itemId);
    }

    // ==================== ITEM STOCK ====================

    @GetMapping("/item-stock")
    public List<ItemStockResponse> getAllStockRecords() {
        return itemInventoryService.getAllStockRecords();
    }

    @GetMapping("/item-stock/{itemStockId}")
    public ItemStockResponse getStockRecordById(
            @PathVariable Integer itemStockId) {
        return itemInventoryService.getStockRecordById(itemStockId);
    }

    @GetMapping("/item-stock/availability")
    public List<ItemAvailabilityProjection> getItemAvailability() {
        return itemInventoryService.getItemAvailability();
    }

    @GetMapping("/item-stock/availability/{itemId}")
    public ItemAvailabilityProjection getItemAvailabilityById(
            @PathVariable Short itemId) {
        return itemInventoryService.getItemAvailabilityById(itemId);
    }
}
