var express = require('express');
var router = express.Router();
var conn = require('../models/connectDB');
var async = require('async');
var hash = require('password-hash');
var path = require('path');
var { check, validationResult } = require('express-validator/check');
var multer = require('multer');
var excelFile = require('read-excel-file/node');
var csvParser = require('csv-parser');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
// var paginator = require('express-paginatorjs');
var paginate = require('express-paginate');

var User = require('../models/UserModels');
var Product = require('../models/productModels');

// format multer
let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/upload/image_admin');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

let upload = multer({ storage: storage });

/* GET users listing. */
router.get('/', function (req, res, next) {
    if ((req.session.loggin) && (req.session.level == 1)) {
        res.render('./admin/index', { title: "Admin" });
    } else {
        res.redirect('/home');
    }

});

router.get('/manage-admin', function (req, res, next) {
    if ((req.session.loggin) && (req.session.level == 1)) {
        User.getUsers(1, (err, rows) => {
            res.render('./admin/manageAdmin', { title: "Manage admin", admins: rows });
        });
    } else {
        res.redirect('/home');
    }
});

// add admin
router.post('/add-admin', upload.single('TextImage'), function (req, res, next) {
    var email = req.body.textEmail;
    User.getUser(email, (err, rows) => {
        if (rows.length) {
            req.flash('emailExits', 'Email đã tồn tại');
            res.redirect('back');
        } else {
            var today = new Date();
            var user = {
                "id_level": 1,
                "name": req.body.textName,
                "email": req.body.textEmail,
                "phone": req.body.textPhone,
                "address": req.body.textAddress,
                "image": req.file.filename,
                "password": hash.generate(req.body.txt_mat_khau),
                "created_at": today,
                "updated_at": today
            }

            User.addUser(user, (err, rows) => {
                if (err) throw err;
                // req.session.addAdminSuccess = "Đã thêm tài khoản admin thành công";
                req.flash('add_admin_success', 'Thêm tài khoản admin thành công');
                res.redirect('back');
            });
        }
    });
});

// delete admin
router.get('/delete-admin/:id', function (req, res, next) {
    if ((req.session.loggin) && (req.session.level == 1)) {
        var id = req.params.id;
        User.deleteAdmin(id, (err, rows) => {
            if (err) throw err;
            req.flash('deleteAdminSuccess', 'Xóa admin thành công');
            res.redirect('back');
        });
    }else{
        res.redirect('/home');
    }
});

// manage products
router.get('/manage-product', function (req, res, next) {
    if((req.session.loggin) && (req.session.level == 1)){
        res.render('./admin/manageProducts', { title: "Manage products" });
    }else{
        res.redirect('/home');
    }
});

// manage members
router.get('/manage-member', function(req, res){
    if(req.session.loggin && (req.session.level == 1)){
        User.getUsers(3, (err, rows) => {
            if(err) throw err;
            res.render('./admin/manageMember', { title: "Manage menmber", members: rows, pages: paginate.getArrayPages(req) });
        })
    }else{
        res.redirect('/home');
    }
});

router.get('/delete-all-member', function(req, res){
    allId = req.query.ids;
    console.log("id: " + allId);
});

// add member from file excel
router.post('/add-member-excel',upload.single('memberFileExcel'), (req, res) => {
    var fileName = req.file.path;
    var exceltojson;

    if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
        exceltojson = xlsxtojson;
    } else {
        exceltojson = xlstojson;
    }
    try {
        exceltojson({
            input: fileName, //the same path where we uploaded our file
            output: null, //since we don't need output.json
            lowerCaseHeaders:true
        }, function(err,result){
            if(err) {
                req.flash('excelError', 'lỗi');
                return res.redirect('back');
            }
            var today = new Date();
            result.forEach(results => {
                var pass = String(results.password);
                var user = {
                    "id_level": results.id_level,
                    "name": results.name,
                    "email": results.email,
                    "phone": results.phone,
                    "address": results.address,
                    "image": results.image,
                    "password": hash.generate(pass),
                    "created_at": today,
                    "updated_at": today
                }
                User.addUser(user, (err, rows) => {
                    if (err) throw err;
                });
            });
            req.flash('addProductExcelSuccess', 'Đã thêm thành viên từ file excel thành công');
            res.redirect('back');
        });
    } catch (e){
        res.redirect('CorutedExcel', 'File excel bị lỗi');
    }
});

// delete member
router.get('/delete-member/:id', function(req, res){
    if((req.session.loggin) && (req.session.level == 1)){
        var id = req.params.id;
        User.deleteAdmin(id, (err, rows) => {
            if(err) throw err;
            req.flash('deleteMemberSuccess', 'Đã xóa thành viên thành công');
            res.redirect('back');
        });
    }else{
        res.redirect('/home');
    }
});

module.exports = router;