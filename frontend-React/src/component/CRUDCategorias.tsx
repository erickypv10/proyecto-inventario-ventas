"use client";
import styles from "./Categoria.module.css";

interface Categoria {
  id?: number;
  nombre: string;
}

interface CRUDCategoriasProps {
  categorias: Categoria[];
  onEditar: (categoria: Categoria) => void;
  onEliminar: (categoria: Categoria) => void;
}

export default function CRUDCategorias({ categorias, onEditar, onEliminar }: CRUDCategoriasProps) {
  return (
    <table className={styles.tabla}>
      <thead>
        <tr>
          <th className={styles.celdaID}>ID</th>
          <th className={styles.celdaNombre}>Nombre</th>
          <th className={styles.celdaAcciones}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {categorias.length === 0 ? (
          <tr>
            <td className={styles.celda} colSpan={3}>No hay categorías</td>
          </tr>
        ) : (
          categorias.map((cat) => (
            <tr key={cat.id}>
              <td className={styles.celdaID}>{cat.id}</td>
              <td className={styles.celdaNombre}>{cat.nombre}</td>
              <td className={styles.celdaAcciones}>
                <button className={styles.boton} onClick={() => onEditar(cat)}>
                  ✏️ Editar
                </button>
                <button
                  className={styles.botonSecundario}
                  onClick={() => onEliminar(cat)}
                  style={{ marginLeft: "8px" }}
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
    
  );
}
