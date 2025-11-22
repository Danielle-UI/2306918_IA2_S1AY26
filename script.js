if(document.body.id === 'indexPage'){
        login_button = document.getElementById('loginBtn')
        register_button = document.getElementById('registerBtn')
        welcome = document.getElementById('welcome')
        login = document.getElementById('login')
        registration = document.getElementById('registration')
        log = document.getElementById('login_submit')
        signup = document.getElementById('signup_submit')
        guest_button = document.getElementById('guest')

        //Page manipulation
        login_button.addEventListener('click', () =>{
            login.style.display='contents';
            welcome.style.display='none';
        })

        guest_button.addEventListener('click', () =>{
        window.location.href = 'Product.html';
        })

        register_button.addEventListener('click', () =>{
            registration.style.display='contents';
            welcome.style.display='none';
        })
        
        document.getElementById('slogin').addEventListener('click', () =>{
            registration.style.display='none';
            login.style.display='contents';
    
        })

        document.getElementById('lsignup').addEventListener('click', () =>{
            registration.style.display='contents';
            login.style.display='none';
        })

        //Login Form Validation
        log.addEventListener('click', () =>{
                const login_username = document.getElementById('loginuser').value.trim();
                const login_pwd = document.getElementById('loginpassword').value.trim();

                //Password vaildation
                if (!login_username || !login_pwd) {
                    alert("Please fill out all fields.");
                    return;
                }

                //User account validation
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const thisuser = users.find(u => 
                    u.username === login_username && u.password === login_pwd
                );

                if (thisuser) {
                    localStorage.setItem('user', login_username);
                    alert("Login successful!");
                    window.location.href = 'Product.html';
                } else {
                    alert("Incorrect username or password.");
                }
            
        })

        //2. c) Registration form Validation
        signup.addEventListener('click', () =>{
            const signup_username = document.getElementById('signupuser').value.trim()
            const signup_pwd = document.getElementById('signuppassword').value.trim()
            const fname = document.getElementById('fname').value.trim()
            const lname =  document.getElementById('lname').value.trim()
            const email = document.getElementById('email').value.trim()
            const dob = document.getElementById('dob').value.trim()
            const confirmpwd = document.getElementById('confirmpassword').value.trim()

            //Required Fields validation
            if (!signup_username || !signup_pwd || !fname || !lname || !email || !dob || !confirmpwd) {
            alert("Please fill out all required fields.");
            return;
            }
            
            //Password Validation
            const pwdpattern = /^\S{8,}$/;
            if (!pwdpattern.test(signup_pwd)) {
                alert("Password must be at least 8 characters long with no spaces.");
                return;
            }
            if(signup_pwd!==confirmpwd){
                alert('Passwords do not match');
                return;
            }

            //Name Validation
            const lettersonly = /^[A-Za-z\s]+$/
            if (!lettersonly.test(fname) || !lettersonly.test(lname)){
                alert("Names can contain only letters.")
                return;
            }

            //Validate Email
            if(email) {
                const emailpattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                let valid = emailpattern.test(email);
                if(!valid){
                    alert('Enter Valid Email address')
                    return;
                }
            }

            //Validate Date of Birth
            const dateofbirth = new Date(dob);
            today = new Date();
            const age = today.getFullYear() - dateofbirth.getFullYear(); // approximate age

            if (age < 16) {
                alert("You have to be 16 years or older to create an account.");
                return;
            }

            //checks if username already exists in local storage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            let storeduser = false;
            for (let i = 0; i < users.length; i++) {
                if (users[i].username === signup_username) {
                    storeduser = true;
                    break;
                }
            }
            if (storeduser){
                alert("username already exists. Please choose another or signin");
                return;
            }

            //saves all user inputs into a user variable and adds to local storage
            users.push({
                username:signup_username, 
                password:signup_pwd,
                firstname: fname,
                lastname: lname,
                email: email,
                DateOfBirth: dob,
            });
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('user', signup_username)
            alert('Account created successfully')
            window.location.href = 'Product.html';
        })
}

