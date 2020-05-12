
// var Cart = {
//     construct: (oldCart) => {
//         if (oldCart) {
//             this.$items = oldCart.$items;
//             this.$totalQty = oldCart.$totalQty;
//             this.$totalPrice = oldCart.$totalPrice;
//         }
//     },

//     addCart: (item, id) => {
//         if (item.promotion_price == 0) {
//             this.cart = { qty: 0, price: item.price, item: item };
//         } else {
//             this.cart = { qty: 0, price: item.promotion_price, item: item };
//         }

//         if (this.items) {
//             this.cart = this.items[id];
//         }

//         this.cart.qty++;
//         if (item.promotion_price == 0) {
//             this.cart.price = item.price * this.cart.qty;
//         } else {
//             this.cart.price = item.promotion_price * this.cart.qty;
//         }

//         // this.items[id] = this.cart;
//         this.$totalQty++;

//         if (item.promotion_price == 0) {
//             this.$totalPrice += item.price;
//         } else {
//             this.$totalPrice += item.promotion_price;
//         }

//     }
// }
// module.exports = Cart;

module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    this.add = function (item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
        }

        storedItem.qty++;

        if(item.promotion_price == 0){
            storedItem.price = storedItem.item.price * storedItem.qty;
        }else{
            storedItem.price = storedItem.item.promotion_price * storedItem.qty;
        }

        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };

    this.update = function (id, newQty) {
        var present_qty = this.items[id].qty;
        if(present_qty > newQty){
            this.items[id].qty = newQty;
            this.items[id].price = this.items[id].item.price * newQty;
            var cut = present_qty - newQty;
            this.totalQty -= cut;
            this.totalPrice -= this.items[id].item.price;
            if (this.items[id].qty <= 0) {
                delete this.items[id];
            }
        }else{
            this.items[id].qty = newQty;
            this.items[id].price = this.items[id].item.price * newQty;
            var cut = newQty - present_qty;
            this.totalQty += cut;
            this.totalPrice += this.items[id].item.price;
            if (this.items[id].qty <= 0) {
                delete this.items[id];
            }
        }
    }

    this.reduceByOne = function (id) {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;
        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
    };

    this.removeItem = function (id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };

    this.increase = function(id){
        this.items[id].qty++ ;
        this.items[id].price += this.items[id].item.price;
        this.totalQty++ ;
        this.totalPrice += this.items[id].item.price;
        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
    };

    this.generateArray = function () {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};