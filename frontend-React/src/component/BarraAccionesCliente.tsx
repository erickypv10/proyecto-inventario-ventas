"use client";
import { useState } from "react";
import styles from "./BarraAccionesCliente.module.css";

interface BarraAccionesClienteProps {
  onFiltrar: (busqueda: string) => void;
  onAgregar: () => void;
  onEditar: () => void;
  onEliminar: () => void;
}

export default function BarraAccionesCliente({
  onFiltrar,
  onAgregar,
  onEditar,
  onEliminar,
}: BarraAccionesClienteProps) {
  const [busqueda, setBusqueda] = useState("");

  const handleFiltrar = () => {
    onFiltrar(busqueda);
  };

  return (
    <div className={styles.contenedor}>
      {/* 🔍 Búsqueda */}
      <input
        type="text"
        placeholder="Buscar por nombre, teléfono o dirección"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className={styles.input}
      />

      <button className={styles.botonFiltrar} onClick={handleFiltrar}>
        Filtrar
      </button>

      {/* ➕ Botones de acciones */}
      <button className={styles.botonAgregar} onClick={onAgregar}>
        Agregar Cliente
      </button>
      <button className={styles.botonEditar} onClick={onEditar}>
        Editar Cliente
      </button>
      <button className={styles.botonEliminar} onClick={onEliminar}>
        Eliminar Cliente
      </button>
    </div>
  );
}
