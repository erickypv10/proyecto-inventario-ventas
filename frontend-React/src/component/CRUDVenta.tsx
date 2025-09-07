"use client";
import React, { useState } from "react";
import ModalVenta from "./ModalVenta";
import styles from "./ventas.module.css";

interface Venta {
  id: number;
  clienteId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  total: number;
  metodoPago: string;
  fechaVenta: string;
}

// Simulando datos de clientes y productos para mostrar nombres
const clientes = [
  { id: 1, nombre: "Juan Pérez" },
  { id: 2, nombre: "Ana Gómez" },
];

const productos = [
  { id: 1, nombre: "Producto A" },
  { id: 2, nombre: "Producto B" },
];

const CRUDVenta: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [ventaEditar, setVentaEditar] = useState<Venta | null>(null);

  const abrirModal = (venta?: Venta) => {
    setVentaEditar(venta || null);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setVentaEditar(null);
  };

  // Aquí eliminamos 'fechaVenta' del parámetro y lo agregamos automáticamente
  const guardarVenta = (venta: Omit<Venta, "id" | "total" | "fechaVenta">) => {
    const nuevaVenta: Venta = {
      id: ventaEditar ? ventaEditar.id : ventas.length + 1,
      ...venta,
      total: venta.cantidad * venta.precioUnitario,
      fechaVenta: new Date().toISOString(), // fecha automática
    };

    if (ventaEditar) {
      setVentas(ventas.map((v) => (v.id === ventaEditar.id ? nuevaVenta : v)));
    } else {
      setVentas([...ventas, nuevaVenta]);
    }

    cerrarModal();
  };

  const eliminarVenta = (id: number) => {
    setVentas(ventas.filter((v) => v.id !== id));
  };

  const obtenerNombreCliente = (id: number) => clientes.find(c => c.id === id)?.nombre || id;
  const obtenerNombreProducto = (id: number) => productos.find(p => p.id === id)?.nombre || id;

  return (
    <div className={styles.contenedor}>
      <div className={styles.barraAcciones}>
        <button className={styles.botonAgregar} onClick={() => abrirModal()}>
          Agregar Venta
        </button>
      </div>

      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total</th>
            <th>Método Pago</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{obtenerNombreCliente(v.clienteId)}</td>
              <td>{obtenerNombreProducto(v.productoId)}</td>
              <td>{v.cantidad}</td>
              <td>{v.precioUnitario}</td>
              <td>{v.total}</td>
              <td>{v.metodoPago}</td>
              <td>{new Date(v.fechaVenta).toLocaleDateString()}</td>
              <td>
                <button className={styles.botonEditar} onClick={() => abrirModal(v)}>Editar</button>
                <button className={styles.botonEliminar} onClick={() => eliminarVenta(v.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalAbierto && (
        <ModalVenta
          ventaEditar={ventaEditar}
          onGuardar={guardarVenta}
          onCerrar={cerrarModal}
        />
      )}
    </div>
  );
};

export default CRUDVenta;
