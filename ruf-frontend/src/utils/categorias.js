const nombresCategoria = {
  bano: "baño",
};

export function getCategoriaNombre(categoria) {
  if (!categoria) {
    return "";
  }

  return nombresCategoria[categoria] || categoria;
}
