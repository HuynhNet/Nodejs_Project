var express = require('express');
var router = express.Router();
var conn = require('../models/connectDB');
var async = require('async');
var hash = require('password-hash');
var { check, validationResult } = require('express-validator/check');

var Product = require('../models/productModels');
var User = require('../models/UserModels');
var Cart = require('../models/Cart');


/* GET home page. */

router.get('/home', function (req, res, next) {
    async.parallel({
        phones: (callback) => {
            Product.getProductByIdType(1, (err, rows) => {
                callback(err, rows);
            });
        },
        laptops: (callback) => {
            Product.getProductByIdType(2, (err, rows) => {
                callback(err, rows);
            });
        },
        headphones: (callback) => {
            Product.getProductByIdType(3, (err, rows) => {
                callback(err, rows);
            });
        },
        tablets: (callback) => {
            Product.getProductByIdType(4, (err, rows) => {
                callback(err, rows);
            });
        },
        phoneFirms: (callback) => {
            Product.getFirmProduct(1, (err, rows) => {
                callback(err, rows);
            });
        },
        laptopFirms: (callback) => {
            Product.getFirmProduct(2, (err, rows) => {
                callback(err, rows);
            });
        },
        headphoneFirms: (callback) => {
            Product.getFirmProduct(3, (err, rows) => {
                callback(err, rows);
            });
        },
        tabletFirms: (callback) => {
            Product.getFirmProduct(4, (err, rows) => {
                callback(err, rows);
            })
        },
        typeNamePhone: (callback) => {
            Product.getTypeNameProduct(1, (err, rows) => {
                console.log(rows);

                callback(err, rows);
            })
        },
        typeNameLaptop: (callback) => {
            Product.getTypeNameProduct(2, (err, rows) => {
                callback(err, rows);
            })
        },
        typeNameHeadphone: (callback) => {
            Product.getTypeNameProduct(3, (err, rows) => {
                callback(err, rows);
            })
        },
        typeNameTablet: (callback) => {
            Product.getTypeNameProduct(4, (err, rows) => {
                callback(err, rows);
            })
        }
    }, (err, results) => {
        res.render('./page/home', {
            title: 'Trang chủ', phones: results.phones, laptops: results.laptops,
            headphones: results.headphones,
            tablets: results.tablets,
            phoneFirms: results.phoneFirms,
            laptopFirms: results.laptopFirms,
            headphoneFirms: results.headphoneFirms,
            tabletFirms: results.tabletFirms,
            typeNamePhone: results.typeNamePhone,
            typeNameLaptop: results.typeNameLaptop,
            typeNameHeadphone: results.typeNameHeadphone,
            typeNameTablet: results.typeNameTablet,
        });
    });
});

//

// page register
router.get('/register', function (req, res, next) {
    res.render('./page/register', { title: "Đăng ký", errors: '' });
});

router.post('/register', function (req, res, next) {

    // req.checkBody('txt_name', 'Vui lòng nhập họ tên').notEmpty();
    // req.checkBody('txt_email', 'Vui lòng nhập email').notEmpty();
    // req.checkBody('txt_email', 'Vui lòng nhập email đúng định dạng').isEmail();
    // req.checkBody('txt_pass', 'Vui lòng nhập mật khẩu').notEmpty();
    // req.checkBody('txt_phone', 'Vui lòng nhập số điện thoại').notEmpty();
    // req.checkBody('txt_address', 'Vui lòng nhập địa chỉ').notEmpty();

    // req.checkBody('txt_email', 'Email đã tồn tại').custom( (value) => {
    //     return new Promise((resolve, reject) => {
    //         User.getIdByEmail(req.body.txt_email, (err, rows) => {
    //             if(err){
    //                 reject(new Error('Server Error'));
    //             }
    //             if(Boolean(rows)){
    //                 reject(new Error('Email already in use'));
    //             }
    //             resolve(true);
    //         });
    //     });
    // }).withMessage('Email đã tồn tại');

    var email = req.body.txt_email;
    User.getUser(email, (err, rows) => {
        if (rows.length) {
            req.flash('emailExits', 'Email đã tồn tại');
            res.redirect('back');
        } else {
            var today = new Date();
            var pass = req.body.txt_pass;
            var password = hash.generate(pass);
            var user = {
                "name": req.body.txt_name,
                "email": req.body.txt_email,
                "phone": req.body.txt_phone,
                "address": req.body.txt_dia_chi,
                "password": password,
                "created_at": today,
                "updated_at": today
            }

            User.addUser(user, (err, rows) => {
                if (err) throw err;
                req.flash('success', 'Đăng ký thành viên thành công');
                res.redirect('back');
            });
        }
    });

});

// page login
router.get('/login', function (req, res, next) {
    res.render('./page/login', { title: "Đăng nhập" });
});

router.post('/login', function (req, res, next) {

    var email = req.body.txt_email;
    var password = req.body.txt_password;
    if (email && password) {
        User.getUser(email, (err, rows) => {
            if (err) throw err;

            if ((rows.length) && hash.verify(password, rows[0].password) && (rows[0].id_level == 3)) {
                req.session.loggin = true;
                req.session.username = rows[0].name;
                req.session.email = rows[0].email;
                req.session.phone = rows[0].phone;
                req.session.address = rows[0].address;
                req.session.idUser = rows[0].id;
                req.session.image = rows[0].image;
                req.session.level = rows[0].id_level;
                res.redirect('/home');
            } else if ((rows.length) && hash.verify(password, rows[0].password) && (rows[0].id_level == 1)) {
                req.session.loggin = true;
                req.session.username = rows[0].name;
                req.session.email = rows[0].email;
                req.session.phone = rows[0].phone;
                req.session.address = rows[0].address;
                req.session.idUser = rows[0].id;
                req.session.image = rows[0].image;
                req.session.level = rows[0].id_level;
                res.redirect('/admin');
            } else {
                req.flash('error', 'Tên đăng nhập hoặc mật khẩu không đúng');
                res.redirect('back');
            }
        });
    }
});

