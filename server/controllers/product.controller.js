/**
* Name: product.controller
*
* @author Samer Alotaibi
*		  sam@samiscoding.com
*
*
*
* Description:
*
* Requirements:
*
* @package
* @property
*
* @version 1.0
*/

const productController = {};
const Product = require('../models/products');
const Tags = require('../models/tags');
const Categories = require('../models/categories');
const fs = require('fs');
const formidable = require('formidable');
const Coupons = require('../models/coupons');
const excelToJson = require('convert-excel-to-json');
const sharp = require("sharp");
const { json } = require('express');

productController.getProducts = async (req, res) => {
    const { page, offset, limit, cat } = req.query;
    console.log(`page is: ${page} and offset: ${offset} and cat is: ${cat}`);
    let config = { limit: limit ? parseInt(limit) : 20, skip: parseInt(offset) };
    let query = cat !== 'all' ? {product_tags: { $in: cat }} : {}
    try{
        let count = await Product.countDocuments(query);
        console.log(query)
        try{
            let products = await Product.find(query, null, config);
            if(products){
                products.forEach(( item ) => {
                    item.primary_image = 'https://api.jubnawebaith.com/uploads/products/' + item.sku + '.jpg';
                });
                res.json({success: true, result: products, total: count});
            }else{
                res.json({success: false})
            }
        }catch(error){
            console.log(error);
        }
    }catch(error){
        console.log(error);
    }

};

productController.getProductsByIDs = async (req, res) => {
    const { ids } = req.body;
    if(Array.isArray( ids )){
        try{
            let products = await Product.find({'_id': { $in: ids }}).exec();
            if(products){
                products.forEach(( item ) => {
                    item.primary_image = 'https://api.jubnawebaith.com/uploads/products/' + item.sku + '.jpg';
                });
                res.json({success: true, favorites: products});
            }else{
                res.json({success: false})
            }
        }catch(error){
            console.log(error);
        }
    }else{
        
    }
};

productController.getTags = async (req, res) => {
    const { os } = req.query;
    const path = `${__dirname}/../uploads/tags/`;
    let tags = await Tags.find({});
    if(tags){
        tags.forEach(( item ) => {
            if(os == 'ios'){
                fs.readdir(path, (err, files) => {
                    files.forEach(file => {
                      if(file == item.id + '.png'){
                        item.img = 'https://api.jubnawebaith.com/uploads/tags/' + item.id + '.png';
                      }else{
                        sharp("file.svg")
                            .png()
                            .toFile(path + item.id + '.png')
                            .then(function(info) {
                                console.log('INFO--------');
                                console.log(info);
                                item.img = 'https://api.jubnawebaith.com/uploads/tags/' + item.id + '.png';
                            })
                            .catch(function(err) {
                                console.log(err)
                            })
                      }
                    });
                  });
            }else{
                item.img = 'https://api.jubnawebaith.com/uploads/tags/' + item.id + '.svg';
            }
        });
        res.json({success: true, categories: tags});
    }else{
        res.json({success: false})
    }
};

productController.searchProducts = async (req, res) => {
    console.log('HEREEEE')
    const { term, cat } = req.query;
    try{
        let options = cat !== 'all' ? {product_tags: { $in: cat }} : {}
        let products = await Product.fuzzySearch(term, options);
        if(products){
            res.json({
                success: true,
                products: products
            })
        }
    }catch(error){
        res.json({
            success: false,
            error: error
        })
    }

}

productController.getCount = async (req, res) => {
    const count = await Product.countDocuments();

    res.json(count);
};

productController.createProduct = async (req, res) => {
    const product = new Product(req.body);

    await product.save( err => {
        if (err) 
        {
            res.json({"error": err});
        }
        else 
        {
            res.json({"status": "200"});
        }
    });
};

