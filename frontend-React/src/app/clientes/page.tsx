"use client";

import React from "react";
import CRUDCliente from "../../component/CRUDClientes";
import Menu from "@/component/Menu";

const ClientePage: React.FC = () => {
  return (
    <div>
    <Menu />
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Clientes</h1>
      <CRUDCliente />
    </div>
    </div>
  );
};

export default ClientePage;
