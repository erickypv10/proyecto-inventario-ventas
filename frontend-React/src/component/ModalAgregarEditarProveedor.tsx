"use client";
import { useState, useEffect } from "react";
import styles from "./Proveedores.module.css";

interface Categoria {
  id: number;
  nombre: string;
}

interface Proveedor {
  id?: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  idCategoria?: number; // 👈 necesario para el backend
}

interface ModalProps {
  proveedor: Proveedor | null;
  onCerrar: () => void;
  onActualizar: () => void;
}

export default function ModalAgregarEditarProveedor({
  proveedor,
  onCerrar,
  onActualizar,
}: ModalProps) {
  const [formData, setFormData] = useState<Proveedor>({
    nombre: "",
    direccion: "",
    telefono: "",
    idCategoria: undefined,
  });

  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Cargar categorías desde la API
  useEffect(() => {
    fetch("https://localhost:7106/api/Categoria")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error cargando categorías:", err));
  }, []);

  useEffect(() => {
    if (proveedor) setFormData(proveedor);
  }, [proveedor]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "idCategoria" ? (value ? parseInt(value) : undefined) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const url = proveedor?.id
      ? `https://localhost:7106/api/Proveedor/${proveedor.id}`
      : "https://localhost:7106/api/Proveedor";
    const method = proveedor?.id ? "PUT" : "POST";

    // Transformar formData al formato que espera la API
    const payload = {
      nombre: formData.nombre,
      telefono: formData.telefono,
      direccion: formData.direccion,
      categoriaIds: formData.idCategoria ? [formData.idCategoria] : [],
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Error al guardar");

    onActualizar();
    onCerrar();
  } catch (error) {
    console.error(error);
    alert("No se pudo guardar el proveedor");
  }
};


  return (
    <div className={styles.modalFondo}>
      <div className={styles.modalContenido}>
        <h2>{proveedor ? "Editar Proveedor" : "Agregar Proveedor"}</h2>
        <form onSubmit={handleSubmit} className={styles.formulario}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={formData.direccion || ""}
            onChange={handleChange}
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={formData.telefono || ""}
            onChange={handleChange}
          />

          {/* 👇 Nuevo campo: selector de categoría */}
          <select
            name="idCategoria"
            value={formData.idCategoria ?? ""}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>

          <div className={styles.modalBotones}>
            <button
              type="button"
              onClick={onCerrar}
              className={styles.botonSecundario}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.boton}>
              {proveedor ? "Actualizar" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