productController.editProduct = async (req, res) => {
    // const { id } = req.params;
    const { _id, name, name_ar, sku, description} = req.body;

    // const form = formidable({ uploadDir: 'D:\\Desktop\\WORK\\tmp' });

    //PRODUCTION
    const form = formidable();

    form.parse(req, (err, fields, files) => {
        let product = Product.findById(fields._id, (err, prod) => {
            if(files.file){
                var oldpath = files.file.path;
                var oldFile = `${__dirname}/../uploads/products/${prod.sku}.jpg`;
                if (fs.existsSync(oldFile)) {
                    //file exists
                    fs.unlinkSync(oldFile);
                  }
                var newpath = `${__dirname}/../uploads/products/${prod.sku}${files.file.name.substr(files.file.name.lastIndexOf('.') + 1)}`;
                fs.rename(oldpath, newpath, function (err) {
                  if (err) throw err;
                  res.end();
                });
            }
            const {name, name_ar, description} = fields;
            if(name){
                prod.name = name;
            }
            if(name_ar){
                prod.name_ar = name_ar;
            }
            if(description){
                prod.description = description;
            }
            prod.save();
            res.json({success: true, message: 'Product Updated'});
            // product.save();
        })

    });
    // const product = {
    //     code: req.body.code,
    //     description: req.body.description,
    //     size: req.body.size,
    //     weight: req.body.weight,
    //     price: req.body.price,
    //     discount: req.body.discount,
    //     on_sale: req.body.on_sale,
    //     active: req.body.active,
    //     stock: req.body.stock,
    //     broken_stock: req.body.broken_stock,
    //     to_serve: req.body.to_serve,
    //     to_receive: req.body.to_receive,
    //     ubication: req.body.ubication,
    //     images: req.body.images
    // };

    // await Product.findByIdAndUpdate(id, {$set: product}, {new: true});
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // res.header("Content-Type", 'application/json');
    // res.json(JSON.stringify(req.body));
};

productController.getActives = async (req, res) => {
    const products = await Product.find({"active": true});

    res.json(products);
};

productController.getInactives = async (req, res) => {
    const products = await Product.find({ "active": false });

    res.json(products);
};

productController.getActivesCount = async (req, res) => {
    const products = await Product.find({"active": true}).countDocuments();

    res.json(products);
};

productController.getInactivesCount = async (req, res) => {
    const products = await Product.find({ "active": false }).countDocuments();

    res.json(products);
};

productController.getProduct = async (req, res) => {
    const { id } = req.params;
    try{
        const product = await Product.findById(id).populate('product_tags').populate('product_type').exec();
        if(product){
            product.primary_image = 'https://api.jubnawebaith.com/uploads/products/' + product.sku + '.jpg';
        }
        res.json({success: true, product: product});
    }catch(err){
        res.json({success: false, error: err})
    }
};

productController.deleteProduct = async (req, res) => {
    const { id } = req.params;

    await Product.findByIdAndRemove(id);

    res.json({"status": "200"});
};

productController.activateProduct = async (req, res) => {
    console.log(req.params);
    const { id } = req.params;

    await Product.update({_id: id}, {$set: {active: true}}, () => {
        res.json({"status":"200"});
    });
};

productController.deactivateProduct = async (req, res) => {
    console.log(req.params);
    const { id } = req.params;

    await Product.update({ _id: id }, { $set: { active: false } }, () => {
        res.json({ "status": "200" });
    });
};

productController.addImage = async (req, res) => {
    const { id } = req.params;
    
    const image = {
        image: req.body.image
    };
    const product = await Product.findById(req.params.id);
    
    product.images.push(image);
    await product.save( (err) => {
        if(err) {
            res.json(err);
        }
        else {
            res.json({"status": "200"});
        }
    });
    
};

productController.setProductImages = async (req, res) => {
    fs.readdir(`${__dirname}/../uploads/products`, (err, files) => { 
        if (err) 
          res.json({success: false, error: err}); 
        else { 
          files.forEach(file => { 
            let barcode = file.replace(/(.jpg|.jpeg|.png|.jfif)/, '');
            let product = Product.findOne({barcode: barcode}, function(err, product){
                fs.rename(`${__dirname}/../uploads/products/${file}`, `${__dirname}/../uploads/products/${product.sku}.jpg`, function(err) {
                    if ( err ) {
                        res.json({success: false, error: err})
                    };
                });
                product.primary_image = `https://api.jubnawebaith.com/uploads/products/${product.sku}.jpg`;
                product.save();
            })
          });
          res.json({success: true, message: 'Images Set Properly'});
        } 
    }) 
};

productController.brokenStock = async (req, res) => {
    const broken = await Product.find( { $where: "this.broken_stock >= this.stock" } );

    res.json(broken);
};

