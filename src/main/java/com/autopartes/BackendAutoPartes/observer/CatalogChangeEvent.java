package com.autopartes.BackendAutoPartes.observer;

/**
 * Event that is fired when the catalog changes.
 */
public class CatalogChangeEvent {
    public enum ChangeType {
        BATCH_ADDED,
        BATCH_UPDATED,
        BATCH_DELETED,
        ITEM_SOLD,
        ITEM_TYPE_ADDED,
        ITEM_TYPE_UPDATED,
        ITEM_TYPE_DELETED
    }

    private final ChangeType type;
    private final Object data;

    /**
     * Creates a new CatalogChangeEvent.
     *
     * @param type The type of change.
     * @param data The data that was changed.
     */
    public CatalogChangeEvent(ChangeType type, Object data) {
        this.type = type;
        this.data = data;
    }

    /**
     * Gets the type of change.
     *
     * @return The type of change.
     */
    public ChangeType getType() {
        return type;
    }

    /**
     * Gets the data that was changed.
     *
     * @return The data that was changed.
     */
    public Object getData() {
        return data;
    }
}