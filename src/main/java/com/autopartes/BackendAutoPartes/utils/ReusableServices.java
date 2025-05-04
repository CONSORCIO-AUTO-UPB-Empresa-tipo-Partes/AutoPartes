package com.autopartes.BackendAutoPartes.utils;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * Utility class providing reusable service methods for common operations.
 * @Author: Raul Lozano
 */
public final class ReusableServices {

    private ReusableServices() {
        throw new AssertionError("Utility class should not be instantiated");
    }

    /**
     * Functional interface for objects that can provide a name through any method.
     *
     * @param <T> The type of the object that provides the name
     */
    @FunctionalInterface
    public interface NameProvider<T> {
        String getName(T object);
    }

    /**
     * Finds an object by name in a list using a custom name provider function.
     *
     * @param name         The name to search for (case-sensitive).
     * @param list        The list of objects to search through.
     * @param nameProvider The function that extracts the name from the object.
     * @param <T>         The type of the object.
     * @return Optional containing the found object, or empty if not found or inputs are null.
     * @throws NullPointerException if the name parameter or nameProvider is null
     * <p>
     *     Example usage:
     *     <pre>{@code
     *     Optional<Itemtype> itemtype = ReusableServices.findByName("itemtype_name", itemtypeList, Itemtype::getName);
     *     }</pre>
     */
    public static <T> Optional<T> findByName(String name, List<T> list, NameProvider<T> nameProvider) {
        Objects.requireNonNull(name, "Name parameter cannot be null");
        Objects.requireNonNull(nameProvider, "Name provider cannot be null");

        if (list == null || list.isEmpty()) {
            return Optional.empty();
        }

        return list.stream()
                .filter(item -> name.equals(nameProvider.getName(item)))
                .findFirst();
    }
}