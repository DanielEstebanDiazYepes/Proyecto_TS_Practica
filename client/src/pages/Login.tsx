// src/pages/Login.tsx
import React from "react";

function Login() {
  return (
    <div>
      <h2>Página de Login</h2>
      <form>
        <input type="email" placeholder="Correo" />
        <input type="password" placeholder="Contraseña" />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}

export default Login;
