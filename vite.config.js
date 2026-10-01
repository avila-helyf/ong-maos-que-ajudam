import { defineConfig } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/* ==========================================================
   ONG Mãos que Ajudam — configuração de build (Vite)
   ========================================================== */
export default defineConfig({
  /* Raiz do projeto continua sendo a pasta do repositório (onde já
     vivem css/, js/ e imagens/ como irmãs de html/) — não movemos nada
     de lugar para adotar o bundler. O único ponto de entrada é
     html/index.html; os caminhos relativos que ele já usa (../css/...,
     ../js/..., ../imagens/...) continuam funcionando sem alteração,
     porque são resolvidos relativos à pasta do próprio arquivo HTML
     (html/), o que cai dentro da raiz do projeto de qualquer forma. */
  root: ".",
  /* Caminho-base dos arquivos finais. Localmente (preview) e em hosts
     que servem o site na raiz do domínio (Vercel/Netlify), continua
     "/". O GitHub Pages de um "repositório de projeto" (não o de
     usuário) serve tudo dentro de /<nome-do-repositorio>/ — por isso o
     workflow de deploy (.github/workflows/deploy.yml) builda com
     VITE_BASE=/ong-maos-que-ajudam/, sobrescrevendo esse padrão só
     naquele ambiente. */
  base: process.env.VITE_BASE || "/",
  build: {
    outDir: "dist",
    /* Minificação de JS/CSS via esbuild (padrão do Vite) — a de HTML é
       feita à parte, em scripts/minificar-html.js (ver package.json),
       porque o Vite não minifica o HTML de saída sozinho. */
    minify: "esbuild",
    rollupOptions: {
      input: resolve(__dirname, "html/index.html"),
    },
  },
  /* O servidor de desenvolvimento (`npm run dev`) abre direto em
     /html/index.html, já que não há index.html na raiz do projeto. */
  server: {
    open: "/html/index.html",
  },
});
