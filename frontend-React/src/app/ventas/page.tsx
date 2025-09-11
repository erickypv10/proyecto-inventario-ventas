"use client";
import React, { useState, useEffect } from "react";
import Menu from "@/component/Menu";
import CRUDVenta from "../../component/CRUDVenta";

export default function Page() {
  return (
    <div>
      <Menu />
      <CRUDVenta />
    </div>
  );
}
