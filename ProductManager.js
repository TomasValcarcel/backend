const fs = require("fs");

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = this.cargarProductos();
  }

  generarId() {
    
    return this.products.length + 1;
  }

  cargarProductos() {
    try {
      const data = fs.readFileSync(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      
      return [];
    }
  }

  guardarProductos() {
    
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), "utf-8");
  }

  obtenerProductos() {
    return this.products;
  }

  agregarProducto({ title, description, price, photo, code, stock }) {
    if (this.products.some(product => product.code === code)) {
      throw new Error("Este codigo ya existe. Por favor, intente con uno nuevo.");
    }

    const newProduct = {
      id: this.generarId(),
      title,
      description,
      price,
      photo,
      code,
      stock,
    };

    this.products.push(newProduct);
    this.guardarProductos(); 
    return newProduct;
  }

  generarProductoPorId(id) {
    const product = this.products.find(product => product.id === id);

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    return product;
  }

  actualizarProducto(id, updatedFields) {
    const index = this.products.findIndex(product => product.id === id);

    if (index === -1) {
      throw new Error("Producto no encontrado");
    }

    
    this.products[index] = { ...this.products[index], ...updatedFields };

    this.guardarProductos(); 
    return this.products[index];
  }

  borrarProducto(id) {
    const index = this.products.findIndex(product => product.id === id);

    if (index === -1) {
      throw new Error("Producto no encontrado");
    }

   
    const deletedProduct = this.products.splice(index, 1)[0];

    this.guardarProductos(); 
    return deletedProduct;
  }
}


const productManager = new ProductManager("productos.json");

console.log("Productos en un inicio:", productManager.obtenerProductos());

const addedProduct = productManager.agregarProducto({
  title: "producto",
  description: "producto",
  price: 200,
  photo: "Sin imagen",
  code: "qwerty12345",
  stock: 100,
});

console.log("Productos luego de ser agregados:", productManager.obtenerProductos());

try {
  productManager.agregarProducto({
    title: "producto",
    description: "producto",
    price: 200,
    photo: "Sin imagen",
    code: "qwerty12345",
    stock: 100,
  });
} catch (error) {
  console.error("Error al querer agregar un producto ya existente:", error.message);
}

const generarProductoPorId = productManager.generarProductoPorId(addedProduct.id);
console.log("Producto obtenido por ID:", generarProductoPorId);


const updatedProduct = productManager.actualizarProducto(addedProduct.id, {
  price: 250,
  stock: 30,
});

console.log("Producto actualizado:", updatedProduct);


const borrarProducto = productManager.borrarProducto(addedProduct.id);
console.log("Producto eliminado:", borrarProducto);