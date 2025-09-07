"use client";
import { useState } from "react";
import styles from "./Productos.module.css";
import ModalEditarProducto from "./ModalEditarProducto";

interface Producto {
  id: number;
  name: string;
  description: string;
  price: number;
  categoriaNombre: string;
  proveedorNombre: string;
  // (si tienes categoriaId/proveedorId en la tabla, puedes añadirlos aquí también)
}

interface CRUDProductosProps {
  productos?: Producto[];
  cargando: boolean;
  onRefrescar: () => void;
  
}

export default function CRUDProductos({
  productos = [],
  cargando,
  onRefrescar,
 
}: CRUDProductosProps) {
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);

  const handleActualizar = () => {
    // Refresca desde la API después de actualizar
    onRefrescar();
  };

  return (
    <div className={styles.contenedor}>
      <table className={styles.tabla}>
        <thead>
          <tr>
            <th className={styles.celda}>ID</th>
            <th className={styles.celda}>Nombre</th>
            <th className={styles.celda}>Descripción</th>
            <th className={styles.celda}>Precio</th>
            <th className={styles.celda}>Categoría</th>
            <th className={styles.celda}>Proveedor</th>
            <th className={styles.celda}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length === 0 ? (
            <tr>
              <td className={styles.celda} colSpan={7}>
                No hay productos
              </td>
            </tr>
          ) : (
            productos.map((prod) => (
              <tr key={prod.id}>
                <td className={styles.celda}>{prod.id}</td>
                <td className={styles.celda}>{prod.name}</td>
                <td className={styles.celda}>{prod.description}</td>
                <td className={styles.celda}>${prod.price}</td>
                <td className={styles.celda}>{prod.categoriaNombre}</td>
                <td className={styles.celda}>{prod.proveedorNombre}</td>
                <td className={styles.celda}>
                  <button
                    onClick={() => setProductoEditar(prod)}
                    className={styles.boton}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div>
        <button className={styles.boton} onClick={onRefrescar}>
          {cargando ? "Cargando..." : "Mostrar Productos"}
        </button>
       
      </div>

      {productoEditar && (
        <ModalEditarProducto
          producto={productoEditar}
          onCerrar={() => setProductoEditar(null)}
          onActualizar={handleActualizar}
        />
      )}
    </div>
  );
}
