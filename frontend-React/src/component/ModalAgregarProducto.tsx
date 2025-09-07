"use client";
import { useState } from "react";
import styles from "./ModalAgregarProducto.module.css";

interface Categoria { id: number; nombre: string; }
interface Proveedor { id: number; nombre: string; }

interface ModalAgregarProductoProps {
  abierto: boolean;
  categorias: Categoria[];
  proveedores: Proveedor[];
  onCerrar: () => void;
  onAgregar: (producto: any) => void;
}

export default function ModalAgregarProducto({
  abierto,
  categorias,
  proveedores,
  onCerrar,
  onAgregar
}: ModalAgregarProductoProps) {
  const [nuevoProducto, setNuevoProducto] = useState({
    name: "",
    description: "",
    price: 0,
    categoriaId: 0,
    proveedorId: 0,
  });

  if (!abierto) return null;

  const handleSubmit = () => {
    if (!nuevoProducto.name || !nuevoProducto.categoriaId || !nuevoProducto.proveedorId) {
      alert("Complete todos los campos");
      return;
    }
    onAgregar(nuevoProducto);
    setNuevoProducto({ name: "", description: "", price: 0, categoriaId: 0, proveedorId: 0 });
  };

  return (
    <div className={styles.modalFondo}>
      <div className={styles.modalContenido}>
        <h2>Agregar Producto</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={nuevoProducto.name}
          onChange={e => setNuevoProducto({ ...nuevoProducto, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={nuevoProducto.description}
          onChange={e => setNuevoProducto({ ...nuevoProducto, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Precio"
          value={nuevoProducto.price === 0 ? "" : nuevoProducto.price}
          onChange={e => setNuevoProducto({ ...nuevoProducto, price: e.target.value === "" ? 0 : Number(e.target.value)})}
        />
        <select
          value={nuevoProducto.categoriaId}
          onChange={e => setNuevoProducto({ ...nuevoProducto, categoriaId: Number(e.target.value) })}
        >
          <option value={0}>Seleccionar categoría</option>
          {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
        <select
          value={nuevoProducto.proveedorId}
          onChange={e => setNuevoProducto({ ...nuevoProducto, proveedorId: Number(e.target.value) })}
        >
          <option value={0}>Seleccionar proveedor</option>
          {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>
        <div className={styles.modalBotones}>
          <button onClick={handleSubmit}>Agregar</button>
          <button onClick={onCerrar}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