productController.uploadImport = async(req, res) => {
    const { SID } = req.body;

    const form = formidable();
    var counter = 1;
    form.parse(req, async (err, fields, files) => {
        if(files.file){
            await Product.deleteMany({});
            // await Categories.deleteMany({});
            // await Tags.deleteMany({});
            const result = excelToJson({
                source: fs.readFileSync(files.file.path), // fs.readFileSync return a Buffer
                header:{
                    rows: 1
                },
                // sheets: ['Product'],
                columnToKey: {
                    'A': '{{A1}}',
                    'B': '{{B1}}',
                    'C': '{{C1}}',
                    'D': '{{D1}}',
                    'E': '{{E1}}',
                    'F': '{{F1}}',
                    'G': '{{G1}}',
                    'H': '{{H1}}',
                    'I': '{{I1}}',
                    'J': '{{J1}}',
                    'K': '{{K1}}',
                    'L': '{{L1}}',
                    'M': '{{M1}}',
                    'N': '{{N1}}',
                    'O': '{{O1}}',
                    'P': '{{P1}}',
                    'Q': '{{Q1}}',
                    'R': '{{R1}}',
                    'S': '{{S1}}',
                    'T': '{{T1}}',
                    'U': '{{U1}}',
                    'V': '{{V1}}',
                    'W': '{{W1}}',
                    'X': '{{X1}}',
                    'Y': '{{Y1}}',
                    'Z': '{{Z1}}',
                    'AA': '{{AA1}}',
                    'AB': '{{AB1}}',
                    'AC': '{{AC1}}',
                    'AD': '{{AD1}}',
                    'AE': '{{AE1}}',
                    'AF': '{{AF1}}',
                    'AG': '{{AG1}}',
                    'AH': '{{AH1}}',
                    'AI': '{{AI1}}',
                    'AJ': '{{AJ1}}',
                    'AK': '{{AK1}}',
                    'AL': '{{AL1}}',
                    'AM': '{{AM1}}',
                    'AN': '{{AN1}}',
                    'AO': '{{AO1}}',
                    'AP': '{{AP1}}',
                    'AQ': '{{AQ1}}',
                    'AR': '{{AR1}}',
                    'AS': '{{AS1}}'

                }
            });
            // console.log(Object.values(result.Product));
            let valArr = Object.values(result.Product);
            for await (const product of valArr){
                let CatExist = await Categories.find({name: product['Product type']}).exec();
                let catID, tagID;
                let TagExist = await Tags.find({name: product['Product tag']}).exec();
                console.log(CatExist.length);
                if(CatExist.length == 0 ){
                  let nCat = new Categories({name: product['Product type'], name_eng: product['Product type_eng'], isActive: true});
                  try{
                      nCat = await nCat.save();
                      catID = nCat._id;
                  }catch(err){
                      console.log('ERROR CATEGORY SAVE !!!!!');
                      let CatExist = await Categories.find({name: product['Product type']}).exec();
                      catID = CatExist._doc._id;
                      console.log(catID);
                  }
                  
                }else{
                  catID = CatExist[0]._doc._id;
                //   console.log('Cat ID is:');
                //   console.log(CatExist)
                }
        
                if(TagExist.length == 0){
                  let tagM = new Tags({name: product['Product tag'], name_eng: product['Product tag_eng']});
                  await tagM.save();
                  tagID = tagM._id;
                }else{
                  tagID = TagExist[0]._doc._id;
                //   console.log('Tag ID is:');
                //   console.log(TagExist)
                }
                let obj = {
                        parentId: product['parentId'] && product['parentId'],
                        name: product['Name'] && product['Name'],
                        name_eng: product['Name_eng'] && product['Name_eng'],
                        description: product['Description'] && product['Description'],
                        sku: product['SKU'] && product['SKU'],
                        primary_image: product['Image URL'] && product['Image URL'],
                        brand_name: product['Brand name'] && product['Brand name'],
                        brand_name_eng: product['Brand name_eng'] && product['Brand name_eng'],
                        barcode: product['Barcode'],
                        product_tags:[tagID],
                        product_type:[catID],
                        price: { 
                            price_ex_tax: product['Price Excluding Tax'],
                            tax_rate: 0.15,
                            price_inc_tax:product['Retail price'],
                        },
                        isActive: product['Active'] == 'TRUE' ? true : false
                    };
                
                try{
                    let nProduct = new Product({...obj});
                    nProduct.save();
                }catch(error){
                    throw error;
                }
            }
            res.json({success: true, message: 'Import complete'});
        }
    })
}

productController.checkCoupon = async(req, res) => {
    const {code, id} = req.query;
    let coupon = await Coupons.findOne({code:code});
    let record = {...coupon._doc};
    if(record){
        //check if expired
        if(Date.now() > new Date(record.end_datetime)){
            res.json({success: false, message: 'Expired'});
            return;
        }
        if(record.coupon_type == 'single'){
            //Check if user used this coupon before
            if(record.used_customers.includes(id)){
                res.json({success: false, message: 'Used'});
                return;
            }
        }
        console.log('success!');
        console.log(coupon);
        console.log(record);
        res.json({success:true, rate: record.rate, id: record._id});
    }else{
        res.json({success: false, message: 'wrong'});
    }
}
module.exports = productController;

/** this ends this file
* server/controllers/product.controller
**/
