import {
    fetchProducts,
    postProduct,
    deleteProduct,
    addProductLocally,
  } from './api.js';
  import { addProduct } from './dom.js';
  
  const productContainer = document.querySelector('.products-container');
  const productForm = document.querySelector('.add-product-form');
  const filePickerIcon = document.querySelector('#file-picker-icon');
  const filePicker = document.querySelector('#file-picker');
  const productImageInput = document.querySelector('#image-input');
  let imageDataUrl = '';
  
  // Abrir el selector de archivos al hacer clic en el icono
  filePickerIcon.addEventListener('click', () => {
    filePicker.click();
  });
  
  // Actualizar el input al seleccionar un archivo
  filePicker.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imageDataUrl = e.target.result;
        productImageInput.value = file.name; // Mostrar el nombre del archivo en el input
        //document.querySelector('#image-input').value = file.name; // Mostrar el nombre del archivo en el input
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Validar formulario al enviar
  productForm.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const name = document.querySelector('#product-name').value.trim();
    const price = document.querySelector('#product-price').value.trim();
    const image = imageDataUrl || document.querySelector('#image-input').value.trim();
  
    // Validaciones
    if (!name) {
      alert('El nombre del producto es obligatorio.');
      return;
    }
  
    if (isNaN(price) || price <= 0) {
      alert('Ingrese un precio válido (mayor a 0).');
      return;
    }
  
    if (!image) {
      alert('Debe ingresar una URL de imagen o subir un archivo.');
      return;
    }
  
    const newProduct = { name, image, price };
  
    try {
      const product = await postProduct(newProduct);
      addProduct(product, productContainer);
      //borrar imagen despues de enviar
      imageDataUrl = '';
      productImageInput.value = '';
    } catch (error) {
      console.error('Error al publicar el producto:', error);
      //addProductLocally(newProduct);
      //addProduct(newProduct, productContainer);
    } finally {
      productForm.reset();
      //imageDataUrl = '';
      checkEmptyProductContainer();
    }
  });
  
  // Mostrar mensaje si no hay productos
  const checkEmptyProductContainer = () => {
    const noProductsMessage = document.querySelector('.no-products-message');
    if (productContainer.childElementCount === 0 && !noProductsMessage) {
      const message = document.createElement('p');
      message.classList.add('no-products-message');
      message.textContent = 'No se han agregado productos.';
      productContainer.appendChild(message);
    } else if (productContainer.childElementCount > 0 && noProductsMessage) {
      noProductsMessage.remove();
    }
  };
  
  document.addEventListener('DOMContentLoaded', async () => {
    const products = await fetchProducts();
    products.forEach((product) => addProduct(product, productContainer));
    checkEmptyProductContainer();
  });
  
  productContainer.addEventListener('click', async (event) => {
    if (event.target.classList.contains('fa-trash-can')) {
        try {
            const productCard = event.target.closest('.card');
            if (!productCard) {
                console.error('No se encontró la card del producto');
                return;
            }

            const productId = productCard.dataset.id;
            if (!productId) {
                console.error('No se encontró el ID del producto');
                return;
            }

            // Deshabilitar el botón mientras se elimina
            const deleteBtn = event.target.closest('.delete-btn');
            if (deleteBtn) {
                deleteBtn.disabled = true;
            }

            // Añadir clase de loading
            event.target.classList.add('fa-spin');

            await deleteProduct(productId);
            
            // Animación suave de eliminación
            productCard.style.transition = 'opacity 0.3s ease';
            productCard.style.opacity = '0';
            
            setTimeout(() => {
                productCard.remove();
                checkEmptyProductContainer();
            }, 300);

        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            alert('No se pudo eliminar el producto. Por favor, intenta de nuevo.');
            
            // Restaurar el botón si hay error
            const deleteBtn = event.target.closest('.delete-btn');
            if (deleteBtn) {
                deleteBtn.disabled = false;
            }
            event.target.classList.remove('fa-spin');
        }
    }
});
  