"use strict";

var Product = require('../models/product');

var formidable = require('formidable');

var _ = require('lodash');

var fs = require('fs');

var _require = require('../helpers/dbErrorHandler'),
    errorHandler = _require.errorHandler; //ANCHOR Product By Id


exports.productById = function (req, res, next, id) {
  Product.findById(id).exec(function (error, product) {
    if (error || !product) {
      return res.status(400).json({
        error: 'Product not found'
      });
    }

    req.product = product;
    next();
  });
}; //ANCHOR Create Product


exports.create = function (req, res) {
  var form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, function (error, fields, files) {
    if (error) {
      return res.status(400).json({
        error: 'Image could not be uploaded'
      });
    }

    var name = fields.name,
        description = fields.description,
        price = fields.price,
        category = fields.category,
        quantity = fields.quantity;

    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    var product = new Product(fields);

    if (files.photo) {
      if (files.photo.size > 90000) {
        return res.status(400).json({
          error: 'Photo must be less than 90k'
        });
      } else if (files.photo.size === 0) {
        return res.status(400).json({
          error: 'You should upload an image'
        });
      }

      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save(function (error, result) {
      if (error) {
        return res.status(400).json({
          error: errorHandler(error)
        });
      }

      res.json(result);
    });
  });
}; //ANCHOR Read


exports.read = function (req, res) {
  req.product.photo = undefined;
  return res.json(req.product);
}; //ANCHOR Update


exports.update = function (req, res) {
  var form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, function (error, fields, files) {
    if (error) {
      return res.status(400).json({
        error: 'Image could not be uploaded'
      });
    }

    var name = fields.name,
        description = fields.description,
        price = fields.price,
        category = fields.category,
        quantity = fields.quantity;

    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    var product = req.product;
    console.log('Before product: ', product);
    console.log('Fields: ', fields);
    product = _.extend(product, fields);
    console.log('After product: ', product);

    if (files.photo) {
      if (files.photo.size > 90000) {
        return res.status(400).json({
          error: 'Photo must be less than 90k'
        });
      } else if (files.photo.size === 0) {
        return res.status(400).json({
          error: 'You should upload an image'
        });
      }

      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save(function (error, result) {
      if (error) {
        return res.status(400).json({
          error: errorHandler(error)
        });
      }

      res.json({
        result: result
      });
    });
  });
}; //ANCHOR Remove


exports.remove = function (req, res) {
  var product = req.product;
  product.remove(function (error, deletedProduct) {
    if (error) {
      return res.status(400).json({
        error: errorHandler(error)
      });
    }

    res.json({
      Message: "Produt ".concat(deletedProduct.name, " was deleted successfully")
    });
  });
}; //ANCHOR List


exports.list = function (req, res) {
  var order = req.query.order ? req.query.order : 'asc';
  var sortBy = req.query.sortBy ? req.query.sortBy : '_id';
  var limit = req.query.limit ? parseInt(req.query.limit) : 6;
  Product.find().select('-photo').populate('category').sort([[sortBy, order]]).limit(limit).exec(function (error, data) {
    if (error) {
      return res.status(400).json({
        error: 'Product not found'
      });
    }

    res.send(data);
  });
}; //ANCHOR Product Related


exports.listRelated = function (req, res) {
  var limit = req.query.limit ? parseInt(req.query.limit) : 6;
  Product.find({
    _id: {
      $ne: req.product
    },
    category: req.product.category
  }).limit(limit).populate('category', '_id name').exec(function (error, data) {
    if (error) {
      return res.status(400).json({
        error: 'Product not found'
      });
    }

    res.json(data);
  });
}; //ANCHOR List Categories


exports.listCategories = function (req, res) {
  Product.distinct('categoy', {}, function (error, categories) {
    if (error) {
      return res.status(400).json({
        error: 'Categories not found'
      });
    }

    res.json(categories);
  });
}; //ANCHOR List By Search


exports.listBySearch = function (req, res) {
  var order = req.body.order ? req.body.order : 'desc';
  var sortBy = req.body.sortBy ? req.body.sortBy : '_id';
  var limit = req.body.limit ? parseInt(req.body.limit) : 100;
  var skip = parseInt(req.body.skip);
  var findArgs = {};

  for (var key in req.body.filters) {
    if (req.body.filters[key].lenght > 0) {
      if (key === 'price') {
        findArgs[key] = {
          $gte: req.bodu.filters[0],
          $lte: req.body.filters[1]
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Product.find(findArgs).select('-photo').populate('categories').sort([[sortBy, order]]).skip(skip).limit(limit).exec(function (error, data) {
    if (error) {
      return req.status(400).json({
        error: 'Product not found'
      });
    }

    res.json({
      size: data.length,
      data: data
    });
  });
};