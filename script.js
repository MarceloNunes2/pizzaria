let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

// Listagem das Pizzas
pizzaJson.map((item, index) => {
  const pizzaItem = c(".models .pizza-item").cloneNode(true);

  pizzaItem.setAttribute('data-key', index);
  pizzaItem.querySelector('.pizza-item--img img').src = item.img;
  pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.prices[2].toFixed(2)}`;
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
  pizzaItem.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();
    const key = e.target.closest('.pizza-item').getAttribute('data-key');
    modalQt = 1;
    modalKey = key;

    c('.pizzaBig img').src = pizzaJson[key].img;
    c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;

    // Adicione as informações de tamanho e preço de acordo com o tamanho selecionado
    c('.pizzaInfo--size.selected').classList.remove('selected');
    cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
      size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
      if (sizeIndex === 2) {
        size.classList.add('selected');
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].prices[sizeIndex].toFixed(2)}`;
      }
    });

    c('.pizzaInfo--qt').innerHTML = modalQt;
    c('.pizzaWindowArea').setAttribute('data-key', key); // Adicione o atributo data-key
    c('.pizzaWindowArea').style.opacity = 0;
    c('.pizzaWindowArea').style.display = 'flex';
    setTimeout(() => {
      c('.pizzaWindowArea').style.opacity = 1;
    }, 200);
  });

  c(".pizza-area").append(pizzaItem);
});

// Eventos do Modal

function closeModal() {
  c('.pizzaWindowArea').style.opacity = 0;
  setTimeout(() => {
    c('.pizzaWindowArea').style.display = 'none';
  }, 500);
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
  item.addEventListener('click', closeModal);
});

c('.pizzaInfo--qtmenos').addEventListener('click', () => {
  if (modalQt > 1) {
    modalQt--;
    c('.pizzaInfo--qt').innerHTML = modalQt;
  }
});

c('.pizzaInfo--qtmais').addEventListener('click', () => {
  modalQt++;
  c('.pizzaInfo--qt').innerHTML = modalQt;
});

cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
  size.addEventListener('click', (e) => {
    c('.pizzaInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');
    const key = c('.pizzaWindowArea').getAttribute('data-key');
    c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].prices[sizeIndex].toFixed(2)}`;
  });
});

c('.pizzaInfo--addButton').addEventListener('click', () => {
  const size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-Key'));

  const identifier = `${pizzaJson[modalKey].id}@${size}`;

  const key = cart.findIndex((item) => item.identifier === identifier);

  if (key > -1) {
    cart[key].qt += modalQt;
  } else {
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size,
      qt: modalQt
    });
  }
  updateCart();
  closeModal();
});

c('.menu-openner').addEventListener('click', () => {
  if (cart.length > 0) {
    c('aside').style.left = '0';
  }
});

c('.menu-closer').addEventListener('click', () => {
  c('aside').style.left = '100vw';
});

function updateCart() {
  c('.menu-openner span').innerHTML = cart.length;

  if (cart.length > 0) {
    c('aside').classList.add('show');
    c('.cart').innerHTML = '';

    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    for (let i in cart) {
      const pizzaItem = pizzaJson.find((item) => item.id === cart[i].id);
      subtotal += pizzaItem.prices[cart[i].size] * cart[i].qt;

      const cartItem = c('.models .cart--item').cloneNode(true);

      let pizaSizeName = '';
      switch (cart[i].size) {
        case 0:
          pizaSizeName = 'P';
          break;

        case 1:
          pizaSizeName = 'M';
          break;

        case 2:
          pizaSizeName = 'G';
          break;

        default:
          break;
      }

      const pizzaName = `${pizzaItem.name} (${pizaSizeName})`;

      cartItem.querySelector('img').src = pizzaItem.img;
      cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
        if (cart[i].qt > 1) {
          cart[i].qt--;
        } else {
          cart.splice(i, 1);
        }
        updateCart();
      });
      cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
        cart[i].qt++;
        updateCart();
      });

      c('.cart').append(cartItem);
    }

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
    c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
    c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
  } else {
    c('aside').classList.remove('show');
    c('aside').style.left = '100vw';
  }
}