if(document.body.id === 'productPage'){
    const user = localStorage.getItem('user');
        if (!user){
            document.getElementById('user').innerHTML = `
            <a href="index.html">Login</a>
            `
        }else{
            document.getElementById('user').innerText = `
            Hello ${user}`
        }
        

        //script for adding products to cart
        document.querySelectorAll('.shopping_cart').forEach(button => {
            button.addEventListener('click', () => {
                if (!user) {
                    alert("Please login first.");
                    return;
                }
                const productcard = button.parentElement.parentElement;
                const name = productcard.querySelector('.product_name').textContent;
                const priceText = productcard.querySelector('.price h3').textContent;
                //converts string to float by removing the dollar sign
                const price = parseFloat(priceText.replace('$', ''));
                const image = productcard.querySelector('img').getAttribute('src');

                const select_color = productcard.querySelector('select[name="yarncolor"], select[name = "pursecolor"], select[name="handbagcolor"], select[name="casecolor"]');
                let color = null;
                if (select_color) {
                    color = select_color.value;
                    if(!color){
                        alert('Please select a color before adding to cart.');
                        return;
                    }
                }

                // Retrieve existing cart or create a new one
                let mycart = JSON.parse(localStorage.getItem(`${user}_cart`)) || [];
                // Check if the item already exists
                const duplicate = mycart.find(item => 
                item.name === name && item.color === color);

                //check if item is already in cart with the same color
                if (duplicate) {
                    duplicate.quantity += 1;
                } else {
                    mycart.push({ name, price, image, color, quantity: 1 }); //add product to cart
                }

                // Save updated cart
                localStorage.setItem(`${user}_cart`, JSON.stringify(mycart));

                alert(`${name} is added to your cart!`);
                    });
        })

            document.getElementById('logout').addEventListener('click', () =>{
            localStorage.setItem('user', "");
        })
}

if(document.body.id === 'cartPage'){
    const user = localStorage.getItem('user');
        const cartItems = JSON.parse(localStorage.getItem( `${user}_cart`)) || [];
        const cart_list = document.getElementById('cart_products');
        
        if(cartItems.length === 0){
            cart_list.innerHTML = '<h3>Your cart is empty, continue shopping.</h3>';
        }else{
            cartItems.forEach((product, index) => {
                const productitem = document.createElement('div');
                productitem.innerHTML = `
                    <div class="cart_items">
                    <img src="../Assets/${product.image}" alt="${product.name}" class="cartimg">
                    <br>
                    <div>
                        <h3>${product.name}</h3><br>
                        <h5>Price: $${product.price}</h5><br>
                        Quantity: <input type="number" min="1" class="qty" data-index=${index} value="${product.quantity}"><br>
                        ${product.color ? `Color: ${product.color}<br><br>` : '<br>'}
                        <button class="remove" data-index="${index}"">Remove</button>
                    </div>
                    </div>    
                    <br>  
                    <hr>              
                
                `;
                cart_list.appendChild(productitem);
            });

            //calculate subtotal, discount, tax and total
            const discount = 0.05; //fixed discount
            const tax = 0.15; //fixed
            let subtotal = 0;
            cartItems.forEach((product) => {
                subtotal += product.price * product.quantity;
            });
            let discountamt = discount * subtotal;
            let taxamt = tax * (subtotal-discountamt);
            document.getElementById('subtotal').innerHTML = 
            `<h3>Subtotal: $${subtotal.toFixed(2)}</h3>
            <h4>Discount: $${discountamt.toFixed(2)}</h4>
            <h4>Tax: $${taxamt.toFixed(2)}</h4>
            <hr>
            <h2>Total: $${((subtotal - discountamt)+taxamt).toFixed(2)}</h2>`;
            
        }

        const remove = document.querySelectorAll('.remove');
        remove.forEach(button =>{
            button.addEventListener('click', (e) => {
                const productIndex = e.target.getAttribute('data-index');
                //remove item from array
                cartItems.splice(productIndex, 1);
                //save updated array back to localStorage
                localStorage.setItem(`${user}_cart`, JSON.stringify(cartItems));
                //reload the page
                location.reload();
            });
        })

        // Select all quantity inputs
        const qty = document.querySelectorAll('.qty');

        qty.forEach(input => {
            input.addEventListener('change', (e) => {
                const index = e.target.getAttribute('data-index');
                const newQty = parseInt(e.target.value);

                // Update the array
                cartItems[index].quantity = newQty;

                // Save updated array back to localStorage
                localStorage.setItem(`${user}_cart`, JSON.stringify(cartItems));
                location.reload();
            });
        });
}

