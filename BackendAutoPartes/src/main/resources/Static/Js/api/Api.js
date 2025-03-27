// Definimos la URL base de la API
const BASE_URL = "http://localhost:3000/api/batches"; // Ajusta la URL según tu backend

// Definimos la clase BatchesAPI con métodos estáticos para gestionar los batches
export class BatchesAPI {

    // Método para obtener todos los batches
    static async obtener() {
        try {
            const respuesta = await fetch(BASE_URL); // Hacemos la petición GET
            if (!respuesta.ok) throw new Error("Error al obtener los batches");
            return await respuesta.json(); // Convertimos la respuesta en JSON
        } catch (error) {
            console.error("Error en obtener:", error);
            return null;
        }
    }

    // Método para obtener un batch por su ID
    static async obtenerPorId(id) {
        try {
            const respuesta = await fetch(`${BASE_URL}/${id}`); // Petición GET con ID
            if (!respuesta.ok) throw new Error(`Error al obtener el batch con ID ${id}`);
            return await respuesta.json();
        } catch (error) {
            console.error("Error en obtenerPorId:", error);
            return null;
        }
    }

    // Método para crear un nuevo batch
    static async crear(datosBatch) {
        try {
            const respuesta = await fetch(BASE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosBatch) // Convertimos el objeto a JSON
            });

            if (!respuesta.ok) throw new Error("Error al crear el batch");
            return await respuesta.json();
        } catch (error) {
            console.error("Error en crear:", error);
            return null;
        }
    }

    // Método para actualizar un batch existente por ID
    static async actualizar(id, datosActualizados) {
        try {
            const respuesta = await fetch(`${BASE_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosActualizados)
            });

            if (!respuesta.ok) throw new Error(`Error al actualizar el batch con ID ${id}`);
            return await respuesta.json();
        } catch (error) {
            console.error("Error en actualizar:", error);
            return null;
        }
    }

    // Método para eliminar un batch por su ID
    static async eliminar(id) {
        try {
            const respuesta = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });

            if (!respuesta.ok) throw new Error(`Error al eliminar el batch con ID ${id}`);
            return true; // Retornamos true si se eliminó correctamente
        } catch (error) {
            console.error("Error en eliminar:", error);
            return false;
        }
    }
}
