const Product = require('../models/product');
const ProductDetail = require('../models/productDetail');
const productQuery = require('../utils/productQuery');
const mysql = require('../utils/mysql');
const Holidays = require('date-holidays');
const moment = require('moment');
const jsonWebToken = require('../utils/jsonwebtoken');
const userQuery = require('../utils/userQuery');


const productController = {
   createProduct: async (req, res) => {
      try {
         let productPhoto = req.files['productPhoto'];
         let productPhoto11 = req.files['productPhoto11'];
         let productPhoto11Result = (typeof productPhoto11 === 'undefined');
         let productDetailPhoto = req.files['productDetailPhoto'];
         let productHighlightPhoto = req.files['productHighlightPhoto'];
         let productPolicyPhoto = req.files['productPolicyPhoto'];
         let productHighlightPhotoResult = (typeof productHighlightPhoto === 'undefined');
         let productPolicyPhotoResult = (typeof productPolicyPhoto === 'undefined');
         let productDetailType = req.body.productDetailType;
         let productDetailAge = req.body.productDetailAge;
         let productDetailPrice = req.body.productDetailPrice;
         let productSelectType = req.body.productSelectType;
         
         let productType;
         if(req.body.productType == 'Tour') {
            productType = 3;
         } else if (req.body.productType == 'Ticket'){
            productType = 1;
         } else {
            productType = 2;
         }
         let productPhoto11Path;
         let productCreate;
         if(productPhoto11Result == false) {
            let product = new Product({ 
               productName: req.body.productName, 
               productLocation: req.body.productLocation,
               productRate: req.body.productRate,
               productType: productType,
               productPrice: req.body.productPrice,
               productPhoto: 'https://drsqfxztu97m1.cloudfront.net/' + productPhoto[0].transforms[0].key,
               productPhotoRadtio: 'https://drsqfxztu97m1.cloudfront.net/' + productPhoto11[0].transforms[0].key
            });

            productCreate = await mysql.executeQuery(productQuery.createProductRatio, product);
         }else {
            let product = new Product({ 
               productName: req.body.productName, 
               productLocation: req.body.productLocation,
               productRate: req.body.productRate,
               productType: productType,
               productPrice: req.body.productPrice,
               productPhoto: 'https://drsqfxztu97m1.cloudfront.net/' + productPhoto[0].transforms[0].key
            });
            let productArray = [];
            let productData = [product.name, product.location, product.image,
                                        product.rate, product.type, product.price];
            productArray.push(productData);
            productCreate = await mysql.executeQuery(productQuery.createProduct, [productArray]);
         }
         let productSelectTypeStatus;
         if(productSelectType == 'All') {
            productSelectTypeStatus = 1;
         }else if(productSelectType == '요일'){
            productSelectTypeStatus = 2;
         }else {   
            productSelectTypeStatus = 3;
         }
         let productDetail = new ProductDetail({
            productDetailType: productSelectTypeStatus,
            productHighlight: req.body.productHighlight,
            productInfo: req.body.productInfo,
            productPolicy: req.body.productPolicy,
            productLat: req.body.productLat,
            productLon: req.body.productLon,
            productKoreaAd: req.body.productKoreaAd,
            productEnglishAd: req.body.productEnglishAd,
            productId: productCreate.insertId
         });
         
         let productImages = [];
         for(var i=0; i < productDetailPhoto.length; i++) {
            let productImage = ['https://drsqfxztu97m1.cloudfront.net/' + productDetailPhoto[i].transforms[0].key, productCreate.insertId];
            productImages.push(productImage);
         }
         let productHighlightImages = [];
         if(productHighlightPhotoResult == false){
            for(var i=0; i<productHighlightPhoto.length; i++) {
               let productHighlightImage = ['https://drsqfxztu97m1.cloudfront.net/' + productHighlightPhoto[i].transforms[0].key, productCreate.insertId];
               productHighlightImages.push(productHighlightImage);
            }
         }
         let productPolicyImages = [];
         if(productPolicyPhotoResult == false) {
            for(var i=0; i<productPolicyPhoto.length; i++) {
               let productPolicyImage = ['https://drsqfxztu97m1.cloudfront.net/' + productPolicyPhoto[i].transforms[0].key, productCreate.insertId];
               productPolicyImages.push(productPolicyImage);
            }
         }
         let productPrices = [];
         let productHolidays = [];
         let productDetailInfo = req.body.productDetail;
         let productDetailArray = [];
         for(var i=0; i<productDetailInfo.length; i++) {
            productDetailArray.push(JSON.parse(productDetailInfo[i]));
         }
         for(var i=0; i<productDetailArray.length; i++) {
            if(productDetailArray[i].productDetailHoliday != 0) {
               for(var j=0; j<productDetailArray[i].productDetailHoliday.length; j++) {
                  let dateday = new Date(productDetailArray[i].productDetailHoliday[j]);
                  let yearyear = dateday.getFullYear();
                  let monthmonth = dateday.getMonth()+1;
                  let dayday = dateday.getDate();
                  let yearmonthday = yearyear + "-" + monthmonth + "-" + dayday;
                  let productHoliday = [yearmonthday, productCreate.insertId];
                  productHolidays.push(productHoliday);
               }
            }
            let productPrice = [
               productDetailArray[i].productDetailType, 
               productDetailArray[i].productDetailAge, 
               productDetailArray[i].productDetailPrice, 
               productDetailArray[i].productDetailAddCost, 
               productCreate.insertId];
            productPrices.push(productPrice);
         }

         
         let productSelect = [];
         if(productType == 2 || productType == 3) {
            
            let productAllTimeJSON = req.body.productAllTime;
            let productAllTime = [];
            for(var i=0; i<productAllTimeJSON.length; i++) {
               productAllTime.push(JSON.parse(productAllTimeJSON[i]));
            }
            
            if(productSelectType == 'All') {
               for(var z=0; z<productAllTime.length; z++) {
                  for(var i=0; i<productAllTime[z].productHourMulti.length; i++) {
                     let hourMinute;
                     if(productAllTime[z].productMinute == 0) {
                        let minute = '0'+ productAllTime[z].productMinute;
                        hourMinute = productAllTime[z].productHourMulti[i] + ":" + minute;
                     }else {
                        hourMinute = productAllTime[z].productHourMulti[i] + ":" + productAllTime[z].productMinute;
                     }
                     let productSelectarray = [hourMinute, productCreate.insertId];
                     productSelect.push(productSelectarray);
                  }
               }
               let productCreateTimetableAll = await mysql.executeQuery(productQuery.createProductTimetableAll, [productSelect]);
            }
            else if(productSelectType == '요일') {
               for(var z=0; z<productAllTime.length; z++) {
                  for(var i=0; i<productAllTime[z].productHourMulti.length; i++) {
                     for(var j=0; j<productAllTime[z].productDayMulti.length; j++) {
                        let hourMinute;
                        if(productAllTime[z].productMinute == 0) {
                           let minute = '0'+ productAllTime[z].productMinute;
                           hourMinute = productAllTime[z].productHourMulti[i] + ":" + minute;
                        }else {
                           hourMinute = productAllTime[z].productHourMulti[i] + ":" + productAllTime[z].productMinute;
                        }
                        let monthmonth = productAllTime[z].productDayMulti[j];
                        let productDayArray = [monthmonth, hourMinute, productCreate.insertId];
                        productSelect.push(productDayArray);
                     }
                  }
               }
               let ProductCreateTimetableDay = await mysql.executeQuery(productQuery.createProductTimetableDay, [productSelect]); 
            }else {
               for(var z=0; z<productAllTime.length; z++) {
                  for(var i=0; i<productAllTime[z].productHourMulti.length; i++) {
                     for(var j=0; j<productAllTime[z].productTime.length; j++) {
                        let hourMinute;
                        if(productAllTime[z].productMinute == 0) {
                           let minute = '0'+ productAllTime[z].productMinute;
                           hourMinute = productAllTime[z].productHourMulti[i] + ":" + minute;
                        }else {
                           hourMinute = productAllTime[z].productHourMulti[i] + ":" + productAllTime[z].productMinute;
                        }
                        let dateday = new Date(productAllTime[z].productTime[j]);
                        let yearyear = dateday.getFullYear();
                        let monthmonth = dateday.getMonth()+1;
                        let dayday = dateday.getDate();
                        let productDayArray = [yearyear, monthmonth, dayday, hourMinute, productCreate.insertId];
                        productSelect.push(productDayArray);
                     }
                  }
               }
               let ProductCreateTimetableDate = await mysql.executeQuery(productQuery.createProductTimetableDate, [productSelect]);
            }
         }
         let productDetailCreate = await mysql.executeQuery(productQuery.createProductDetail, productDetail);
         let productDetailImageCreate = await mysql.executeQuery(productQuery.createProductDetailImage, [productImages]);
         if(productHighlightPhotoResult == false){
            let productHighlightImageCreate = await mysql.executeQuery(productQuery.createProductHighlightImage, [productHighlightImages]);
         }
         if(productPolicyPhotoResult == false) {
            let productPolicyImageCreate = await mysql.executeQuery(productQuery.createProductPolicyImage, [productPolicyImages]);         
         }
         if(productHolidays != 0) {
            let productHoliday = await mysql.executeQuery(productQuery.createProductHoliday, [productHolidays]);
         }
         let productPriceCreate = await mysql.executeQuery(productQuery.createProductPrice, [productPrices]);
         let data = {
            productId: productCreate.insertId,
            productSelectTypeStatus: productSelectTypeStatus
         }
         
         let output = new Object();
         output.msg = "success";
         output.status = 200;
         res.status(200).json(output);
      }catch(e) {
         console.log(e);
         let output = new Object();
         output.msg = "fail";
         output.status = 200;
         res.status(200).json(output);
      }
   },
   updateProduct: async (req, res) => {
      try {
         let product = new Product({ 
            productName: req.body.productName, 
            productLocation: req.body.productLocation,
            productRate: req.body.productRate,
            productType: req.body.productType,
            productTime: req.body.productTime,
            productPrice: req.body.productPrice,
            productDiscountPrice: req.body.productDiscountPrice
         });
         let productUpdate = await mysql.executeQuery(productQuery.updateProduct, [product, req.params.productId]);
         console.log(productUpdate);
      }catch(e) {
         console.log(e);
      }
   },
   listProduct: async (req, res) => {
      try {
         let output = new Object();
         let token = req.decoded;
         
         let accessTokenResult = (typeof token.accessToken === 'undefined');
         if(accessTokenResult == true) {
            output.tokenStatus = 0;
         }else {
            let updateToken = await mysql.executeQuery(userQuery.tokenUpdateWeb, [token.accessToken, token.refreshToken, token.userEmail]);
            output.tokenStatus = 1;
            output.accessToken = token.accessToken;
            output.refreshToken = token.refreshToken;
         }
         
         let pageResult = (typeof req.query.page === 'undefined');
         let type = req.query.type;
         let limit = 20;
         let skip;
         if(pageResult == true) 
            skip = 0;
         else
            skip = (req.query.page - 1) * limit;
         
         let params;
         let query;
         if(type == undefined || type == null || type == "all") {
            params = [skip, limit];
            query = productQuery.listProduct;
         }
         else if(type == "tour") {
            params = [3, skip, limit];
            query = productQuery.listProductTypeTour;
         }
         else if(type == "ticket"){
            params = [1, 2, skip, limit];
            query = productQuery.listProductTypeTicket;
         }
         else {
            output.msg = "success";
            output.status = 200;
            output.product = "type error";
            res.status(200).json(output);
         }
         let productList = await mysql.executeQuery(query, params);
         
         output.msg = "success";
         output.status = 200;
         output.product = productList;
         res.status(200).json(output);
      }catch(e) {
         let output = new Object();
         output.msg = "fail";
         output.status = 200;
         output.error = e.message;
         res.status(200).json(output);
      }
   },
   webListProduct: async (req, res) => {
      try {
         let output = new Object();
         let token = req.decoded;
         
         let accessTokenResult = (typeof token.accessToken === 'undefined');
         if(accessTokenResult == true) {
            output.tokenStatus = 0;
         }else {
            let updateToken = await mysql.executeQuery(userQuery.tokenUpdateWeb, [token.accessToken, token.refreshToken, token.userEmail]);
            output.tokenStatus = 1;
            output.accessToken = token.accessToken;
            output.refreshToken = token.refreshToken;
         }
         
         let pageResult = (typeof req.query.page === 'undefined');
         let type = req.query.type;
         let limit = 3;
         let skip;
         if(pageResult == true) 
            skip = 0;
         else
            skip = (req.query.page - 1) * limit;
         
         let params;
         let query;
         let queryTotal;
         if(type == undefined || type == null || type == "all") {
            params = [skip, limit];
            query = productQuery.listProduct;
         }
         else if(type == "tour") {
            params = [3, skip, limit];
            query = productQuery.listProductTypeTour;
            queryTotal = productQuery.listProductTourCount;
         }
         else if(type == "ticket"){
            params = [1, 2, skip, limit];
            query = productQuery.listProductTypeTicket;
            queryTotal = productQuery.listProductTicketCount;
         }
         else {
            output.msg = "success";
            output.status = 200;
            output.product = "type error";
            res.status(200).json(output);
         }
         let productList = await mysql.executeQuery(query, params);
         let productCount = await mysql.executeQuery(queryTotal);
         output.msg = "success";
         output.status = 200;
         output.product = productList;
         output.productCount = productCount[0].count;
         res.status(200).json(output);
      }catch(e) {
         console.log(e);
         let output = new Object();
         output.msg = "fail";
         output.status = 200;
         output.error = e.message;
         res.status(200).json(output);
      }
   },
   detailProduct: async (req, res) => {
      try {
         let output = new Object();
         let token = req.decoded;
         
         let accessTokenResult = (typeof token.accessToken === 'undefined');
         if(accessTokenResult == true) {
            output.tokenStatus = 0;
         }else {
            let updateToken = await mysql.executeQuery(userQuery.tokenUpdateWeb, [token.accessToken, token.refreshToken, token.userEmail]);
            output.tokenStatus = 1;
            output.accessToken = token.accessToken;
            output.refreshToken = token.refreshToken;
         }
         let productId = req.params.productId;
         let productType = req.query.productType;
         let today = new Date();
         let day = today.getDay();
         let [productDetail, productDetailImage, productHighlightImage, productDetailPrice, productPolicyImage,productTimeTable] = await Promise.all([
            mysql.executeQuery(productQuery.detailProduct, [productId]),
            mysql.executeQuery(productQuery.detailImageProduct, [productId]),
            mysql.executeQuery(productQuery.detailHighlightImageProduct, [productId]),
            mysql.executeQuery(productQuery.detailProductPrice, [productId]),
            mysql.executeQuery(productQuery.detailPolicyImageProduct, [productId]),
            mysql.executeQuery(productQuery.detailProductTimeTable, [productId, day])
         ]);
         
         output.msg = "success";
         output.status = 200;
         output.product = productDetail[0];
         output.product.productImage = productDetailImage;
         output.product.productHighlightImage = productHighlightImage;
         output.product.productDetailPrice = productDetailPrice;
         output.product.productTime = productTimeTable;
         if(productPolicyImage.length == 0) {
            output.product.productPolicyImage = '';
         }else {
            output.product.productPolicyImage = productPolicyImage[0].productPolicyImage;
         }
         
         res.status(200).json(output);
      }catch(e) {
         console.log(e);
         let output = new Object();
         output.msg = "fail";
         output.status = 200;
         res.status(200).json(output);
      }
   },
   adminListProduct: async (req, res) => {
      try {
         let output = new Object();
         let pageResult = (typeof req.query.page === 'undefined');
         let skip;
         let limit = 9;
         if(pageResult == true) 
            skip = 0;
         else
            skip = (req.query.page - 1) * limit;
         let params = [skip, limit];
         let adminProductList = await mysql.executeQuery(productQuery.adminListProduct, params);
         let adminProductTotalCount = await mysql.executeQuery(productQuery.adminListCountProduct);
         output.msg = "success";
         output.status = 200;
         output.product = adminProductList;
         output.productCount = adminProductTotalCount[0].count;
         res.status(200).json(output);
      }catch(e) {
         console.log(e);
         let output = new Object();
         output.msg = "fail";
         output.status = 200;
         res.status(200).json(output);
      }
   },
   admindeleteProduct: async (req, res) => {
      try {   
         let output = new Object();
         let productId = req.params.productId;
         let [productDetail, productDetailImage, productHighlightImage, productDetailPrice] = await Promise.all([
            mysql.executeQuery(productQuery.adminDeleteProduct, [productId]),
            mysql.executeQuery(productQuery.adminDeleteProductDetail, [productId]),
            mysql.executeQuery(productQuery.adminDeleteProductPrice, [productId]),
            mysql.executeQuery(productQuery.adminDeleteProductImage, [productId]),
            mysql.executeQuery(productQuery.adminDeleteProductHighlight, [productId]),
            mysql.executeQuery(productQuery.adminDeleteProductTimetable, [productId]),
            mysql.executeQuery(productQuery.adminDeleteProductPolicy, [productId])
         ]);
         output.msg = "success";
         output.status = 200;
         res.status(200).json(output);
      }catch(e) {
         let output = new Object();
         output.msg = "fail";
         output.status = 200;
         res.status(200).json(output);
      }
   },
   timeTableProduct: async (req, res) => {
      try {
         let output = new Object();
         let productId = req.params.productId;
         let productDate = req.query.productDate;
         let productDetailType = req.query.productDetailType;
         if(productDetailType == 1) {
            let day = moment(productDate, "YYYY-MM-DD").day();
            let productDetailPrice;
            if(day == 0 || day == 6) {
               productDetailPrice = await mysql.executeQuery(productQuery.detailProductHolidayPrice, [productId]);
            }else {
               productDetailPrice = await mysql.executeQuery(productQuery.detailProductPrice, [productId]);
            }
            output.msg = "success";
            output.status = 200;
            output.product = {
               productDetailPrice: productDetailPrice,
               productTime: []
            }
            res.status(200).json(output);

         }else if(productDetailType == 2) {
            let day = moment(productDate, "YYYY-MM-DD").day();
            let productDetailPrice;
            if(day == 0 || day == 6) {
               productDetailPrice = await mysql.executeQuery(productQuery.detailProductHolidayPrice, [productId]);
            }else {
               productDetailPrice = await mysql.executeQuery(productQuery.detailProductPrice, [productId]);
            }
            let productTimeTable = await mysql.executeQuery(productQuery.detailProductTimeTable, [productId, day]);
            
            output.msg = "success";
            output.status = 200;
            output.product = {
               productDetailPrice: productDetailPrice,
               productTime: productTimeTable
            }
            console.log(output);
            res.status(200).json(output);
         }else {
            let output = new Object();
            output.msg = "fail";
            output.status = 200;
            res.status(200).json(output);
         }
      }catch(e) {
         let output = new Object();
         output.msg = "fail";
         output.status = 200;
         res.status(200).json(output);
      }
   },
   mainWebProduct: async (req, res) => {
      try {
         let output = new Object();
         let productMainTicket = await mysql.executeQuery(productQuery.listWebTicketProduct);
         
         let productMainTour = await mysql.executeQuery(productQuery.listWebTourProduct);
         output.msg = "success";
         output.status = 200;
         output.product = {
            productMainTicket: productMainTicket,
            productMainTour: productMainTour
         }
         res.status(200).json(output);
      }catch(e) {
         console.log(e);
         let output = new Object();
         output.msg = "fail";
         output.status = 200;
         res.status(200).json(output);
      }
   }
   
}