if(document.body.id === 'checkoutPage'){
    const user = localStorage.getItem('user');
        document.getElementById('closebtn').addEventListener("click", () =>{
            window.location.href = 'Product.html';
        })

        //Form Validation
        document.getElementById('placebtn').addEventListener("click", () =>{
            const orders = JSON.parse(localStorage.getItem(`${user}_orders`) || "[]");
            const requiredinputs = document.querySelectorAll("input[required], select[required]")
            const empty = Array.from(requiredinputs).some(field => !field.value.trim());
            if (empty) {
            alert("Please fill out all required fields.");
            return;
            }

            cardname = document.getElementById("cardname").value.trim();
            fname = document.getElementById("fname").value.trim();
            lname = document.getElementById("lname").value.trim();
            const lettersonly = /^[A-Za-z\s]+$/
            if (!lettersonly.test(cardname) || !lettersonly.test(fname) || !lettersonly.test(lname)){
                alert("Names can contain only letters.")
                return;
            }
            const zip = document.getElementById("zip").value.trim();
            if (!/^\d{5}$/.test(zip)) {
                alert("Zip must be 5 digits.");
                return;
            }

            const phone = document.getElementById("phone").value.trim();
            if (!/^\d{7,15}$/.test(phone)) {
                alert("Phone number must be 7-15 digits.");
                return;
            }

            const cvv = document.getElementById("cvv").value.trim();
            if (!/^\d{3}$/.test(cvv)) {
                alert("CVV must be 3 digits.");
                return;
            }

            const cardnum = document.getElementById("cardnumber").value.trim();
            if (!/^\d{13,19}$/.test(cardnum)) {
                alert("Card number must be 13-19 digits.");
                return;
            }

            const expiry = document.getElementById('expiry').value
            const [year, month] = expiry.split("-").map(Number);

            const today = new Date();
            const expiryDate = new Date(year, month, 0);

            // Card is valid if expiry >= today else card is expired
            if (expiryDate < today) {
                alert("Card has expired");
                return;
            }


            if (confirm("Confirm Checkout")) {
            const cart = JSON.parse(localStorage.getItem(`${user}_cart`)) || [];

            //Storing order details
            const shipping = {
                country: document.getElementById("address").value.trim(),
                firstname: document.getElementById("fname").value.trim(),
                lasname: document.getElementById("lname").value.trim(),
                street: document.getElementById("street").value.trim(),
                city: document.getElementById("city").value.trim(),
                zipcode: document.getElementById("zip").value.trim(),
                number: document.getElementById("phone").value.trim()
            }

            const payment = {
                type: document.getElementById("cardtype").value,
                cardname: document.getElementById("cardname").value,
                expdate: document.getElementById("expiry").value,
                cvv: document.getElementById("cvv").value.trim(),
                cardnum: document.getElementById("cardnumber").value.trim()
            }

            const orderdetails = {
                cart: cart,
                shipping: shipping,
                payment: payment
            };
                
            //appends new orders to myorders variable
            orders.push(orderdetails);
            // Save updated orderdetails to local storage
            localStorage.setItem(`${user}_orders`, JSON.stringify(orders));

            alert("Checkout confirmed");
        } else {
            // User clicked Cancel
            alert("Checkout cancelled")
        }

        })

        //Order summary in checkout page
        const cartItems = JSON.parse(localStorage.getItem(`${user}_cart`)) || [];
        ordersum = document.getElementById('summary')
        cartItems.forEach((product, index) => {
                const productitem = document.createElement('div');
                productitem.innerHTML = `
                    <div>
                    <img src="../Assets/${product.image}" alt="${product.name}" class="cartimg">
                    <br>
                    <div>
                        <p>${product.name} [qty:${product.quantity}]</p>

                    </div>
                    </div>    
                    <br>             
                
                `;
                ordersum.appendChild(productitem);
            });
            //calculations for order total
        const discount = 0.05; //fixed discount
            const tax = 0.15; //fixed tax
            let subtotal = 0;
            cartItems.forEach((product) => {
                subtotal += product.price * product.quantity;
            });
            let discountamt = discount * subtotal;
            let taxamt = tax * (subtotal-discountamt);
            document.getElementById('checkoutamt').innerHTML = 
            `<h3>Subtotal: $${subtotal.toFixed(2)}</h3>
            <h4>Discount: $${discountamt.toFixed(2)}</h4>
            <h4>Tax: $${taxamt.toFixed(2)}</h4>
            <hr>
            <h2>Total: $${((subtotal - discountamt)+taxamt).toFixed(2)}</h2>`;      
}
