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

productController.getProducts = async (req, res) => {
    const { page, offset, limit, cat } = req.query;
    console.log(`page is: ${page} and offset: ${offset} and cat is: ${cat}`);
    let config = { limit: limit ? parseInt(limit) : 20, skip: parseInt(offset) };
    let query = cat !== 'all' ? {product_tags: { $in: cat }} : {}
    try{
        let count = await Product.countDocuments(query);
        try{
            let products = await Product.find(query, null, config);
            if(products){
                products.forEach(( item ) => {
                    item.primary_image = 'https://api.jubnawebaith.com/uploads/products/' + item.name.replace(/ /g, '-') + '.jpg';
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
                    item.primary_image = 'https://api.jubnawebaith.com/uploads/products/' + item.name.replace(/ /g, '-') + '.jpg';
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
}
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
}

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
    const { id } = req.params;

    const product = {
        code: req.body.code,
        description: req.body.description,
        size: req.body.size,
        weight: req.body.weight,
        price: req.body.price,
        discount: req.body.discount,
        on_sale: req.body.on_sale,
        active: req.body.active,
        stock: req.body.stock,
        broken_stock: req.body.broken_stock,
        to_serve: req.body.to_serve,
        to_receive: req.body.to_receive,
        ubication: req.body.ubication,
        images: req.body.images
    };

    await Product.findByIdAndUpdate(id, {$set: product}, {new: true});

    res.json({"status":"200"});
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
            product.primary_image = 'https://api.jubnawebaith.com/uploads/products/' + product.name.replace(/ /g, '-') + '.jpg'
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

productController.brokenStock = async (req, res) => {
    const broken = await Product.find( { $where: "this.broken_stock >= this.stock" } );

    res.json(broken);
};
    

module.exports = productController;

/** this ends this file
* server/controllers/product.controller
**/
