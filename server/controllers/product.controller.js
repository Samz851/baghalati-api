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
const excelToJson = require('convert-excel-to-json');

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
    let tags = await Tags.find({});
    if(tags){
        tags.forEach(( item ) => {
            item.img = 'https://api.jubnawebaith.com/uploads/categories/' + item.name.replace(/ /g, '-') + '.png';
        });
        res.json({success: true, categories: tags});
    }else{
        res.json({success: false})
    }
};

// productController.arabizeTags = async (req, res) => {
//     const { array } = req.body;
//     console.log(typeof req.body.array);
//     for (var item in array){
//         // console.log(`Key: ${item} and Value: ${array[item]}`);
//         try{
//             let tag = await Product.findOne({ sku: parseInt(item) });
//             if(tag){
//                 tag.name_ar = array[item];
//                 await tag.save();
//             } 
//         }catch(error){
//             console.log(`Error item: ${item} and value is: ${array[item]}`)
//             throw error;
//         }
//     }
// }

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
    let products = await Product.find({}).select('name barcode sku');

    products.forEach(product => {
        fs.rename(`${__dirname}/../uploads/products/${product.barcode}.${/\.(jpg|jpeg|png|jfif)/}`, `${__dirname}/../uploads/products/${product.sku}.jpg`, function(err) {
            if ( err ) {
                res.json({success: false, error: err});
            }else{
                res.json({success: true, message: 'Product Images fixed'});
            }
        });
    })
};

productController.brokenStock = async (req, res) => {
    const broken = await Product.find( { $where: "this.broken_stock >= this.stock" } );

    res.json(broken);
};

productController.uploadImport = async(req, res) => {
    const { SID } = req.body;

    const form = formidable();

    form.parse(req, async (err, fields, files) => {
        if(files.file){
            await Product.deleteMany({});
            await Categories.deleteMany({});
            await Tags.deleteMany({});
            console.log(files.file.path);
            const result = excelToJson({
                source: fs.readFileSync(files.file.path), // fs.readFileSync return a Buffer
                header:{
                    rows: 1
                },
                sheets: ['Product'],
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

                }
            });
            console.log(typeof result);
            let keysArr = Object.values(result);
            let productObjs = keysArr[0].map(async (product)=>{
                // console.log(`PRODUCT OBJECT IS ${typeof product}`);
                var tag = await Tags.findOne({name: product['Product tag']}).exec();
                if(!tag){
                  tag = new Tags({name: product['Product tag']});
                  try{
                    await tag.save();
                    var tag = await Tags.findOne({name: product['Product tag']}).exec();
                  }catch(err){
                    var tag = await Tags.findOne({name: product['Product tag']}).exec();
                  }
                }
                var category = await Categories.findOne({name: product['Product type']}).exec();
                if(!category){
                  category = new Categories({name: product['Product type'], isActive: true});
                  try{
                    await category.save();
                  }catch(err){
                      category = await Categories.findOne({name: product['Product type']}).exec();
                  }
                }
                let obj = {
                    parentId: product['parentId'] && product['parentId'],
                    name: product['Name'] && product['Name'],
                    description: product['Description'] && product['Description'],
                    sku: product['SKU'] && product['SKU'],
                    primary_image: product.primary_image && product.primary_image,
                    brand_name: product['Brand name'] && product['Brand name'],
                    barcode: product['Barcode'],
                    product_tags:[tag._id],
                    product_type:[category._id],
                    price: { 
                        price_ex_tax: product['Price Excluding Tax'],
                        tax_rate: 0.15,
                        price_inc_tax:product['Retail price'],
                    },
                    isActive: product['Active'] == 'TRUE' ? true : false
                  };
                  try{
                      let nProduct = new Product({...obj});
                      await nProduct.save();
                    }catch(error){
                      throw error;
                    }
                return obj;
            });
            res.json({success: true, message: 'Import complete'});
        }
    })
}

module.exports = productController;

/** this ends this file
* server/controllers/product.controller
**/
