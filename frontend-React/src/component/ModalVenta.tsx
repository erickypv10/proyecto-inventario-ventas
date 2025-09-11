"use client";
import React, { useEffect, useRef, useState } from "react";
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

interface Cliente { id: number; nombre: string; }
interface Producto { id: number; name: string; price: number; stock?: number; }

interface ModalVentaProps {
  ventaEditar: Venta | null;
  onGuardar: (venta: Omit<Venta, "id" | "total" | "fechaVenta">) => void;
  onCerrar: () => void;
}

const ModalVenta: React.FC<ModalVentaProps> = ({ ventaEditar, onGuardar, onCerrar }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clienteId, setClienteId] = useState<number>(0);
  const [productoId, setProductoId] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(1);
  const [precioUnitario, setPrecioUnitario] = useState<number>(0);
  const [metodoPago, setMetodoPago] = useState<string>("");
  const [errorStock, setErrorStock] = useState<string>("");

  // Flag para evitar sobreescribir precioUnitario al inicializar edición
  const initFromEdit = useRef(false);

  // Cargar clientes y productos
  useEffect(() => {
    fetch("https://localhost:7106/api/Clientes")
      .then(res => res.json())
      .then(data => setClientes(data))
      .catch(err => console.error("Error cargando clientes:", err));

    fetch("https://localhost:7106/api/Producto")
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error("Error cargando productos:", err));
  }, []);

  // Inicializar modal (abrir para crear o editar)
  useEffect(() => {
    if (ventaEditar) {
      setClienteId(ventaEditar.clienteId);
      setProductoId(ventaEditar.productoId);
      setCantidad(ventaEditar.cantidad);
      setPrecioUnitario(ventaEditar.precioUnitario);
      setMetodoPago(ventaEditar.metodoPago);
      initFromEdit.current = true;
    } else {
      setClienteId(0);
      setProductoId(0);
      setCantidad(1);
      setPrecioUnitario(0);
      setMetodoPago("");
      initFromEdit.current = false;
    }
    setErrorStock("");
  }, [ventaEditar]);

  // Actualizar precio según producto seleccionado.
  // Si venimos de editar y el producto seleccionado es el mismo que tenía la venta a editar,
  // no sobreescribimos el precio (para preservar posibles precios personalizados).
  useEffect(() => {
    const prod = productos.find(p => p.id === productoId);
    if (!prod) {
      setPrecioUnitario(0);
      return;
    }

    if (initFromEdit.current && ventaEditar && productoId === ventaEditar.productoId) {
      // preservamos precio inicial de la ventaEditar; desactivamos flag para próximas selecciones
      initFromEdit.current = false;
      return;
    }

    // caso normal: seleccionar producto nuevo -> usar price de producto
    setPrecioUnitario(prod.price ?? 0);
  }, [productoId, productos, ventaEditar]);

  const productoSeleccionado = productos.find(p => p.id === productoId);
  const stockDisponible = productoSeleccionado?.stock ?? Infinity;

  const manejarCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) val = 1;

    if (productoSeleccionado && typeof productoSeleccionado.stock === "number" && val > productoSeleccionado.stock) {
      setErrorStock(`Cantidad excede el stock disponible (${productoSeleccionado.stock})`);
      setCantidad(productoSeleccionado.stock);
    } else {
      setErrorStock("");
      setCantidad(val);
    }
  };

  const manejarGuardar = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!clienteId || !productoId || cantidad <= 0 || !metodoPago || errorStock) {
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

  const estaInvalido = !clienteId || !productoId || cantidad <= 0 || errorStock !== "" || !metodoPago;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContenido}>
        <h2 className={styles.tituloModal}>{ventaEditar ? "Editar Venta" : "Agregar Venta"}</h2>

        <form onSubmit={manejarGuardar}>
          <div className={styles.formGroup}>
            <label>Cliente</label>
            <select value={clienteId} onChange={e => setClienteId(Number(e.target.value))}>
              <option value={0}>Seleccione un cliente</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Producto</label>
            <select value={productoId} onChange={e => setProductoId(Number(e.target.value))}>
              <option value={0}>Seleccione un producto</option>
              {productos.map(p => (
                <option key={p.id} value={p.id} disabled={p.stock == 0 }>{p.name} - ${p.price}</option>
              ))}
            </select>
            {productoSeleccionado && (
              <small style={{ color: errorStock ? "red" : "black" }}>
                Stock disponible: {Number.isFinite(stockDisponible) ? stockDisponible : "N/A"}
              </small>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Cantidad</label>
            <input type="number" value={cantidad} min={1} onChange={manejarCantidadChange} />
            {errorStock && <p style={{ color: "red" }}>{errorStock}</p>}
          </div>

          <div className={styles.formGroup}>
            <label>Precio Unitario</label>
            <input
              type="number"
              value={precioUnitario}
              onChange={e => setPrecioUnitario(Number(e.target.value ?? 0))}
              min={0}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Método Pago</label>
            <input type="text" value={metodoPago} onChange={e => setMetodoPago(e.target.value)} />
          </div>

          <div className={styles.modalAcciones}>
            <button type="button" className={styles.btnCancelar} onClick={onCerrar}>Cancelar</button>
            <button type="submit" className={styles.btnGuardar} disabled={estaInvalido}>
              {ventaEditar ? "Guardar Cambios" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalVenta;
