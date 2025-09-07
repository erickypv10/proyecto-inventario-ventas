// src/services/api.ts
export async function getProductos() {
  const res = await fetch("https://localhost:7106/api/Producto", { cache: "no-store" });
  if (!res.ok) throw new Error("Error al cargar productos");
  return res.json();
}

export async function createProducto(data: any) {
  const res = await fetch("https://localhost:5001/api/productos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear producto");
  return res.json();
}

// Opcional: updateProducto, deleteProducto...
