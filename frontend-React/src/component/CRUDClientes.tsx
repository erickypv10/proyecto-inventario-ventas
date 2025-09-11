"use client";

import React, { useState, useEffect } from "react";
import ModalCliente from "./ModalCliente";
import BarraAccionesCliente from "./BarraAccionesCliente";

interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
}

const CRUDCliente: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [clienteEditar, setClienteEditar] = useState<Cliente | null>(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);

  // 🚀 Cargar clientes desde API
  const cargarClientes = async () => {
    try {
      const res = await fetch("https://localhost:7106/api/Clientes");
      if (!res.ok) throw new Error("Error al cargar clientes");
      const data: Cliente[] = await res.json();
      setClientes(data);
      setClientesFiltrados(data);
    } catch (err) {
      console.error("No se pudieron cargar los clientes:", err);
      alert("No se pudieron cargar los clientes desde el backend");
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  // 📌 Filtrar clientes
  const handleFiltrar = (busqueda: string) => {
    if (!busqueda.trim()) {
      setClientesFiltrados(clientes);
      return;
    }
    const filtrados = clientes.filter(
      (c) =>
        c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.telefono.includes(busqueda) ||
        c.direccion.toLowerCase().includes(busqueda.toLowerCase())
    );
    setClientesFiltrados(filtrados);
  };

  // 📌 Guardar cliente
  const handleGuardar = async (cliente: Omit<Cliente, "id">) => {
    try {
      if (clienteEditar) {
        await fetch(`https://localhost:7106/api/Clientes/${clienteEditar.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...clienteEditar, ...cliente }),
        });
      } else {
        await fetch("https://localhost:7106/api/Clientes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cliente),
        });
      }
      setModalAbierto(false);
      setClienteEditar(null);
      cargarClientes();
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al guardar el cliente");
    }
  };

  // 📌 Eliminar cliente
  const eliminarCliente = async (id: number) => {
    if (!confirm("¿Está seguro que desea eliminar este cliente?")) return;
    try {
      const res = await fetch(`https://localhost:7106/api/Clientes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar cliente");
      cargarClientes();
      setClienteSeleccionado(null);
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al eliminar el cliente");
    }
  };

  return (
    <div>
      <BarraAccionesCliente
        onFiltrar={handleFiltrar}
        onAgregar={() => {
          setClienteEditar(null);
          setModalAbierto(true);
        }}
        onEditar={() => {
          if (!clienteSeleccionado) {
            alert("Seleccione un cliente para editar");
            return;
          }
          setClienteEditar(clienteSeleccionado);
          setModalAbierto(true);
        }}
        onEliminar={() => {
          if (!clienteSeleccionado) {
            alert("Seleccione un cliente para eliminar");
            return;
          }
          eliminarCliente(clienteSeleccionado.id);
        }}
      />

      <table className="w-full border border-gray-300 mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-center">Sel</th>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Teléfono</th>
            <th className="border px-4 py-2">Dirección</th>
          </tr>
        </thead>
        <tbody>
          {clientesFiltrados.map((c) => (
            <tr key={c.id}>
              <td className="border px-4 py-2 text-center">
                <input
                  type="radio"
                  name="clienteSeleccionado"
                  checked={clienteSeleccionado?.id === c.id}
                  onChange={() => setClienteSeleccionado(c)}
                />
              </td>
              <td className="border px-4 py-2">{c.nombre}</td>
              <td className="border px-4 py-2">{c.telefono}</td>
              <td className="border px-4 py-2">{c.direccion}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalAbierto && (
        <ModalCliente
          clienteEditar={clienteEditar}
          onClose={() => {
            setModalAbierto(false);
            setClienteEditar(null);
          }}
          onSave={handleGuardar}
        />
      )}
    </div>
  );
};

export default CRUDCliente;