// logout
router.get('/logout', function (req, res, next) {
    if (req.session) {
        // req.logout();
        req.session = null;
        res.redirect('/home');
        // req.session.destroy((err) => {
        //     if (err) {
        //         throw err;
        //     } else {
                
        //     }
        // })
    }
});

// view detail product
router.get('/home/:type_product/:name/:id', function (req, res, next) {
    var id = req.params.id;
    var typeProductName = req.params.type_product;

    async.parallel({
        phoneFirms: (callback) => {
            Product.getFirmProduct(1, (err, rows) => {
                callback(err, rows);
            });
        },
        laptopFirms: (callback) => {
            Product.getFirmProduct(2, (err, rows) => {
                callback(err, rows);
            });
        },
        headphoneFirms: (callback) => {
            Product.getFirmProduct(3, (err, rows) => {
                callback(err, rows);
            });
        },
        tabletFirms: (callback) => {
            Product.getFirmProduct(4, (err, rows) => {
                callback(err, rows);
            })
        },
        products: (callback) => {
            Product.getProductByID(id, (err, rows) => {
                callback(err, rows);
            });
        },
        theSameProduct: (callback) => {
            Product.getTheSameProduct(typeProductName, (err, rows) => {
                callback(err, rows);
            });
        },
        theSamePtoductFirm: (callback) => {
            Product.theSameProductFirm(id, (err, rows) => {
                callback(err, rows);
            });
        }

    }, (err, results) => {
        res.render('./page/viewProductDetail', {
            title: 'Xem sản phẩm',
            phoneFirms: results.phoneFirms,
            laptopFirms: results.laptopFirms,
            headphoneFirms: results.headphoneFirms,
            tabletFirms: results.tabletFirms,
            products: results.products,
            theSameProduct: results.theSameProduct,
            theSamePtoductFirm: results.theSamePtoductFirm
        });
    });
});

// add cart
router.get('/add-cart/:name/:id', function (req, res, next) {
    var id = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    Product.getProductByID(id, (err, rows) => {
        if (err) {
            throw err;
        }
        cart.add(rows[0], id);
        req.session.cart = cart;

        req.flash('add_cart_success', 'Đã thêm vào giỏ hàng');
        res.redirect('back');
    });
});

router.get('/delete-cart/:id', function (req, res, next) {
    var id = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.removeItem(id);
    req.session.cart = cart;
    res.redirect('back');
});

router.get('/reduceByOne-cart/:id', function (req, res, next) {
    var id = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.reduceByOne(id);
    req.session.cart = cart;

    req.flash('reduce-cart', 'Đã cập nhật giỏ hàng');
    res.redirect('back');
});

router.get('/increase-cart/:id', function (req, res, next) {
    let id = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.increase(id);
    req.session.cart = cart;
    req.flash('increase', 'Đã cập nhật giỏ hàng');
    res.redirect('back');
});

router.get('/search-product', function (req, res, next) {
    var key = req.query.key;
    if (!key) {
        return res.redirect('back');
    }
    Product.searchProduct(key, (err, rows) => {
        if (err) throw err;
        var data = [];
        for (let i = 0; i < rows.length; i++) {
            data.push(rows[i]);
        }
        res.end(JSON.stringify(data));
    });
});

router.get('/home/Cart', function (req, res, next) {
    if (req.session.cart) {
        var products = [];
        var cart = req.session.cart.items;

        for (var id in cart) {
            products.push(cart[id]);
        }

        async.parallel({
            phoneFirms: (callback) => {
                Product.getFirmProduct(1, (err, rows) => {
                    callback(err, rows);
                });
            },
            laptopFirms: (callback) => {
                Product.getFirmProduct(2, (err, rows) => {
                    callback(err, rows);
                });
            },
            headphoneFirms: (callback) => {
                Product.getFirmProduct(3, (err, rows) => {
                    callback(err, rows);
                });
            },
            tabletFirms: (callback) => {
                Product.getFirmProduct(4, (err, rows) => {
                    callback(err, rows);
                })
            }
        }, (err, results) => {
            res.render('./page/listCart', {
                title: 'Giỏ hàng',
                phoneFirms: results.phoneFirms,
                laptopFirms: results.laptopFirms,
                headphoneFirms: results.headphoneFirms,
                tabletFirms: results.tabletFirms,
                products: products
            });
        });
    } else {
        async.parallel({
            phoneFirms: (callback) => {
                Product.getFirmProduct(1, (err, rows) => {
                    callback(err, rows);
                });
            },
            laptopFirms: (callback) => {
                Product.getFirmProduct(2, (err, rows) => {
                    callback(err, rows);
                });
            },
            headphoneFirms: (callback) => {
                Product.getFirmProduct(3, (err, rows) => {
                    callback(err, rows);
                });
            },
            tabletFirms: (callback) => {
                Product.getFirmProduct(4, (err, rows) => {
                    callback(err, rows);
                })
            }
        }, (err, results) => {
            res.render('./page/listCart', {
                title: 'Giỏ hàng',
                phoneFirms: results.phoneFirms,
                laptopFirms: results.laptopFirms,
                headphoneFirms: results.headphoneFirms,
                tabletFirms: results.tabletFirms,
                update_cart: "update_cart(id);"
            });
        });
    }
});
module.exports = router;
