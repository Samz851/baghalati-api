/**
* Name: clients.controller
*
* @author Samer Alotaibi
*		  sam@samiscoding.com
*
*
*
* Description: controller for clients
*
* Requirements: clients model
*
* @package
* @property
*
* @version 1.0
*/

const POSController = {};
const https = require('axios');
const qs = require('querystring');
const Bcrypt = require("bcryptjs");
const Admins = require('../models/admins');
const Products = require('../models/products');
const Categories = require('../models/categories');
const Tags = require('../models/tags');
const mongoose = require('mongoose');
const tokenURI = 'https://api.hikeup.com/oauth/token';
const authURI = 'https://api.hikeup.com/oauth/authorize';
const client_id =  'baghalati-1be96a0e45';
const client_secret = '452e2c42d33e48c9b755bdae9991ce46';
const redirect_uri = 'https://api.jubnawebaith.com/api/pos/hikeup-redirect';
const get_products_uri = 'https://api.hikeup.com/api/v1/products/get_all';
const get_product_types_uri = 'https://api.hikeup.com/api/v1/product_types/get_all';

const authorizeURI = (user_token) => {
    return `https://api.hikeup.com/oauth/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&state=${user_token}&scope=all`;
}

const getProducts = async (parameters, results, config, cb) =>{
  // console.log('Initial Arr');
  // console.log(results.length);
  try{
    let products = await https.get(get_products_uri + '?page_size=' + parameters.page_size + '&Skip_count=' + parameters.Skip_count, config);

    if(products.data.items){
      console.log('HIT!!!!');
      results = results.concat(products.data.items);
      parameters.Skip_count += 20;
      console.log('length so far!!!');
      console.log(results.length);
    }
    console.log(products.data.next);
    if(products.data.next !== null){
      console.log('doing it again');
      try{
        await getProducts(parameters, results, config, cb);
      }catch(e){
        throw e;
      }

    }
    else{
      console.log('tota products results!!!!!');
      console.log(results.length);
      cb(results);
      return results;
    }
  }catch(e){
    
    throw e;
    // throw e.response.status;
  }

  
}
var origURL = '';


POSController.authorize = async (req, res) => {
    const { user_token } = req.query;
    origURL = req.hostname + req.originalUrl;
    res.writeHead(301,
        {Location: authorizeURI(user_token)}
    );
    res.end();
  
  
};

POSController.redirect = async (req, res) => {
    if(!req.query.error){
        const { code, state } = req.query;
        console.log(`CODE: ${code}`);
        console.log(`STATE: ${state}`);

         let requestB = {
            client_id: client_id,
            client_secret: client_secret,
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
          }
        
        const config = {
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          }
        }
        
        https.post(tokenURI, qs.stringify(requestB), config)
          .then(async (result) => {
            // Do somthing
            if(result.data){
              Admins.findOne({session_id: state}, function(err, user){
                console.log(user);
                if(user){
                  user.pos_data = {...result.data};
                  user.is_connected = true
                  user.save();
                  res.writeHead(301,
                    {Location: 'https://admin.jubnawebaith.com/dashboard?synched=true'}
                  );
                  res.end();
                }else{
                  res.json({success: false, message: 'Failed to save user access token', error:err});
                }
              });
            }
          })
          .catch((err) => {
            // Do somthing
            console.log("HIKEUP AUTH ERROR:::::");
            console.log(err);
          })
    }
}

POSController.refreshToken = async (req, res) => {
  const { id } = req.query;
  try{
    let user = await Admins.findOne({session_id: id});
    if(user){
      const { pos_data } = user;
      let requestB = {
        client_id: client_id,
        client_secret: client_secret,
        refresh_token: pos_data.refresh_token,
        grant_type: 'refresh_token'
      }

      const config = {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      }

      try{
        let refresh = await https.post(tokenURI, qs.stringify(requestB), config);
        user.pos_data = refresh.data;
        user.save();
        res.json({success: true, message: 'Successfully refreshed token'})
      }catch(err){
        res.json({success: false, message: 'Failed to refresh token'});
      }
      
    }
  }catch(err){
    res.json({success: false, message: 'Failed to locate user'})
  }

}

