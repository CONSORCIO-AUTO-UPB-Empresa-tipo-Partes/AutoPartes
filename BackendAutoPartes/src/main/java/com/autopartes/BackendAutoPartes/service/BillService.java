package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.Batch;
import com.autopartes.BackendAutoPartes.model.Bill;
import com.autopartes.BackendAutoPartes.model.BillHasBatch;
import com.autopartes.BackendAutoPartes.repository.BillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Service
public class BillService {
    private final BillRepository billRepository;

    public BillService(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    public Bill saveBill(Bill bill) {
        return billRepository.save(bill);
    }

    public void deleteBill(Long id) {
        billRepository.deleteById(id);
    }

    public Optional<Bill> getBillById(Long id) {
        return billRepository.findById(id);
    }

    /**
     * Método para obtener todas las facturas dentro de un rango de fechas.
     * Se comunica con el repositorio para ejecutar la consulta.
     *
     * @param startDate Fecha de inicio del rango.
     * @param endDate Fecha de fin del rango.
     * @return Lista de facturas dentro del rango.
     */
    public List<Bill> getBillsByDateRange(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay(); // 00:00:00 del inicio
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59); // 23:59:59 del final

        return billRepository.findByDateBetween(startDateTime, endDateTime);
    }//getBillsByDateRange

    /**
     * Método para calcular las ganancias del mes.
     * Busca todas las facturas del mes y calcula la ganancia de cada producto vendido
     * restando el precio de compra al precio de venta, luego suma las ganancias de todos los productos.
     */
    @Transactional(readOnly = true)
    public double getMonthlyProfit() {
        // Obtener el primer y último día del mes actual
        LocalDate firstDayOfMonth = YearMonth.now().atDay(1);
        LocalDate lastDayOfMonth = YearMonth.now().atEndOfMonth();

        // Obtener todas las facturas dentro del mes actual
        List<Bill> bills = billRepository.findByDateBetween(
                firstDayOfMonth.atStartOfDay(),
                lastDayOfMonth.atTime(23, 59, 59)
        );

        double totalProfit = 0.0;

        // Recorrer cada factura para calcular la ganancia por producto vendido
        for (Bill bill : bills) {
            for (BillHasBatch billHasBatch : bill.getBillHasBatches()) {
                Batch batch = billHasBatch.getBatch();
                int cantidadVendida = billHasBatch.getAmountSold();
                double precioVenta = Optional.ofNullable(batch.getSalePrice()).orElse(0.0);
                double precioCompra = Optional.ofNullable(batch.getPurchasePrice()).orElse(0.0);

                // Calcular la ganancia por unidad y luego multiplicar por la cantidad vendida
                double profitPerUnit = precioVenta - precioCompra;
                totalProfit += profitPerUnit * cantidadVendida;
            }
        }

        return totalProfit;

        /**
         Obtiene el primer y último día del mes actual.
         Busca todas las facturas que se emitieron dentro de ese mes.
         Recorre cada factura para revisar los productos vendidos.
         Para cada producto vendido, obtiene su precio de compra y venta.
         Calcula la ganancia por unidad restando el precio de compra al precio de venta.
         Multiplica la ganancia por la cantidad vendida para obtener la ganancia total.
         Retorna la ganancia total del mes sumando las ganancias de todos los productos vendidos.
         */
    }//getMonthlyProfit
}