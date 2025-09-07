"use client";
import { useState, useEffect } from "react";
import Menu from "../../component/Menu";
import CRUDProveedores from "../../component/CRUDProveedores";

interface Proveedor {
  id: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
}

export default function Page() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [cargando, setCargando] = useState(false);

  const fetchProveedores = async () => {
    setCargando(true);
    try {
      const res = await fetch("https://localhost:7106/api/Proveedor");
      if (!res.ok) throw new Error("Error al obtener proveedores");
      const data: Proveedor[] = await res.json();
      setProveedores(data);
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar los proveedores");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  return (
    <div>
      <Menu />
      <CRUDProveedores
        proveedores={proveedores}
        cargando={cargando}
        onRefrescar={fetchProveedores}
      />
    </div>
  );
}
