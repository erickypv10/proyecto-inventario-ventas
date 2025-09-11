"use client";
import { useState, useEffect } from "react";
import Menu from "../../component/Menu";
import CRUDCategorias from "../../component/CRUDCategorias";
import ModalCategoria from "../../component/ModalCategoria";
import styles from "../../component/Categoria.module.css";

interface Categoria {
  id?: number;
  nombre: string;
}

export default function Page() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState<Categoria | null>(null);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [categoriasPorPagina, setCategoriasPorPagina] = useState(10);

  const fetchCategorias = async () => {
    try {
      const res = await fetch("https://localhost:7106/api/Categoria");
      const data: Categoria[] = await res.json();
      setCategorias(data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleGuardarCategoria = async (categoria: Categoria) => {
    try {
      if (categoria.id) {
        await fetch(`https://localhost:7106/api/Categoria/${categoria.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoria),
        });
      } else {
        await fetch("https://localhost:7106/api/Categoria", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoria),
        });
      }
      fetchCategorias();
      setCategoriaEditar(null);
      setModalAbierto(false);
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar la categoría");
    }
  };
  const handleEliminarCategoria = async (categoria: Categoria) => {
  if (!categoria.id) return;
  if (!confirm(`¿Seguro que deseas eliminar la categoría "${categoria.nombre}"?`)) return;

  try {
    await fetch(`https://localhost:7106/api/Categoria/${categoria.id}`, {
      method: "DELETE",
    });
    fetchCategorias(); // refrescar lista
  } catch (error) {
    console.error(error);
    alert("No se pudo eliminar la categoría");
  }
};


  // Paginación
  const indexLast = paginaActual * categoriasPorPagina;
  const indexFirst = indexLast - categoriasPorPagina;
  const categoriasPagina = categorias.slice(indexFirst, indexLast);
  const totalPaginas = Math.ceil(categorias.length / categoriasPorPagina);

  return (
    <div>
      <Menu />

      {/* Barra de acciones ocupando todo el ancho */}
      <div className={styles.barraAcciones}>
        <button
          className={styles.botonAgregar}
          onClick={() => { setCategoriaEditar(null); setModalAbierto(true); }}
        >
          Agregar Categoría
        </button>
      </div>

      {/* Contenedor de la tabla */}
      <div className={styles.contenedor}>
        <CRUDCategorias
          categorias={categoriasPagina}
          onEditar={(cat) => { setCategoriaEditar(cat); setModalAbierto(true); }}
          onEliminar={handleEliminarCategoria}
        />

        {/* Paginación */}
        <div style={{ display: "flex", justifyContent: "center", gap: "5px", marginTop: "20px" }}>
          <button
            className={styles.botonSecundario}
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual(paginaActual - 1)}
          >
            Anterior
          </button>
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i}
              className={styles.botonSecundario}
              onClick={() => setPaginaActual(i + 1)}
              style={{ fontWeight: paginaActual === i + 1 ? "bold" : "normal" }}
            >
              {i + 1}
            </button>
          ))}
          <button
            className={styles.botonSecundario}
            disabled={paginaActual === totalPaginas}
            onClick={() => setPaginaActual(paginaActual + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal */}
      <ModalCategoria
        abierto={modalAbierto}
        categoria={categoriaEditar}
        onCerrar={() => setModalAbierto(false)}
        onGuardar={handleGuardarCategoria}
      />
    </div>
  );
}
