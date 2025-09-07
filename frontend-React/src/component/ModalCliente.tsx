import React, { useState, useEffect } from "react";
import styles from "../component/ModalCliente.module.css";

interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
}

interface ModalClienteProps {
  clienteEditar: Cliente | null;
  onGuardar: (cliente: Omit<Cliente, "id">) => void;
  onCerrar: () => void;
}

const ModalCliente: React.FC<ModalClienteProps> = ({ clienteEditar, onGuardar, onCerrar }) => {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  useEffect(() => {
    if (clienteEditar) {
      setNombre(clienteEditar.nombre);
      setTelefono(clienteEditar.telefono);
    } else {
      setNombre("");
      setTelefono("");
    }
  }, [clienteEditar]);

  const manejarGuardar = () => {
    if (nombre.trim() === "" || telefono.trim() === "") {
      alert("Todos los campos son obligatorios");
      return;
    }

    onGuardar({ nombre, telefono });
    onCerrar();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContenido}>
        <h2>{clienteEditar ? "Editar Cliente" : "Agregar Cliente"}</h2>
        <div className={styles.formGroup}>
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingrese el nombre"
          />
        </div>
        <div className={styles.formGroup}>
          <label>Teléfono</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ingrese el teléfono"
          />
        </div>
        <div className={styles.modalAcciones}>
          <button className={styles.btnCancelar} onClick={onCerrar}>Cancelar</button>
          <button className={styles.btnGuardar} onClick={manejarGuardar}>
            {clienteEditar ? "Guardar Cambios" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCliente;
