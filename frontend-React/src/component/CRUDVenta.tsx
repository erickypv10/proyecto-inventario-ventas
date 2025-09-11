"use client";
import React, { useEffect, useState } from "react";
import ModalVenta from "./ModalVenta";
import BarraAccionesVentas from "./BarraAccionesVentas";
import styles from "./ventas.module.css";

interface Venta {
  id: number;
  clienteId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  total: number;
  metodoPago: string;
  fechaVenta: string;
}

type VentaInput = Omit<Venta, "id" | "total" | "fechaVenta">;

interface Cliente { id: number; nombre: string; }
interface Producto { id: number; name: string; price?: number; }

export default function CRUDVenta() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [ventasFiltradas, setVentasFiltradas] = useState<Venta[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [ventaEditar, setVentaEditar] = useState<Venta | null>(null);

  // Helper para cargar solo ventas (se usa después de crear/editar/borrar)
  const fetchVentas = async () => {
    try {
      const resVentas = await fetch("https://localhost:7106/api/Ventas");
      if (!resVentas.ok) {
        console.error("Error al obtener ventas:", await resVentas.text());
        return;
      }
      const ventasData: Venta[] = await resVentas.json();
      setVentas(ventasData);
      setVentasFiltradas(ventasData);
    } catch (err) {
      console.error("Error cargando ventas:", err);
    }
  };

  // Cargar clientes y productos (y ventas)
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // ventas
        await fetchVentas();

        // clientes
        const resClientes = await fetch("https://localhost:7106/api/Clientes");
        if (!resClientes.ok) {
          console.error("Error cargando clientes:", await resClientes.text());
        } else {
          const clientesData: Cliente[] = await resClientes.json();
          setClientes(clientesData);
        }

        // productos
        const resProductos = await fetch("https://localhost:7106/api/Producto");
        if (!resProductos.ok) {
          console.error("Error cargando productos:", await resProductos.text());
        } else {
          const productosData: Producto[] = await resProductos.json();
          setProductos(productosData);
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };

    cargarDatos();
  }, []);

  const handleFiltrar = (busqueda: string, clienteId: number, productoId: number) => {
    let filtradas = [...ventas];

    if (busqueda.trim() !== "") {
      filtradas = filtradas.filter((v) => {
        const cliente = clientes.find(c => c.id === v.clienteId)?.nombre.toLowerCase() || "";
        const producto = productos.find(p => p.id === v.productoId)?.name.toLowerCase() || "";
        return cliente.includes(busqueda.toLowerCase()) || producto.includes(busqueda.toLowerCase());
      });
    }

    if (clienteId) filtradas = filtradas.filter(v => v.clienteId === clienteId);
    if (productoId) filtradas = filtradas.filter(v => v.productoId === productoId);

    setVentasFiltradas(filtradas);
  };

  // Guardar venta: recibe lo que envía ModalVenta (sin id, sin total, sin fechaVenta)
  const guardarVenta = async (ventaInput: VentaInput) => {
    try {
      // construir el payload que tu API espera (sin id en el body)
      const payload = {
        clienteId: ventaInput.clienteId,
        productoId: ventaInput.productoId,
        cantidad: ventaInput.cantidad,
        precioUnitario: ventaInput.precioUnitario,
        total: ventaInput.cantidad * ventaInput.precioUnitario,
        metodoPago: ventaInput.metodoPago,
        fechaVenta: new Date().toISOString(),
      };

      if (ventaEditar) {
        // editar -> PUT a /api/Ventas/{id} con body SIN id
        const res = await fetch(`https://localhost:7106/api/Ventas/${ventaEditar.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          console.error("Respuesta backend (PUT):", await res.text());
          throw new Error("Error actualizando venta");
        }
        // refrescar lista desde backend
        await fetchVentas();
      } else {
        // crear -> POST a /api/Ventas con body SIN id
        const res = await fetch("https://localhost:7106/api/Ventas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          console.error("Respuesta backend (POST):", await res.text());
          throw new Error("Error creando venta");
        }
        // refrescar lista desde backend
        await fetchVentas();
      }
      const resProductos = await fetch("https://localhost:7106/api/Producto");
      setProductos(await resProductos.json());

      cerrarModal();
    } catch (err) {
      console.error("Error en guardarVenta:", err);
      alert("Hubo un error guardando la venta (mira la consola para más detalles).");
    }
  };

  const eliminarVenta = async (id: number) => {
    if (!confirm("¿Está seguro que desea eliminar esta venta?")) return;
    try {
      const res = await fetch(`https://localhost:7106/api/Ventas/${id}`, { method: "DELETE" });
      if (!res.ok) {
        console.error("Error eliminando venta:", await res.text());
        throw new Error("Error eliminando venta");
      }
      // refrescar ventas
      await fetchVentas();
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la venta (ver consola).");
    }
  };

  const abrirModal = (venta?: Venta) => {
    setVentaEditar(venta || null);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setVentaEditar(null);
    setModalAbierto(false);
  };

  const obtenerNombreCliente = (id: number) => clientes.find(c => c.id === id)?.nombre || "";
  const obtenerNombreProducto = (id: number) => productos.find(p => p.id === id)?.name || "";

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>Gestión de Ventas</h2>

      <BarraAccionesVentas
        clientes={clientes}
        productos={productos}
        onFiltrar={handleFiltrar}
        onAgregar={() => abrirModal()}
      />

      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total</th>
            <th>Método Pago</th>
            <th>Fecha</th>
            <th className={styles.colAcciones}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventasFiltradas.map(v => (
            <tr key={v.id}>
              <td>{obtenerNombreCliente(v.clienteId)}</td>
              <td>{obtenerNombreProducto(v.productoId)}</td>
              <td>{v.cantidad}</td>
              <td>{v.precioUnitario}</td>
              <td>{v.total}</td>
              <td>{v.metodoPago}</td>
              <td>{new Date(v.fechaVenta).toLocaleDateString()}</td>
              <td className={styles.colAcciones}>
                <button className={styles.botonEditar} onClick={() => abrirModal(v)}>Editar</button>
                <button className={styles.botonEliminar} onClick={() => eliminarVenta(v.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalAbierto && (
        <ModalVenta
          ventaEditar={ventaEditar}
          onGuardar={guardarVenta}
          onCerrar={cerrarModal}
        />
      )}
    </div>
  );
}
