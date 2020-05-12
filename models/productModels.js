var DB = require('./connectDB');

var Product = {
    getAllProduct: (callback) => {
        var sql = 'SELECT * FROM products';
        return DB.query(sql, callback);
    },

    getProductByID: (id, callback) => {
        var sql = 'SELECT * FROM products WHERE id = ?';
        return DB.query(sql,[id],callback);
    },

    getProductByIdType: (idType, callback) => {
        var sql = 'SELECT * FROM products WHERE id_type = ? LIMIT 4';
        return DB.query(sql, [idType], callback);
    },

    getFirmProduct: (idType, callback) => {
        var sql = 'SELECT DISTINCT firm FROM products WHERE id_type = ?';
        return DB.query(sql,[idType], callback);
    },

    getTypeNameProduct: (idType, callback) => {
        var sql = 'SELECT type_name FROM type_products WHERE id =?';
        return DB.query(sql, [idType], callback);
    },

    getTheSameProduct: (typeProductName, callback) => {
        var sql = 'SELECT * FROM products, type_products WHERE type_products.type_name = ? LIMIT 4';
        return DB.query(sql, [typeProductName], callback);
    },

    getTheSameFirmProduct: (firm, callback) => {
        var sql = 'SELECT * FROM products WHERE firm = ? LIMIT 4';
        return DB.query(sql, [firm], callback);
    },

    theSameProductFirm: (id, callback) => {
        var sql = 'CALL theSameProductFirm(?)';
        return DB.query(sql, [id], callback);
    },

    searchProduct: (key, callback) => {
        var sql = 'SELECT * FROM products WHERE name LIKE "%?%"';
        return DB.query(sql, [key], callback);
    },

    addProduct: (product, callback) => {
        var sql = 'INSERT INTO products SET ?';
        return DB.query(sql, [product], callback);
    }
}

module.exports = Product;