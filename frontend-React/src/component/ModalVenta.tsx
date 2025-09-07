"use client";
import React, { useState, useEffect } from "react";
import styles from "./ModalVenta.module.css";

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

interface Cliente {
  id: number;
  nombre: string;
}

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;  // Agregado stock
}

interface ModalVentaProps {
  ventaEditar: Venta | null;
  onGuardar: (venta: Omit<Venta, "id" | "total" | "fechaVenta">) => void;
  onCerrar: () => void;
}

const ModalVenta: React.FC<ModalVentaProps> = ({ ventaEditar, onGuardar, onCerrar }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);

  const [clienteId, setClienteId] = useState(0);
  const [productoId, setProductoId] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [precioUnitario, setPrecioUnitario] = useState(0);
  const [metodoPago, setMetodoPago] = useState("");
  const [errorStock, setErrorStock] = useState("");

  useEffect(() => {
    // Cargar datos de clientes y productos desde API real (incluyendo stock)
    // Por ahora con datos simulados incluyendo stock
    setClientes([
      { id: 1, nombre: "Juan Pérez" },
      { id: 2, nombre: "Ana Gómez" },
    ]);

    setProductos([
      { id: 1, nombre: "Producto A", precio: 50, stock: 5 },
      { id: 2, nombre: "Producto B", precio: 30, stock: 10 },
    ]);
  }, []);

  useEffect(() => {
    if (ventaEditar) {
      setClienteId(ventaEditar.clienteId);
      setProductoId(ventaEditar.productoId);
      setCantidad(ventaEditar.cantidad);
      setPrecioUnitario(ventaEditar.precioUnitario);
      setMetodoPago(ventaEditar.metodoPago);
      setErrorStock("");
    } else {
      setClienteId(0);
      setProductoId(0);
      setCantidad(1);
      setPrecioUnitario(0);
      setMetodoPago("");
      setErrorStock("");
    }
  }, [ventaEditar]);

  useEffect(() => {
    // Actualiza el precio unitario según el producto seleccionado
    const producto = productos.find((p) => p.id === productoId);
    if (producto) setPrecioUnitario(producto.precio);
  }, [productoId, productos]);

  const productoSeleccionado = productos.find((p) => p.id === productoId);

  const manejarCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (productoSeleccionado && val > productoSeleccionado.stock) {
      setErrorStock(`Cantidad excede el stock disponible (${productoSeleccionado.stock})`);
      setCantidad(productoSeleccionado.stock);
    } else if (val <= 0 || isNaN(val)) {
      setErrorStock("La cantidad debe ser mayor que 0");
      setCantidad(1);
    } else {
      setErrorStock("");
      setCantidad(val);
    }
  };

  const manejarGuardar = () => {
    if (
      !clienteId ||
      !productoId ||
      cantidad <= 0 ||
      precioUnitario <= 0 ||
      !metodoPago ||
      errorStock !== ""
    ) {
      alert("Todos los campos son obligatorios y válidos");
      return;
    }

    onGuardar({
      clienteId,
      productoId,
      cantidad,
      precioUnitario,
      metodoPago,
    });

    onCerrar();
  };

  const estaInvalido =
    !clienteId ||
    !productoId ||
    cantidad <= 0 ||
    errorStock !== "" ||
    !metodoPago;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContenido}>
        <h2 className={styles.tituloModal}>{ventaEditar ? "Editar Venta" : "Agregar Venta"}</h2>

        <div className={styles.formGroup}>
          <label>Cliente</label>
          <select value={clienteId} onChange={(e) => setClienteId(parseInt(e.target.value))}>
            <option value={0}>Seleccione un cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Producto</label>
          <select value={productoId} onChange={(e) => setProductoId(parseInt(e.target.value))}>
            <option value={0}>Seleccione un producto</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} - ${p.precio}
              </option>
            ))}
          </select>
          {productoSeleccionado && (
            <small style={{ color: errorStock ? "red" : "black" }}>
              Stock disponible: {productoSeleccionado.stock}
            </small>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Cantidad</label>
          <input
            type="number"
            value={cantidad}
            min={1}
            onChange={manejarCantidadChange}
          />
          {errorStock && <p style={{ color: "red" }}>{errorStock}</p>}
        </div>

        <div className={styles.formGroup}>
          <label>Precio Unitario</label>
          <input type="number" value={precioUnitario} readOnly />
        </div>

        <div className={styles.formGroup}>
          <label>Método Pago</label>
          <input type="text" value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} />
        </div>

        <div className={styles.modalAcciones}>
          <button className={styles.btnCancelar} onClick={onCerrar}>
            Cancelar
          </button>
          <button className={styles.btnGuardar} onClick={manejarGuardar} disabled={estaInvalido}>
            {ventaEditar ? "Guardar Cambios" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalVenta;
