let cart = []; // carrinho
let modalQt = 1; // quantidade
let modalKey = 0 // qual pizza

const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);

//Listagem das pizzas
pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true); // seleciona e cria as estruturas de disco das pizzas na página

    pizzaItem.setAttribute('data-key', index); // linca o id ao key
    pizzaItem.querySelector('.pizza-item--img img').src = item.img; // adiciona a foto da pizza
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`; // adiciona o preço da pizza
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name; // adiciona o nome da pizza
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description; // adiciona a descrição da pizza
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{ // criar evento de click

        e.preventDefault(); // bloqueia a atualização da pagina quando clicado
        let key = e.target.closest('.pizza-item').getAttribute('data-key'); // identifica a piza clicada pelo id
        modalQt = 1; //resetando a quantidade sempre que abrir o modal para 1 unidade
        modalKey = key;

        //preencher as informações no modal quando houver o click
        c('.pizzaBig img').src = pizzaJson[key].img; // imagem
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name; // nome
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description; //descrição
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`; // preço com fixado 2 depois da virgula

        /**** resetando o tamanho da pizza no Modal  *****/
            c('.pizzaInfo--size.selected').classList.remove('selected'); //desselecionar o tamanho da pizza
            cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{ // selecionar o tamanho da pizza  
                if(sizeIndex == 2) {
                size.classList.add('selected'); // seleciona a grande
            }
        /**** *****/          
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];// acessa o tamanho da pizza
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;
       

        c('.pizzaWindowArea').style.opacity = '0';
        c('.pizzaWindowArea').style.display = 'flex'; // quando clicar na pizza aparecera um modal
        setTimeout(()=>{ 
            c('.pizzaWindowArea').style.opacity = '1';
        }, 200); //espera 200 milisegundas para aparecer 
    }); 
    

    c('.pizza-area').append( pizzaItem );
});

//eventos do modal

// evento de fechar o modal
    function closeModal() {
        c('.pizzaWindowArea').style.opacity = '0';// ficar invisível
        setTimeout(()=>{
            c('.pizzaWindowArea').style.display = 'none'; // fechar o modal
        }, 500); // em 0,5 segundos
    }
    cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
        item.addEventListener('click', closeModal);
    });

// evento de alterar a quantidade
    c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
        if(modalQt > 1){ // só subtrai se o qt for maior que 1
            modalQt--;
            c('.pizzaInfo--qt').innerHTML = modalQt;
        }
    });

    c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
        modalQt++;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    });

// evento de seleção de tamanho
    cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{ // selecionar o tamanho da pizza  
       size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected'); //desselecionar o tamanho da pizza
        size.classList.add('selected'); // seleciona
       })
    });

// ação do botão de carrinho
    c('.pizzaInfo--addButton').addEventListener('click', ()=>{ // carrinho acessa o pizzakey e localiza a pizza
        let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key')); // string em inteiro
        
        // adicionando ao carrinho

            // a mesma pizza do mesmo tamanho deve estar juntas
            let identifier = pizzaJson[modalKey].id+'@'+size; //identificador = id + size
            let key = cart.findIndex((item)=>item.identifier == identifier); // verifica se já tem (identifier) o item no carrinho
            if(key > -1) { //se achou O identfier
                cart[key].qt += modalQt; // adiciona mais a quantidade selecionada no item localizado
            } else {
                cart.push({
                    identifier,
                    id:pizzaJson[modalKey].id, // identificar qual é a pizza
                    size, // tamanho
                    qt:modalQt //quantidade
                });
            }
            updateCart(); // antes de fechar passa as informaçoes para o carrinho   
            closeModal(); // fecha o modal
        });

    // ação de click no menu carrinhho mobile ↓
        c('.menu-openner span').addEventListener('click', () =>{ // evento de click no carrinho (mobile)
            if (cart.length > 0){ // se tiver algum item no carrinho, então o carrinho é clicável.
                c('aside').style.left = '0'; // ele está toto para direita então deve mudar para esquerda
            } 
        });
        c('.menu-closer').addEventListener('click', () =>{ // função fechar  a visualização do carrinho mobile
            c('aside').style.left = '100vw';
        });
    // ação de click no menu carrinhho mobile ↑


    // atualizar o carrinho
    function updateCart() {
        c('.menu-openner span').innerHTML = cart.length;// atualiza o carrinho mobile

        // mostrar o carrinho ou não
        if(cart.length > 0) { // se tiver algum item no carrinho...
            c('aside').classList.add('show'); // aparecer o carriho
            c('.cart').innerHTML = ''; //zerar o carrinho antes de atualizar = zera-mostra-zera-mostra...

            let subtotal = 0;
            let desconto = 0;
            let total = 0;
            
            for(let i in cart) { // id do item
                let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id); // retorna o item iteiro
                subtotal += pizzaItem.price * cart[i].qt; //preço + qnt de item

                
                
                let cartItem = c('.models .cart--item').cloneNode(true);// clona o carrinho

                //preenchendo as informações
                    let pizzaSizeName; // tamanho da pizza
                    switch(cart[i].size) {
                        case 0:
                            pizzaSizeName = 'P';
                            break;
                        case 1:
                            pizzaSizeName = 'M';
                        break;
                        case 2:
                            pizzaSizeName = 'G';
                        break;
                    } 
                    let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            
                    cartItem.querySelector('img').src = pizzaItem.img; // imagem
                    cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName; //nome da pizza + tamanho
                    cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt; //quantidade de pizzas
                    
                    // quantidade e botão + e -
                        cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                            if(cart[i].qt > 1) {
                                cart[i].qt--; // subitrai a quantidade clicado em -
                            } else {
                                cart.splice(i, 1); // remove o item do carrinho se zerar a quantidade
                            }
                            updateCart(); // atualiza o carrinho
                        });
                        cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                            cart[i].qt++; // adicionado mais quantidade no item do carrinho quando clicado em +
                            updateCart(); // atualiza o carrinho
                        });

                c('.cart').append(cartItem); //adiciona os dados no carrinho
            }

            // calcular o subtotal
            desconto = subtotal * 0.1;
            total = subtotal - desconto;

            c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
            c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
            c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


        } else { // se não tem item no carrinho...
            c('aside').classList.remove('show'); // oculta o carriho
            c('aside').style.left = '100vw'; // oculta mobile
        }
    }