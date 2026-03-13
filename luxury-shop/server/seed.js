import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User, Admin, Product } from './models/Schema.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shopez';

const products = [
  // ── MEN ──────────────────────────────────────────────────────────
  {
    name: 'Classic Slim Fit Oxford Shirt',
    description: 'Crafted from 100% premium Egyptian cotton, this slim-fit Oxford shirt delivers understated elegance for the modern man. Features a button-down collar, single-button cuffs, and a clean tonal finish that transitions effortlessly from boardroom to bar.',
    category: 'Men', brand: 'VELOUR',
    sizes: ['S','M','L','XL'], colors: ['White','Light Blue','Navy'],
    price: 2499, discount: 15, stock: 80,
    mainImg: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=700&q=85',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&q=85',
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=900&q=85',
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4466?w=900&q=85'
    ],
    rating: 4.7, isFeatured: true, isTrending: false
  },
  {
    name: 'Slim Tapered Chino Pants',
    description: 'Refined stretch-cotton chinos with a tapered silhouette. A staple piece built for versatility — pair with a crisp shirt or a casual tee. Features a flat front, side pockets, and a clean finish at the hem.',
    category: 'Men', brand: 'VELOUR',
    sizes: ['S','M','L','XL'], colors: ['Beige','Olive','Charcoal'],
    price: 3199, discount: 10, stock: 60,
    mainImg: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=700&q=85',
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900&q=85',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=85',
      'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=900&q=85'
    ],
    rating: 4.5, isFeatured: true, isTrending: true
  },
  {
    name: 'Merino Wool Crew Neck Sweater',
    description: 'Luxuriously soft merino wool sweater with a classic crew neck. Temperature-regulating, lightweight, and naturally odour-resistant. A timeless wardrobe investment that only gets better with every wear.',
    category: 'Men', brand: 'VELOUR',
    sizes: ['S','M','L','XL'], colors: ['Camel','Burgundy','Grey'],
    price: 4299, discount: 20, stock: 45,
    mainImg: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=700&q=85',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=900&q=85',
      'https://images.unsplash.com/photo-1614495728593-0c29055b1f41?w=900&q=85',
      'https://images.unsplash.com/photo-1606890658317-7d14490b76fd?w=900&q=85'
    ],
    rating: 4.8, isFeatured: true, isTrending: true
  },
  {
    name: 'Premium Raw Denim Jeans',
    description: 'Selvedge raw denim jeans with a straight fit. Heavyweight 12oz Japanese denim that molds to your shape over time. Features a five-pocket construction and copper rivets for durability.',
    category: 'Men', brand: 'VELOUR',
    sizes: ['S','M','L','XL'], colors: ['Indigo','Black','Stone Wash'],
    price: 5499, discount: 8, stock: 55,
    mainImg: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=700&q=85',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=85',
      'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=900&q=85',
      'https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=900&q=85'
    ],
    rating: 4.6, isFeatured: false, isTrending: true
  },
  {
    name: 'Linen Summer Blazer',
    description: 'Unstructured linen blazer for a relaxed yet polished look. Single-breasted with notch lapels and patch pockets. Perfect for summer weddings, rooftop events, and elevated casual occasions.',
    category: 'Men', brand: 'VELOUR',
    sizes: ['S','M','L','XL'], colors: ['Sand','White','Navy'],
    price: 6999, discount: 12, stock: 30,
    mainImg: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700&q=85',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=85',
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=900&q=85',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=900&q=85'
    ],
    rating: 4.9, isFeatured: true, isTrending: false
  },

  // ── WOMEN ────────────────────────────────────────────────────────
  {
    name: 'Silk Slip Midi Dress',
    description: 'Effortlessly elegant silk slip dress with a bias cut that drapes beautifully. Features adjustable spaghetti straps, a V-neckline, and a midi length. The ultimate dress for refined femininity.',
    category: 'Women', brand: 'VELOUR',
    sizes: ['XS','S','M','L'], colors: ['Champagne','Dusty Rose','Midnight'],
    price: 7499, discount: 18, stock: 40,
    mainImg: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=700&q=85',
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&q=85',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=85',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=85'
    ],
    rating: 4.9, isFeatured: true, isTrending: true
  },
  {
    name: 'Tailored Wide-Leg Trousers',
    description: 'Elevated wide-leg trousers in a fluid crepe fabric. High-waisted with a flat front and subtle pleat detailing. Pair with a tucked-in blouse or structured blazer for an elevated power look.',
    category: 'Women', brand: 'VELOUR',
    sizes: ['XS','S','M','L','XL'], colors: ['Ivory','Black','Sage'],
    price: 4199, discount: 14, stock: 50,
    mainImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwNvVJb5nRNzCcRW-gBL4iACFhrIlaK25GUQ&s',
    images: [
      'https://images.unsplash.com/photo-1551163943-3f7253a97855?w=900&q=85',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=85',
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4466?w=900&q=85'
    ],
    rating: 4.6, isFeatured: true, isTrending: false
  },
  {
    name: 'Cashmere Turtleneck Sweater',
    description: 'Pure Grade-A cashmere turtleneck sweater. Impossibly soft and lightweight, this is the sweater you will reach for all winter. Ribbed cuffs and hem for a refined, structured finish.',
    category: 'Women', brand: 'VELOUR',
    sizes: ['XS','S','M','L'], colors: ['Ivory','Camel','Black'],
    price: 8999, discount: 20, stock: 35,
    mainImg: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=700&q=85',
    images: [
      'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=900&q=85',
      'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=900&q=85',
      'https://images.unsplash.com/photo-1525450824786-227cbef70703?w=900&q=85'
    ],
    rating: 4.9, isFeatured: true, isTrending: true
  },
  {
    name: 'Structured Trench Coat',
    description: 'A heritage-inspired double-breasted trench coat in water-resistant gabardine. Features a belted waist, storm flap, and deep pockets. The definitive outerwear piece for every wardrobe.',
    category: 'Women', brand: 'VELOUR',
    sizes: ['XS','S','M','L','XL'], colors: ['Camel','Black','Stone'],
    price: 12999, discount: 10, stock: 25,
    mainImg: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=700&q=85',
    images: [
      'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=900&q=85',
      'https://images.unsplash.com/photo-1539533018257-e07c4e31f41e?w=900&q=85',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=900&q=85'
    ],
    rating: 4.8, isFeatured: false, isTrending: true
  },
  {
    name: 'Wrap Linen Midi Skirt',
    description: 'Relaxed wrap skirt in breathable linen-cotton blend. Tie-front closure with a flared silhouette. Effortlessly chic for warm-weather days — dress up with heels or down with sandals.',
    category: 'Women', brand: 'VELOUR',
    sizes: ['XS','S','M','L'], colors: ['Terra Cotta','Olive','Ecru'],
    price: 3499, discount: 22, stock: 60,
    mainImg: 'https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/H11330s.jpg?im=Resize,width=750',
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5218afa9a4?w=900&q=85',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=85',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=85'
    ],
    rating: 4.5, isFeatured: false, isTrending: false
  },

  // ── BOYS ─────────────────────────────────────────────────────────
  {
    name: 'Boys Polo Shirt',
    description: 'Classic pique cotton polo shirt for boys. Ribbed collar and cuffs with a two-button placket. Easy-care fabric that stays looking fresh after every wash. Perfect for school or casual outings.',
    category: 'Boys', brand: 'VELOUR',
    sizes: ['S','M','L'], colors: ['Navy','White','Bottle Green'],
    price: 899, discount: 10, stock: 120,
    mainImg: 'https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=700&q=85',
    images: [
      'https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=900&q=85',
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=900&q=85',
      'https://images.unsplash.com/photo-1555069519-127aadecd284?w=900&q=85'
    ],
    rating: 4.4, isFeatured: false, isTrending: false
  },
  {
    name: 'Boys Slim Denim Jeans',
    description: 'Comfortable stretch denim jeans with a slim fit for boys. Adjustable waistband, five-pocket construction, and reinforced knees for active play. A wardrobe essential.',
    category: 'Boys', brand: 'VELOUR',
    sizes: ['S','M','L'], colors: ['Mid Blue','Dark Indigo'],
    price: 1299, discount: 15, stock: 90,
    mainImg: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=700&q=85',
    images: [
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=900&q=85',
      'https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=900&q=85',
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=900&q=85'
    ],
    rating: 4.3, isFeatured: false, isTrending: false
  },
  {
    name: 'Boys Zip-Up Hoodie',
    description: 'Soft fleece zip-up hoodie with a kangaroo pocket and adjustable drawstring hood. Brushed interior for warmth and comfort. Perfect for layering on cooler days.',
    category: 'Boys', brand: 'VELOUR',
    sizes: ['S','M','L'], colors: ['Grey','Navy','Olive'],
    price: 1699, discount: 12, stock: 75,
    mainImg: 'https://assets.ajio.com/medias/sys_master/root/20240923/aihy/66f06e3af9b8ef490b5afdd3/-473Wx593H-700383377-turquoise-MODEL.jpg',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=900&q=85',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=85',
      'https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=900&q=85'
    ],
    rating: 4.5, isFeatured: false, isTrending: true
  },

  // ── GIRLS ────────────────────────────────────────────────────────
  {
    name: 'Girls Floral Smock Dress',
    description: 'Whimsical floral smocked dress with elasticated bodice and short puff sleeves. Lightweight cotton fabric with a playful A-line silhouette. Ideal for birthdays, garden parties, and everyday wear.',
    category: 'Girls', brand: 'VELOUR',
    sizes: ['S','M','L'], colors: ['Blush Floral','Blue Floral'],
    price: 1499, discount: 20, stock: 65,
    mainImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSchSccm-S5GbjxoO4CA4JIK0NaIpuVoEaqnQ&s',
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf4?w=900&q=85',
      'https://images.unsplash.com/photo-1476234251651-f353703a034d?w=900&q=85',
      'https://images.unsplash.com/photo-1560015534-cee980ba7e13?w=900&q=85'
    ],
    rating: 4.7, isFeatured: true, isTrending: false
  },
  {
    name: 'Girls Ribbed Cardigan',
    description: 'Soft ribbed knit cardigan with pearl buttons and a relaxed fit. A sweet layering piece that pairs perfectly with dresses or jeans. Available in pastel tones for a charming, feminine look.',
    category: 'Girls', brand: 'VELOUR',
    sizes: ['S','M','L'], colors: ['Lilac','Powder Pink','Mint'],
    price: 1199, discount: 18, stock: 80,
    mainImg: 'https://images.unsplash.com/photo-1476234251651-f353703a034d?w=700&q=85',
    images: [
      'https://images.unsplash.com/photo-1476234251651-f353703a034d?w=900&q=85',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf4?w=900&q=85',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=900&q=85'
    ],
    rating: 4.6, isFeatured: false, isTrending: true
  },
  {
    name: 'Girls Twill Skirt',
    description: 'A-line twill skirt with an elasticated waistband and subtle pleat detailing. Structured yet comfortable for all-day wear. Pairs beautifully with knitwear or printed blouses.',
    category: 'Girls', brand: 'VELOUR',
    sizes: ['S','M','L'], colors: ['Camel','Navy','Forest Green'],
    price: 999, discount: 15, stock: 70,
    mainImg: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=700&q=85',
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=900&q=85',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf4?w=900&q=85',
      'https://images.unsplash.com/photo-1476234251651-f353703a034d?w=900&q=85'
    ],
    rating: 4.4, isFeatured: false, isTrending: false
  },

  // ── KIDS ─────────────────────────────────────────────────────────
  {
    name: 'Kids Organic Cotton Tee',
    description: 'Buttery-soft GOTS-certified organic cotton tee for little ones. Printed with a playful motif using non-toxic inks. Tagless neck for comfort, reinforced shoulders for durability.',
    category: 'Kids', brand: 'VELOUR',
    sizes: ['S','M','L'], colors: ['White','Yellow','Sky Blue'],
    price: 599, discount: 10, stock: 150,
    mainImg: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=700&q=85',
    images: [
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=900&q=85',
      'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=900&q=85',
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=900&q=85'
    ],
    rating: 4.8, isFeatured: false, isTrending: false
  },
  {
    name: 'Kids Padded Winter Jacket',
    description: 'Warm puffer jacket filled with hypoallergenic synthetic insulation. Water-repellent outer shell, zip-off hood, and elasticated cuffs to keep the cold out. Built for adventurous little explorers.',
    category: 'Kids', brand: 'VELOUR',
    sizes: ['S','M','L'], colors: ['Red','Navy','Teal'],
    price: 2999, discount: 25, stock: 55,
    mainImg: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=700&q=85',
    images: [
      'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=900&q=85',
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=900&q=85',
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=900&q=85'
    ],
    rating: 4.7, isFeatured: true, isTrending: true
  },
  {
    name: 'Kids Jogger Set',
    description: 'Cozy matching jogger set with a pullover sweatshirt and elasticated jogger pants. Brushed cotton fleece for warmth and all-day comfort. Perfect for play dates and lazy weekends.',
    category: 'Kids', brand: 'VELOUR',
    sizes: ['S','M','L'], colors: ['Grey Marl','Navy','Olive'],
    price: 1799, discount: 20, stock: 90,
    mainImg: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=700&q=85',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&q=85',
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=900&q=85',
      'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=900&q=85'
    ],
    rating: 4.5, isFeatured: false, isTrending: false
  },
  {
    name: 'Kids Dungaree Set',
    description: 'Classic denim dungaree set with adjustable braces and multiple pockets. Soft denim blend that moves with your child. Comes with a matching striped bodysuit — dressed up or down with ease.',
    category: 'Kids', brand: 'VELOUR',
    sizes: ['S','M','L'], colors: ['Mid Denim','Pale Blue'],
    price: 1499, discount: 12, stock: 75,
    mainImg: 'https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=700&q=85',
    images: [
      'https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=900&q=85',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&q=85',
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=900&q=85'
    ],
    rating: 4.6, isFeatured: true, isTrending: false
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    // Drop the products collection fully to remove old indexes (fixes slug_1 error)
    const collections = await mongoose.connection.db.listCollections({ name: 'products' }).toArray();
    if (collections.length > 0) {
      await mongoose.connection.db.dropCollection('products');
      console.log('🗑️  Dropped products collection (cleared old indexes)');
    }

    await Product.insertMany(products);
    console.log(`✅ Inserted ${products.length} clothing products`);

    // Seed Admin doc
    await mongoose.connection.collection('admin').deleteMany({});
    await mongoose.connection.collection('admin').insertOne({
      banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=90',
      categories: ['Men', 'Women', 'Boys', 'Girls', 'Kids']
    });
    console.log('✅ Admin seeded (banner + categories)');

    // Seed demo admin
    const existingAdmin = await User.findOne({ email: 'admin@velour.com' });
    if (!existingAdmin) {
      await User.create({ username: 'Admin', email: 'admin@velour.com', password: await bcrypt.hash('admin123', 10), usertype: 'admin' });
      console.log('✅ Admin user → admin@velour.com / admin123');
    }

    // Seed demo customer
    const existingUser = await User.findOne({ email: 'user@velour.com' });
    if (!existingUser) {
      await User.create({ username: 'Alex Morgan', email: 'user@velour.com', password: await bcrypt.hash('user123', 10), usertype: 'customer' });
      console.log('✅ Customer → user@velour.com / user123');
    }

    console.log('\n🎉 VELOUR database seeded successfully!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seedDB();