POSController.getProducts = async (req, res) => {
  console.log('This is something');
  const { page, id } = req.query;

  let user = await Admins.findOne({session_id: id}, 'pos_data');

  if(user){
    //Try fetching
    const config = {
      headers: {
        'Authorization': 'Bearer ' + user.pos_data.access_token
      } 
    }
    const params= {
      page_size: 20,
      Skip_count: page == 0 ? 0 : page * 20
    }

    try {
      let products = await https.get(get_products_uri + '?page_size=' + params.page_size + '&Skip_count=' + params.Skip_count, config);
      if(products.data.items){
        res.json({
          success: true,
          result: products.data.items,
          next: products.data.next,
          total: products.data.totalCount
        });
      }

    } catch(error) {
      if(error){
        res.json({
          success: false,
          error: error.response.status
        })
      }
    }
  }else{
    res.json({success: false, message: 'User not found'});
  }

}

POSController.syncTags = async (req, res) => {
  const { array } = req.body;
  array.forEach(async (tag) => {
      let tagM = new Tags({name: tag});
      await tagM.save();
  });
  res.json({success: true})
}

POSController.syncInventory = async (req, res) => {
  console.log(req.body);
  const { id, override, password } = req.body;
  console.log(`Session id: ${id}`);
  let user = await Admins.findOne({session_id: id});
  console.log(user);
  if(Bcrypt.compareSync(password, user.password)){
    if(override) {
      await Products.deleteMany({});
      await Categories.deleteMany({});
    }
    //First get Categirues

    const config = {
      headers: {
        'Authorization': 'Bearer ' + user.pos_data.access_token
      } 
    }
    const params= {
      page_size: 70,
      Skip_count: 0 
    }

    try{
      let categories = await https.get(get_product_types_uri + '?page_size=' + params.page_size + '&Skip_count=' + params.Skip_count, config);

      if(categories.data.items){
        categories.data.items.forEach(async (item) => {
          const { name, description, isActive, id } = item
          let nCat = new Categories({name: name, description: description, isActive: isActive, id: id});
          nCat = await nCat.save();
        });
      }else{
        console.log('No Categories retrieved');
        res.json({success: false, line: 218});
      }
    }catch(error){
      console.log('Error fetching Categories');
      res.json({success: false, line: 222});
    }
    let results = [];

    try{
      let parameters= {
        page_size: 20,
        Skip_count: 0 
      }

      let products = await getProducts(parameters);


      // let tag, category;
      results.forEach(async (product) => {
        try{
          var tag = await Tags.findOne({name: product.product_tags[0].name.replace(' Center', '')});
          if(tag == null){
            console.log('Tag name');
            console.log(product.product_tags[0].name.replace(' Center', ''));
          }
        }catch(error){
          console.log('Error fetching tag');
          console.log(error);
        }

        try{
          var category = await Categories.findOne({name: product.product_type[0].type_name})
        }catch(error){
          console.log('Error fetching category');
          console.log(error);
        }

        let obj = {
          parentId: product.parentId,
          name: product.name,
          description: product.description,
          sku: product.sku,
          primary_image: product.primary_image,
          bran_name: product.bran_name,
          product_tags:[tag._id],
          product_type:[category._id],
          price: { 
              price_ex_tax: product.product_outlets[0].price_ex_tax,
              tax_rate:product.product_outlets[0].tax_rate,
              price_inc_tax:product.product_outlets[0].price_inc_tax,
          },
          isActive: product.isActive,
        }

        try{
          let nProduct = new Products({...obj});
          await nProduct.save();
        }catch(error){
          console.log('Error saving product');
          console.log(error);
        }
      });
      res.json({success: true})
    }catch(error){
      console.log('Error fetching products');
      console.log(error);
      res.json({success: false, line: 311});
    }

  }else{
    res.json({success: false, line: 315})
  }

  //fetch products
}

