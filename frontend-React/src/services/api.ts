// src/services/api.ts
export interface Producto {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoriaId?: number;
  proveedorId?: number;
}

// Obtener todos los productos
export async function getProductos(): Promise<Producto[]> {
  const res = await fetch("https://localhost:7106/api/Producto", { cache: "no-store" });
  if (!res.ok) throw new Error("Error al cargar productos");
  return res.json() as Promise<Producto[]>;
}

// Crear un nuevo producto
export async function createProducto(data: Omit<Producto, "id">): Promise<Producto> {
  const res = await fetch("https://localhost:7106/api/Producto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear producto");
  return res.json() as Promise<Producto>;
}

// Actualizar un producto existente
export async function updateProducto(id: number, data: Omit<Producto, "id">): Promise<Producto> {
  const res = await fetch(`https://localhost:7106/api/Producto/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar producto");
  return res.json() as Promise<Producto>;
}

// Eliminar un producto
export async function deleteProducto(id: number): Promise<void> {
  const res = await fetch(`https://localhost:7106/api/Producto/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar producto");
}
