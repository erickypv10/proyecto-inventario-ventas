"use client";
import React, { useState } from "react";
import styles from "../../component/cliente.module.css";
import ModalCliente from "../../component/ModalCliente";

interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
}

export default function Page() {
  const [clientes, setClientes] = useState<Cliente[]>([
    { id: 1, nombre: "Juan Pérez", telefono: "555-1234" },
    { id: 2, nombre: "Ana Gómez", telefono: "555-5678" },
  ]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [clienteEditar, setClienteEditar] = useState<Cliente | null>(null);

  // Abrir modal
  const abrirModal = (cliente?: Cliente) => {
    setClienteEditar(cliente || null);
    setModalAbierto(true);
  };

  // Guardar cliente (agregar o editar)
  const handleGuardar = (cliente: Omit<Cliente, "id">) => {
    if (clienteEditar) {
      // Editar
      setClientes(
        clientes.map((c) =>
          c.id === clienteEditar.id ? { ...clienteEditar, ...cliente } : c
        )
      );
    } else {
      // Agregar
      setClientes([
        ...clientes,
        { id: clientes.length + 1, ...cliente },
      ]);
    }
  };

  // Eliminar cliente
  const eliminarCliente = (id: number) => {
    setClientes(clientes.filter((c) => c.id !== id));
  };

  return (
    <div className={styles.contenedor}>
      <h1 className={styles.titulo}>Gestión de Clientes</h1>

      {/* Barra de acciones */}
      <div className={styles.barraAcciones}>
        <button
          className={styles.botonAgregar}
          onClick={() => abrirModal()}
        >
          Agregar Cliente
        </button>
      </div>

      {/* Tabla */}
      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th className={styles.colAcciones}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.nombre}</td>
              <td>{cliente.telefono}</td>
              <td className={styles.colAcciones}>
                <button
                  className={styles.botonEditar}
                  onClick={() => abrirModal(cliente)}
                >
                  Editar
                </button>
                <button
                  className={styles.botonEliminar}
                  onClick={() => eliminarCliente(cliente.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modalAbierto && (
        <ModalCliente
          clienteEditar={clienteEditar}
          onGuardar={handleGuardar}
          onCerrar={() => setModalAbierto(false)}
        />
      )}
    </div>
  );
}