POSController.fetchNewProducts = async (req, res) => {
  console.log('UPDATING INVENTORY')
  const { ID } = req.params;

  let user = await Admins.findOne({session_id: ID});

  let inventory = await Products.find({}).select('sku -_id');
  let localInventory = inventory.map(pro => pro.sku);

  let results = [];
  let parameters= {
    page_size: 20,
    Skip_count: 0 
  }

  const config = {
    headers: {
      'Authorization': 'Bearer ' + user.pos_data.access_token
    } 
  }

  let updateArr = [];

  try{
    let products = await getProducts(parameters, results, config, function(d){results = d;});
    console.log('RESULT IS::::::');
    console.log(results.length);
    if(results.length > 0){
      results.forEach(item => {
        if(!localInventory.includes(parseInt(item.sku))){
          updateArr.push(item);
        }
      })
    }

    if(updateArr.length > 0){
      updateArr.forEach( async (prod) => {
        console.log('Product is::::');
        console.log(prod.product_type[0].type_name);

        let prodCat = prod.product_type[0].type_name;
        let tagName = prod.product_tags[0].name;
        let CatExist = await Categories.find({name: prodCat});
        let catID, tagID;
        let TagExist = await Tags.find({name: tagName});
        console.log(CatExist.length);
        if(CatExist.length == 0 ){
          console.log(prodCat);
          let nCat = new Categories({name: prodCat, description: '', isActive: true, id: prod.product_type[0].type_id});
          nCat = await nCat.save();
          catID = nCat._id;
          console.log(nCat._id);
        }else{
          catID = CatExist._id;
        }

        if(TagExist.length == 0){
          let tagM = new Tags({name: tagName});
          await tagM.save();
          tagID = tagM._id;
        }else{
          tagID = TagExist._id;
        }
        let obj = {
          parentId: prod.parentId,
          name: prod.name,
          description: prod.description,
          sku: prod.sku,
          primary_image: prod.primary_image,
          bran_name: prod.bran_name,
          product_tags:[tagID],
          product_type:[catID],
          price: { 
              price_ex_tax: prod.product_outlets[0].price_ex_tax,
              tax_rate:prod.product_outlets[0].tax_rate,
              price_inc_tax:prod.product_outlets[0].price_inc_tax,
          },
          isActive: prod.isActive,
        }
        
        try{
          let nProduct = new Products({...obj});
          await nProduct.save();
          res.json({success: true, message: `Successfully updated ${updateArr.length} new products`});
        }catch(error){
          console.log('Error saving product');
          console.log(error);
          res.json({success: false, message: 'Error saving product'});
        }
      })
    }
  }catch(e){
    console.log( e );
    res.json({succesS: false, message: e});
  }


  // results.forEach


}

POSController.updateLocalProducts = async (req, res) => {
  console.log('UPDATING INVENTORY')
  const { ID } = req.params;
   
  let user = await Admins.findOne({session_id: ID});

  let inventory = await Products.find({}).select('sku -_id');
  let localInventory = inventory.map(pro => pro.sku);

  let results = [];
  let parameters= {
    page_size: 20,
    Skip_count: 0,
    Sync_From: user.pos_data.lastUpdate
  }

  const config = {
    headers: {
      'Authorization': 'Bearer ' + user.pos_data.access_token
    } 
  }

  let updateArr = [];

  try{
    let products = await getProducts(parameters, results, config, function(d){results = d;});
    // console.log('RESULT IS::::::');
    // console.log(results);
    if(results.length > 0){
      results.forEach( async (prod) => {
        let prodCat = prod.product_type[0].type_name;
        let tagName = prod.product_tags[0].name;
        let CatExist = await Categories.findOne({name: prodCat});
        let catID, tagID;
        let TagExist = await Tags.findOne({name: tagName});
        
        if(CatExist.length == 0 ){
          let nCat = new Categories({name: prodCat, description: '', isActive: true, id: prod.product_type[0].type_id});
          nCat = await nCat.save();
          catID = nCat._id;
        }else{
          console.log('Check this!!!');
          // console.log(CatExist);
          console.log(CatExist._id);
          catID = CatExist._id;
        }

        if(TagExist.length == 0){
          let tagM = new Tags({name: tagName});
          await tagM.save();
          tagID = tagM._id;
        }else{
          console.log(TagExist);
          tagID = TagExist._id;
        }
        let obj = {
          bran_name: prod.bran_name,
          product_tags:[mongoose.Types.ObjectId(tagID)],
          product_type:[mongoose.Types.ObjectId(catID)],
          price: { 
              price_ex_tax: prod.product_outlets[0].price_ex_tax,
              tax_rate:prod.product_outlets[0].tax_rate,
              price_inc_tax:prod.product_outlets[0].price_inc_tax,
          },
          isActive: prod.isActive,
        }
        console.log(`Product Category Name is:${tagID} and ${catID}`);
        try{
          let nProduct = await Products.findOneAndUpdate({sku: parseInt(prod.sku)}, {$set: {...obj}});
        }catch(error){
          res.json({success: false, message: 'Error saving product'});
        }
      });
      res.json({success: true, message: `Successfully updated ${updateArr.length} new products`});
    }

  }catch(e){
    res.json({success: false, message: e.message});
  }

}

module.exports = POSController;

/** this ends this file
* server/controllers/clients.controller
**/
