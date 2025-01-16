export function addProduct(product, container) {
    const productCard = document.createElement('div');
    productCard.classList.add('card');
    productCard.dataset.id = product.id;
    productCard.innerHTML = `
        <div class="image-container"> 
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="card__info">
            <h3 class="product-name">${product.name}</h3>
            <div class="price-delete-container">
                <p class="price">$${product.price}</p>
                <button class="delete-btn">
                    <i class="fa-solid fa-trash-can" title="Eliminar"></i>
                </button>
            </div>   
        </div>
    `;

    //manejar error de imagen
    const productImage = productCard.querySelector('img');
    if (productImage) {        
        productImage.addEventListener('error', () => {
            productImage.src = './assets/no-img.jpg';
          });
    }   
  
    container.appendChild(productCard);
  }
  

  //esperar a que el DOM esté cargado antes de agregar el event listener
  document.addEventListener('DOMContentLoaded', () => {
      const producNameInput = document.getElementById('product-name');
      if (producNameInput) {
          producNameInput.addEventListener('input', function (e) {
            let words = e.target.value.split(' ');
            e.target.value = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
          });
      }    
  });
  
  