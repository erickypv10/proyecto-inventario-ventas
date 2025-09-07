"use client";
import { useState } from "react";
import styles from "./Proveedores.module.css";
import ModalAgregarEditarProveedor from "./ModalAgregarEditarProveedor";

interface Proveedor {
  id: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
}

interface CRUDProveedoresProps {
  proveedores?: Proveedor[];
  cargando: boolean;
  onRefrescar: () => void;
}

export default function CRUDProveedores({ proveedores = [], cargando, onRefrescar }: CRUDProveedoresProps) {
  const [proveedorEditar, setProveedorEditar] = useState<Proveedor | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [porPagina, setPorPagina] = useState(10);

  const totalPaginas = Math.ceil(proveedores.length / porPagina);
  const proveedoresPagina = proveedores.slice(
    (paginaActual - 1) * porPagina,
    paginaActual * porPagina
  );

  const handleSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };
  const handleAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  const handleActualizar = () => {
    onRefrescar();
    setProveedorEditar(null);
    setModalAbierto(false);
  };

  return (
    <div className={styles.contenedor}>
      <div className={styles.acciones}>
        <button className={styles.boton} onClick={() => { setProveedorEditar(null); setModalAbierto(true); }}>
          Agregar Proveedor
        </button>
      </div>

      <table className={styles.tabla}>
        <thead>
          <tr>
            <th className={styles.celda}>ID</th>
            <th className={styles.celda}>Nombre</th>
            <th className={styles.celda}>Dirección</th>
            <th className={styles.celda}>Teléfono</th>
            <th className={styles.celda}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedoresPagina.length === 0 ? (
            <tr>
              <td className={styles.celda} colSpan={5}>No hay proveedores</td>
            </tr>
          ) : (
            proveedoresPagina.map((prov) => (
              <tr key={prov.id}>
                <td className={styles.celda}>{prov.id}</td>
                <td className={styles.celda}>{prov.nombre}</td>
                <td className={styles.celda}>{prov.direccion}</td>
                <td className={styles.celda}>{prov.telefono}</td>
                <td className={styles.celda}>
                  <button className={styles.botonSecundario} onClick={() => { setProveedorEditar(prov); setModalAbierto(true); }}>
                    Editar
                  </button>
                  <button
                    className={styles.botonSecundario}
                    onClick={async () => {
                      if (!confirm("¿Seguro quieres eliminar este proveedor?")) return;
                      try {
                        const res = await fetch(`https://localhost:7106/api/Proveedor/${prov.id}`, { method: "DELETE" });
                        if (!res.ok) throw new Error("Error al eliminar");
                        onRefrescar();
                      } catch (error) {
                        console.error(error);
                        alert("No se pudo eliminar");
                      }
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Paginación */}
      <div className={styles.paginacion}>
        <button onClick={handleAnterior} disabled={paginaActual === 1}>Anterior</button>
        <span>Página {paginaActual} de {totalPaginas}</span>
        <button onClick={handleSiguiente} disabled={paginaActual === totalPaginas}>Siguiente</button>
        <select value={porPagina} onChange={(e) => setPorPagina(Number(e.target.value))}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Modal Agregar / Editar */}
      {modalAbierto && (
        <ModalAgregarEditarProveedor
          proveedor={proveedorEditar}
          onCerrar={() => setModalAbierto(false)}
          onActualizar={handleActualizar}
        />
      )}
    </div>
  );
}
