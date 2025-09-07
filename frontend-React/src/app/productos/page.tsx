"use client";
import { useState, useEffect } from "react";
import Menu from "../../component/Menu";
import BarraAcciones from "@/component/BarraAcciones";
import CRUDProductos from "../../component/CRUDProductos";
import ModalAgregarProducto from "../../component/ModalAgregarProducto";
import ModalEditarProducto from "../../component/ModalEditarProducto";

interface Producto {
  id: number;
  name: string;
  description: string;
  price: number;
  categoriaId: number;
  categoriaNombre: string;
  proveedorId: number;
  proveedorNombre: string;
}

interface Categoria { id: number; nombre: string; }
interface Proveedor { id: number; nombre: string; }

export default function Page() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [cargando, setCargando] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);

   // 📌 estados de paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [productosPorPagina, setProductosPorPagina] = useState(10);   

  const fetchProductos = async () => {
    setCargando(true);
    try {
      const res = await fetch("https://localhost:7106/api/Producto");
      const data: Producto[] = await res.json();
      setProductos(data);
      setProductosFiltrados(data); // mostrar todo al inicio
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const fetchCategoriasYProveedores = async () => {
    try {
      const catRes = await fetch("https://localhost:7106/api/Categoria");
      setCategorias(await catRes.json());
      const provRes = await fetch("https://localhost:7106/api/Proveedor");
      setProveedores(await provRes.json());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProductos();
    fetchCategoriasYProveedores();
  }, []);

  const handleCrearProducto = async (nuevoProducto: any) => {
    try {
      const res = await fetch("https://localhost:7106/api/Producto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto),
      });
      if (!res.ok) throw new Error("Error al crear el producto");
      fetchProductos();
      setModalAbierto(false); // cerrar modal después de agregar
    } catch (error) {
      console.error(error);
      alert("No se pudo crear el producto");
    }
  };

  const handleFiltrar = (nombre: string, categoriaId: number, proveedorId: number) => {
    let filtrados = [...productos]; // usar SIEMPRE la lista completa
    if (nombre) filtrados = filtrados.filter(p =>
      p.name.toLowerCase().includes(nombre.toLowerCase()) ||
      p.description.toLowerCase().includes(nombre.toLowerCase())
    );
    if (categoriaId) filtrados = filtrados.filter(p => p.categoriaId === categoriaId);
    if (proveedorId) filtrados = filtrados.filter(p => p.proveedorId === proveedorId);
    setProductosFiltrados(filtrados);
    setPaginaActual(1);// resetear a la primera página después de filtrar
  };

  // 📌 lógica de paginación
  const indexOfLast = paginaActual * productosPorPagina;
  const indexOfFirst = indexOfLast - productosPorPagina;
  const productosPagina = productosFiltrados.slice(indexOfFirst, indexOfLast);
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  return (
    <div>
      <Menu />
      <BarraAcciones
        categorias={categorias}
        proveedores={proveedores}
        onFiltrar={handleFiltrar}
        onAgregar={() => setModalAbierto(true)} // abrir modal
      />
      <CRUDProductos
        productos={productosFiltrados} // 👈 mostrar filtrados
        cargando={cargando}
        onRefrescar={fetchProductos}
        
      />
       {/* 📌 Paginación */}
      <div style={{ display: "flex", justifyContent: "center", margin: "20px 0", gap: "10px" }}>
        <button
          disabled={paginaActual === 1}
          onClick={() => setPaginaActual(paginaActual - 1)}
        >
          Anterior
        </button>

        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPaginaActual(i + 1)}
            style={{ fontWeight: paginaActual === i + 1 ? "bold" : "normal" }}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={paginaActual === totalPaginas}
          onClick={() => setPaginaActual(paginaActual + 1)}
        >
          Siguiente
        </button>
      </div>

      {/* 📌 Selector de productos por página */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <label>Mostrar: </label>
        <select
          value={productosPorPagina}
          onChange={(e) => {
            setProductosPorPagina(Number(e.target.value));
            setPaginaActual(1); // resetear a primera página
          }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
      <ModalAgregarProducto
        abierto={modalAbierto}
        categorias={categorias}
        proveedores={proveedores}
        onCerrar={() => setModalAbierto(false)}
        onAgregar={handleCrearProducto}
      />
    </div>
  );
}
