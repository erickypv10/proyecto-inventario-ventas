import { useState, useEffect } from "react";

export default function ModalEditarProducto({ producto, onCerrar, onActualizar }) {
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    stock: "",
  });

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre || "",
        precio: producto.precio || "",
        stock: producto.stock || "",
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:5000/api/productos/${producto.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const actualizado = await response.json();
      onActualizar(actualizado);
      onCerrar(); // 👈 cerrar modal después de actualizar
    } else {
      alert("Error al actualizar producto");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            value={formData.nombre ?? ""}
            onChange={handleChange}
            placeholder="Nombre"
            className="border p-2 w-full mb-3"
          />
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            placeholder="Precio"
            className="border p-2 w-full mb-3"
          />
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="border p-2 w-full mb-3"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCerrar} // 👈 aquí se usa
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

