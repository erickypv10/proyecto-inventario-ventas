"use client";

import React, { useState, useEffect } from "react";

interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
}

interface ModalClienteProps {
  clienteEditar: Cliente | null;
  onClose: () => void;
  onSave: (cliente: Omit<Cliente, "id">) => void;
}

const ModalCliente: React.FC<ModalClienteProps> = ({ clienteEditar, onClose, onSave }) => {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  // Si está editando, cargar datos en el formulario
  useEffect(() => {
    if (clienteEditar) {
      setNombre(clienteEditar.nombre);
      setTelefono(clienteEditar.telefono);
      setDireccion(clienteEditar.direccion);
    }
  }, [clienteEditar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ nombre, telefono, direccion });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {clienteEditar ? "Editar Cliente" : "Nuevo Cliente"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="border px-3 py-2 rounded"
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCliente;

