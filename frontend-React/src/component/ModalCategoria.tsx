"use client";
import { useState, useEffect } from "react";
import styles from "./Categoria.module.css";

interface Categoria {
  id?: number; // opcional porque al agregar no tiene ID
  nombre: string;
}

interface ModalCategoriaProps {
  abierto: boolean;
  categoria: Categoria | null;
  onCerrar: () => void;
  onGuardar: (categoria: Categoria) => void;
}

export default function ModalCategoria({ abierto, categoria, onCerrar, onGuardar }: ModalCategoriaProps) {
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    if (categoria) {
      setNombre(categoria.nombre);
    } else {
      setNombre("");
    }
  }, [categoria]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    const categoriaAGuardar: Categoria = {
      id: categoria?.id,
      nombre: nombre.trim(),
    };
    onGuardar(categoriaAGuardar);
    onCerrar();
  };

  if (!abierto) return null;

  return (
    <div className={styles.modalFondo}>
      <div className={styles.modalContenido}>
        <h2>{categoria ? "Editar Categoría" : "Agregar Categoría"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre de la categoría"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={styles.formularioInput}
          />
          <div className={styles.modalBotones}>
            <button type="button" onClick={onCerrar} className={styles.botonSecundario}>
              Cancelar
            </button>
            <button type="submit" className={styles.boton}>
              {categoria ? "Actualizar" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
