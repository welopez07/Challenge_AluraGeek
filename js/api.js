const BASE_URL = 'https://678969db2c874e66b7d8a9e1.mockapi.io/products';


export async function fetchProducts() {
    try {
      const response = await fetch(BASE_URL);
      return await response.json();
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      return [];
    }
  }
  
  export async function postProduct(product) {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      return await response.json();
    } catch (error) {
      console.error('Error al publicar el producto:', error);
      throw error;
    }
  }
  
  export function addProductLocally(product) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
  }
  
  export function getLocalProducts() {
    return JSON.parse(localStorage.getItem('products')) || [];
  }
  
  export async function deleteProduct(productId) {
    try {
      await fetch(`${BASE_URL}/${productId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  }
  