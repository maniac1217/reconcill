import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './src/data';
import { Product, Category, DepositOrder, SmsLog, BankAccount, Banner } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

const storePath = path.join(process.cwd(), 'data-store.json');

// Initialize default store
let store = {
  products: INITIAL_PRODUCTS,
  categories: [
    { id: 'electronics', label: '전자기기', icon: '📱' },
    { id: 'fashion', label: '의류잡화', icon: '🧥' },
    { id: 'home', label: '인테리어', icon: '🛋️' },
    { id: 'beauty', label: '뷰티케어', icon: '💄' }
  ] as Category[],
  orders: INITIAL_ORDERS,
  smsLogs: [] as SmsLog[],
  bankAccount: {
    bankName: '하나은행 (Hana Bank)',
    accountNumber: '123-456-7890-12',
    holderName: '(주) 인디고'
  } as BankAccount,
  banner: {
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpwbowHKPauFkNlqJKToudemD6e6F_ES36UjWYoHV7nj1xWfPVvdCfqKlvDnIj2Ct5y6lUvlrLHjMQcUgc693KKMUdFZugV9UaCelH65bNBTEP4tJua9unmG6JcbLKTVnNMXerffVaRjZ5Gg9WB_PFE-fYOeHScQnhN6owkuXTTwVQSCuaJzx8G7LX-uwTPzPIPLxsgTo6TBzi19DzIjJkMXxTnXhSOYOIYfC2JNusRQy9XW7Y-JzT',
    phrase: '일상의 질을 높이는 에센셜 컬렉션'
  } as Banner
};

const saveStore = () => {
  try {
    fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write data-store.json:', err);
  }
};

// Load existing store from file if it exists
if (fs.existsSync(storePath)) {
  try {
    const data = fs.readFileSync(storePath, 'utf8');
    store = JSON.parse(data);
    if (!store.banner) {
      store.banner = {
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpwbowHKPauFkNlqJKToudemD6e6F_ES36UjWYoHV7nj1xWfPVvdCfqKlvDnIj2Ct5y6lUvlrLHjMQcUgc693KKMUdFZugV9UaCelH65bNBTEP4tJua9unmG6JcbLKTVnNMXerffVaRjZ5Gg9WB_PFE-fYOeHScQnhN6owkuXTTwVQSCuaJzx8G7LX-uwTPzPIPLxsgTo6TBzi19DzIjJkMXxTnXhSOYOIYfC2JNusRQy9XW7Y-JzT',
        phrase: '일상의 질을 높이는 에센셜 컬렉션'
      };
      saveStore();
    }
    console.log('Successfully loaded persistent data-store.json');
  } catch (err) {
    console.error('Error reading data-store.json, resetting to defaults:', err);
  }
} else {
  // Save initial default store
  saveStore();
  console.log('Created new data-store.json with default initial state');
}

// --- API ROUTES ---

// 1. Products
app.get('/api/products', (req, res) => {
  res.json(store.products);
});

app.post('/api/products', (req, res) => {
  const newProduct: Product = req.body;
  store.products = [newProduct, ...store.products];
  saveStore();
  res.status(201).json({ success: true, product: newProduct });
});

app.put('/api/products/:id/suspend', (req, res) => {
  const { id } = req.params;
  store.products = store.products.map(p => {
    if (p.id === id) {
      return { ...p, isSuspended: !p.isSuspended };
    }
    return p;
  });
  saveStore();
  res.json({ success: true, products: store.products });
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  store.products = store.products.filter(p => p.id !== id);
  saveStore();
  res.json({ success: true });
});

app.put('/api/products/:id/category', (req, res) => {
  const { id } = req.params;
  const { category } = req.body;
  store.products = store.products.map(p => {
    if (p.id === id) {
      return { ...p, category };
    }
    return p;
  });
  saveStore();
  res.json({ success: true });
});

// 2. Categories
app.get('/api/categories', (req, res) => {
  res.json(store.categories);
});

app.post('/api/categories', (req, res) => {
  const newCat: Category = req.body;
  if (store.categories.some(c => c.id === newCat.id)) {
    res.status(400).json({ error: 'Duplicate category ID' });
    return;
  }
  store.categories = [...store.categories, newCat];
  saveStore();
  res.status(201).json({ success: true, category: newCat });
});

app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  store.categories = store.categories.filter(c => c.id !== id);
  saveStore();
  res.json({ success: true });
});

// 3. Orders
app.get('/api/orders', (req, res) => {
  res.json(store.orders);
});

app.post('/api/orders', (req, res) => {
  const newOrder: DepositOrder = req.body;
  store.orders = [newOrder, ...store.orders];
  saveStore();
  res.status(201).json({ success: true, order: newOrder });
});

app.put('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, trackingNumber } = req.body;
  store.orders = store.orders.map(o => {
    if (o.id === id) {
      const updated = { ...o };
      if (status !== undefined) updated.status = status;
      if (trackingNumber !== undefined) updated.trackingNumber = trackingNumber;
      return updated;
    }
    return o;
  });
  saveStore();
  res.json({ success: true });
});

// 4. SMS Logs
app.get('/api/sms-logs', (req, res) => {
  res.json(store.smsLogs);
});

app.post('/api/sms-logs', (req, res) => {
  const newLog: SmsLog = req.body;
  store.smsLogs = [newLog, ...store.smsLogs];
  saveStore();
  res.status(201).json({ success: true });
});

// 5. Bank Account
app.get('/api/bank-account', (req, res) => {
  res.json(store.bankAccount);
});

app.put('/api/bank-account', (req, res) => {
  const updatedBank: BankAccount = req.body;
  store.bankAccount = updatedBank;
  saveStore();
  res.json({ success: true, bankAccount: store.bankAccount });
});

// 6. Banner
app.get('/api/banner', (req, res) => {
  res.json(store.banner);
});

app.put('/api/banner', (req, res) => {
  const updatedBanner: Banner = req.body;
  store.banner = updatedBanner;
  saveStore();
  res.json({ success: true, banner: store.banner });
});


// --- VITE MIDDLEWARE SETUP ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
