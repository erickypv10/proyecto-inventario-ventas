"use client";

import React, { useState, useEffect } from "react";
import styles from "./cliente.module.css";

interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
}

const CRUDCliente: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [clienteEditar, setClienteEditar] = useState<Cliente | null>(null);
  const [nuevoCliente, setNuevoCliente] = useState<Cliente>({
    id: 0,
    nombre: "",
    telefono: "",
  });

  // Carga inicial de clientes desde backend
  useEffect(() => {
    fetch("/api/Clientes")
      .then((res) => res.json())
      .then((data) => setClientes(data))
      .catch(() => alert("Error al cargar clientes desde backend"));
  }, []);

  const abrirModal = (cliente?: Cliente) => {
    if (cliente) {
      setClienteEditar(cliente);
      setNuevoCliente(cliente);
    } else {
      setClienteEditar(null);
      setNuevoCliente({ id: 0, nombre: "", telefono: "" });
    }
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setClienteEditar(null);
  };

  const guardarCliente = () => {
    if (!nuevoCliente.nombre.trim() || !nuevoCliente.telefono.trim()) {
      alert("Nombre y teléfono son obligatorios");
      return;
    }

    if (clienteEditar) {
      // Actualiza cliente
      fetch(`/api/Clientes/${clienteEditar.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoCliente),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error al actualizar cliente");
          return res.json();
        })
        .then((clienteActualizado) => {
          setClientes(
            clientes.map((c) =>
              c.id === clienteActualizado.id ? clienteActualizado : c
            )
          );
          cerrarModal();
        })
        .catch((err) => alert(err.message));
    } else {
      // Crea cliente nuevo
      fetch("/api/Clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoCliente),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error al crear cliente");
          return res.json();
        })
        .then((clienteCreado) => {
          setClientes([...clientes, clienteCreado]);
          cerrarModal();
        })
        .catch((err) => alert(err.message));
    }
  };

  const eliminarCliente = (id: number) => {
    if (!confirm("¿Está seguro que desea eliminar este cliente?")) return;
    fetch(`/api/Clientes/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar cliente");
        setClientes(clientes.filter((c) => c.id !== id));
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className={styles.contenedor}>
      <div className={styles.barraAcciones}>
        <button className={styles.botonAgregar} onClick={() => abrirModal()}>
          Agregar Cliente
        </button>
      </div>

      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.nombre}</td>
              <td>{cliente.telefono}</td>
              <td>
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

      {modalAbierto && (
        <div className={styles.modal}>
          <div className={styles.modalContenido}>
            <h2>{clienteEditar ? "Editar Cliente" : "Agregar Cliente"}</h2>
            <input
              type="text"
              placeholder="Nombre"
              value={nuevoCliente.nombre}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={nuevoCliente.telefono}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })
              }
            />
            <div className={styles.modalAcciones}>
              <button onClick={guardarCliente}>Guardar</button>
              <button onClick={cerrarModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRUDCliente;
