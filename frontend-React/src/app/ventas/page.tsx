"use client";
import React, { useState, useEffect } from "react";
import CRUDVenta from "../../component/CRUDVenta";

export default function Page() {
  return (
    <div>
      <h1>Ventas</h1>
      <CRUDVenta />
    </div>
  );
}
