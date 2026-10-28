
package com.pmsservice.service;

import com.pmsservice.dto.itemstocks.*;
import com.pmsservice.entity.ItemMaster;
import com.pmsservice.entity.ItemStock;
import com.pmsservice.projection.ItemAvailabilityProjection;
import com.pmsservice.repository.ItemMasterRepository;
import com.pmsservice.repository.ItemStockRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@Service
public class ItemInventoryService {

    private final ItemMasterRepository itemMasterRepository;
    private final ItemStockRepository itemStockRepository;

    public ItemInventoryService(
            ItemMasterRepository itemMasterRepository,
            ItemStockRepository itemStockRepository) {
        this.itemMasterRepository = itemMasterRepository;
        this.itemStockRepository = itemStockRepository;
    }

    // ==================== ITEM MASTER ====================

    @Transactional
    public ItemMasterResponse createItem(ItemMasterRequest request) {
        validateRequest(request);

        ItemMaster item = new ItemMaster();
        item.setItemName(request.itemName().trim());
        item.setItemCategory(request.itemCategory().trim());

        return toItemResponse(itemMasterRepository.save(item));
    }

    @Transactional(readOnly = true)
    public List<ItemMasterResponse> getAllItems() {
        return itemMasterRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(
                        ItemMaster::getItemName,
                        String.CASE_INSENSITIVE_ORDER))
                .map(this::toItemResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ItemMasterResponse getItemById(Short itemId) {
        return toItemResponse(findItem(itemId));
    }

    @Transactional
    public ItemMasterResponse updateItem(
            Short itemId,
            ItemMasterRequest request) {
        validateRequest(request);

        ItemMaster item = findItem(itemId);
        item.setItemName(request.itemName().trim());
        item.setItemCategory(request.itemCategory().trim());

        return toItemResponse(itemMasterRepository.save(item));
    }

    @Transactional
    public void deleteItem(Short itemId) {
        ItemMaster item = findItem(itemId);

        if (itemStockRepository.existsByItem_ItemId(itemId)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot delete this item because stock records reference it."
            );
        }

        itemMasterRepository.delete(item);
    }

    // ==================== ITEM STOCK ====================

    @Transactional(readOnly = true)
    public List<ItemStockResponse> getAllStockRecords() {
        return itemStockRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(
                        ItemStock::getStockedAt,
                        Comparator.reverseOrder()))
                .map(this::toStockResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ItemStockResponse getStockRecordById(Integer itemStockId) {
        ItemStock stock = itemStockRepository.findById(itemStockId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Stock record not found: " + itemStockId
                ));

        return toStockResponse(stock);
    }

    @Transactional(readOnly = true)
    public List<ItemAvailabilityProjection> getItemAvailability() {
        return itemMasterRepository.findItemAvailability();
    }

    @Transactional(readOnly = true)
    public ItemAvailabilityProjection getItemAvailabilityById(
            Short itemId) {
        return itemMasterRepository.findItemAvailability()
                .stream()
                .filter(item -> itemId.equals(item.getItemId()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Item not found: " + itemId
                ));
    }

    // ==================== HELPERS ====================

    private ItemMaster findItem(Short itemId) {
        return itemMasterRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Item not found: " + itemId
                ));
    }

    private void validateRequest(ItemMasterRequest request) {
        if (request == null
                || request.itemName() == null
                || request.itemName().isBlank()
                || request.itemCategory() == null
                || request.itemCategory().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Item name and item category are required."
            );
        }

        if (request.itemName().trim().length() > 255
                || request.itemCategory().trim().length() > 255) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Item name and item category must not exceed 255 characters."
            );
        }
    }

    private ItemMasterResponse toItemResponse(ItemMaster item) {
        return new ItemMasterResponse(
                item.getItemId(),
                item.getItemName(),
                item.getItemCategory()
        );
    }

    private ItemStockResponse toStockResponse(ItemStock stock) {
        return new ItemStockResponse(
                stock.getItemStockId(),
                stock.getItem().getItemId(),
                stock.getItem().getItemName(),
                stock.getItem().getItemCategory(),
                stock.getItemQuantity(),
                stock.getStockedAt(),
                stock.getStockedBy(),
                stock.getProject().getProjectId(),
                stock.getPurchaseOrder().getPoRequestId()
        );
    }
}
