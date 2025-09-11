"use client";
import { useState } from "react";
import styles from "./BarraAccionesVentas.module.css";

interface Cliente { id: number; nombre: string; }
interface Producto { id: number; name: string; }

interface BarraAccionesVentasProps {
  clientes: Cliente[];
  productos: Producto[];
  onFiltrar: (busqueda: string, clienteId: number, productoId: number) => void;
  onAgregar: () => void;
}

export default function BarraAccionesVentas({
  clientes,
  productos,
  onFiltrar,
  onAgregar,
}: BarraAccionesVentasProps) {
  const [busqueda, setBusqueda] = useState("");   
  const [clienteId, setClienteId] = useState(0);
  const [productoId, setProductoId] = useState(0);

  return (
    <div className={styles.contenedor}>
      <div className={styles.filtros}>
        <input
          className={styles.input}
          type="text"
          placeholder="Buscar por cliente o producto"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />

        <select
          className={styles.select}
          value={clienteId}
          onChange={e => setClienteId(Number(e.target.value))}
        >
          <option value={0}>Todos los clientes</option>
          {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>

        <select
          className={styles.select}
          value={productoId}
          onChange={e => setProductoId(Number(e.target.value))}
        >
          <option value={0}>Todos los productos</option>
          {productos.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <button
          className={styles.botonFiltrar}
          onClick={() => onFiltrar(busqueda, clienteId, productoId)}
        >
          Filtrar
        </button>

        <button className={styles.botonAgregar} onClick={onAgregar}>
          Agregar Venta
        </button>
      </div>
    </div>
  );
}
