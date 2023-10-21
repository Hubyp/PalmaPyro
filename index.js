const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const app = express();
const port = 3000;
const CartItem = require('./cartItem');

mongoose.connect(process.env.MONG_OB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const customAlphabetOptions = "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLXCVBNM";

const productSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: generateUniqueID,
  },
  name: String,
  description: String,
  price: Number,
  image: String,
});

const Product = mongoose.model('Product', productSchema);

function generateUniqueID() {
  const length = 7;
  let id = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * customAlphabetOptions.length);
    id += customAlphabetOptions[randomIndex];
  }
  return id;
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).exec();

    const defaultImage = 'https://crawfordroofing.com.au/wp-content/uploads/2018/04/No-image-available-2.jpg';
    products.forEach((product) => {
      if (!product.image) {
        product.image = defaultImage;
      }
    });

    res.render('home', { products });
  } catch (err) {
    console.error(err);
    res.status(500).send('Eroare la afișarea paginii principale');
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

app.post('/adauga', upload.single('productImage'), async (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || isNaN(price)) {
    res.status(400).send('Date invalide pentru produs.');
    return;
  }

  const productImage = req.file.filename;

  const newProduct = new Product({
    name,
    description,
    price: parseFloat(price),
    image: productImage,
  });

  try {
    await newProduct.save();
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Eroare la adăugarea produsului');
  }
});

app.post('/sterge/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    await Product.deleteOne({ _id: productId });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Eroare la ștergerea produsului');
  }
});

app.put('/editeaza/:id', async (req, res) => {
  const productId = req.params.id;
  const newDescription = req.body.description;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, { description: newDescription }, { new: true });
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).send('Eroare la editarea produsului');
  }
});

app.get('/admin', async (req, res) => {
  try {
    const products = await Product.find({}).exec();
    res.render('admin', { products });
  } catch (err) {
    console.error(err);
    res.status(500).send('Eroare la afișarea paginii de administrare');
  }
});

app.post('/adauga-in-cos/:productId', async (req, res) => {
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);

  try {
    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).send('Produsul nu există.');
      return;
    }

    if (quantity <= 0) {
      res.status(400).send('Cantitatea introdusă nu este validă.');
      return;
    }

    if (quantity > product.stocDisponibil) {
      res.status(400).send('Cantitatea depășește stocul disponibil.');
      return;
    }

    const sessionCart = req.session.cart || {};
    const cartItem = sessionCart[productId];

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      sessionCart[productId] = {
        name: product.name,
        price: product.price,
        quantity,
      };
    }

    req.session.cart = sessionCart;

    res.redirect('/cos-cumparaturi');
  } catch (err) {
    console.error(err);
    res.status(500).send('Eroare la gestionarea coșului de cumpărături');
  }
});

app.post('/sterge-din-cos/:itemId', async (req, res) => {
  const itemId = req.params.itemId;
  await CartItem.findByIdAndDelete(itemId);
  res.redirect('/cos-cumparaturi');
});

app.listen(port, () => {
  console.log(`Serverul rulează pe portul ${port}`);
});
