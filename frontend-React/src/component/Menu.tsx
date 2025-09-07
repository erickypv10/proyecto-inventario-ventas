"use client";
import React from "react";
import styles from "./Menu.module.css";

export default function Menu() {
  return (
    <header className={styles.header}>
      <div className={styles.appName}>InventarioVentas</div>
      <nav className={styles.nav}>
        <a href="/productos" className={styles.link}>Productos</a>
        <a href="/proveedores" className={styles.link}>Proveedores</a>
        <a href="/categorias" className={styles.link}>Categorías</a>
        <a href="/ventas" className={styles.link}>Ventas</a>
        <a href="/clientes" className={styles.link}>Clientes</a>
        <a href="/dashboard" className={styles.link}>Dashboard</a>
      </nav>
    </header>
  );
}
