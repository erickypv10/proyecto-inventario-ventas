"use client";
import { useState } from "react";
import styles from "./BarraAcciones.module.css";

interface Categoria { id: number; nombre: string; }
interface Proveedor { id: number; nombre: string; }

interface BarraAccionesProps {
  categorias: Categoria[];
  proveedores: Proveedor[];
  onFiltrar: (nombre: string, categoriaId: number, proveedorId: number) => void;
  onAgregar: () => void;
}

export default function BarraAcciones({ categorias, proveedores, onFiltrar, onAgregar }: BarraAccionesProps) {
  const [nombre, setNombre] = useState("");
  const [categoriaId, setCategoriaId] = useState(0);
  const [proveedorId, setProveedorId] = useState(0);

  const handleFiltrar = () => {
    onFiltrar(nombre, categoriaId, proveedorId);
  };

  return (
    <div className={styles.contenedor}>
      <input
        type="text"
        placeholder="Buscar por nombre o descripción"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className={styles.input}
      />

      <select
        value={categoriaId}
        onChange={(e) => setCategoriaId(Number(e.target.value))}
        className={styles.select}
      >
        <option value={0}>Todas las categorías</option>
        {categorias.map(c => (
          <option key={c.id} value={c.id}>{c.nombre}</option>
        ))}
      </select>

      <select
        value={proveedorId}
        onChange={(e) => setProveedorId(Number(e.target.value))}
        className={styles.select}
      >
        <option value={0}>Todos los proveedores</option>
        {proveedores.map(p => (
          <option key={p.id} value={p.id}>{p.nombre}</option>
        ))}
      </select>

      <button className={styles.botonFiltrar} onClick={handleFiltrar}>
        Filtrar
      </button>

      <button className={styles.botonAgregar} onClick={onAgregar}>
        Agregar Producto
      </button>
    </div>
  );
}
