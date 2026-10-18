import { useEffect, useMemo, useState } from 'react'
import {
  categories,
  categoryName,
  formatPrice,
  getProduct,
  principles,
  products,
  slides,
} from './data'

const CART_KEY = 'tana-cart'

function readCart() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(CART_KEY))
    if (!Array.isArray(saved)) return []
    return saved.filter((item) => getProduct(item.id) && item.qty > 0)
  } catch {
    return []
  }
}

export default function App() {
  const [view, setView] = useState({ name: 'home' })
  const [cart, setCart] = useState(readCart)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [slide, setSlide] = useState(0)
  const [openPrinciple, setOpenPrinciple] = useState(principles[0].id)

  useEffect(() => {
    sessionStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    document.body.style.overflow = menuOpen || cartOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen, cartOpen])

  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setCartOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const count = cart.reduce((sum, item) => sum + item.qty, 0)

  function go(next) {
    setView(next)
    setMenuOpen(false)
    setCartOpen(false)
    window.scrollTo(0, 0)
  }

  function addToCart(id) {
    setCart((current) => {
      const existing = current.find((item) => item.id === id)
      if (existing) {
        return current.map((item) =>
          item.id === id ? { ...item, qty: item.qty + 1 } : item,
        )
      }
      return [...current, { id, qty: 1 }]
    })
    setCartOpen(true)
  }

  function setQty(id, qty) {
    setCart((current) =>
      qty <= 0
        ? current.filter((item) => item.id !== id)
        : current.map((item) => (item.id === id ? { ...item, qty } : item)),
    )
  }

  const lines = cart
    .map((item) => ({ ...item, product: getProduct(item.id) }))
    .filter((item) => item.product)

  const subtotal = lines.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0,
  )

  return (
    <div className="app">
      <header className="topbar">
        <button className="wordmark" type="button" onClick={() => go({ name: 'home' })}>
          TANA
        </button>
        <div className="top-actions">
          <button
            className="icon-btn"
            type="button"
            aria-label={
              count
                ? `Cart, ${count} ${count === 1 ? 'item' : 'items'}`
                : 'Cart'
            }
            onClick={() => setCartOpen(true)}
          >
            <BagIcon />
            {count > 0 && <span className="count">{count}</span>}
          </button>
          <button
            className="icon-btn"
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon />
          </button>
        </div>
      </header>

      <main>
        {view.name === 'home' && (
          <Home
            slide={slide}
            setSlide={setSlide}
            openPrinciple={openPrinciple}
            setOpenPrinciple={setOpenPrinciple}
            onOpenProduct={(id) => go({ name: 'product', id })}
            onOpenShop={(category) => go({ name: 'shop', category: category ?? 'all' })}
          />
        )}
        {view.name === 'shop' && (
          <Shop
            category={view.category ?? 'all'}
            onCategory={(category) => setView({ name: 'shop', category })}
            onOpenProduct={(id) =>
              go({ name: 'product', id, category: view.category ?? 'all' })
            }
          />
        )}
        {view.name === 'product' && (
          <ProductPage
            id={view.id}
            onBack={() => go({ name: 'shop', category: view.category ?? 'all' })}
            onOpenProduct={(id) =>
              go({ name: 'product', id, category: view.category })
            }
            onAdd={addToCart}
          />
        )}
        {view.name === 'about' && <About onShop={() => go({ name: 'shop' })} />}
      </main>

      <Footer onNavigate={go} />

      {menuOpen && (
        <Menu
          onClose={() => setMenuOpen(false)}
          onNavigate={go}
        />
      )}
      {cartOpen && (
        <CartDrawer
          lines={lines}
          subtotal={subtotal}
          onClose={() => setCartOpen(false)}
          onQty={setQty}
          onExplore={() => go({ name: 'shop' })}
          onClear={() => setCart([])}
        />
      )}
    </div>
  )
}

function Home({ slide, setSlide, openPrinciple, setOpenPrinciple, onOpenProduct, onOpenShop }) {
  const current = slides[slide]
  const featured = products.filter((product) => product.featured)
  const highlights = [
    { id: 'banarasi', name: 'Banarasi', image: products[0].image },
    { id: 'jamdani', name: 'Jamdani', image: products[2].image },
    { id: 'cotton', name: 'Cotton', image: products[4].image },
  ]

  return (
    <>
      <section className="hero" aria-roledescription="carousel">
        <div className="hero-copy">
          <h1>{current.title}</h1>
          <p>{current.text}</p>
          <div className="pager" role="tablist" aria-label="Intro slides">
            {slides.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={index === slide}
                className={index === slide ? 'active' : ''}
                onClick={() => setSlide(index)}
              >
                {item.id}
              </button>
            ))}
          </div>
        </div>
        <img src={current.image} alt="" />
      </section>

      <section className="block">
        <div className="section-label">
          <p>Selected</p>
          <button type="button" className="text-link" onClick={() => onOpenShop('all')}>
            View the edit
          </button>
        </div>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} onOpen={onOpenProduct} />
          ))}
        </div>
      </section>

      <section className="block">
        <div className="cat-grid">
          {highlights.map((item) => (
            <button
              key={item.id}
              type="button"
              className="media-card"
              onClick={() => onOpenShop(item.id)}
            >
              <img src={item.image} alt="" />
              <span className="shade" />
              <span className="media-row">
                <span>{item.name}</span>
                <Arrow />
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="block">
        <div className="principles">
          <img
            src="https://images.unsplash.com/photo-1761125064798-530c13c32b6d?auto=format&fit=crop&w=1400&q=80"
            alt="Two sarees worn together"
          />
          {principles.map((item) => {
            const open = openPrinciple === item.id
            return (
              <div key={item.id} className={open ? 'principle open' : 'principle'}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenPrinciple(open ? '' : item.id)}
                >
                  <span>
                    {item.id} {item.title}
                  </span>
                </button>
                {open && <p>{item.text}</p>}
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}

function Shop({ category, onCategory, onOpenProduct }) {
  const list = useMemo(
    () =>
      category === 'all'
        ? products
        : products.filter((product) => product.category === category),
    [category],
  )

  return (
    <section className="page">
      <div className="page-intro">
        <p className="kicker">Catalogue</p>
        <h1>{category === 'all' ? 'The edit' : categoryName(category)}</h1>
      </div>
      <div className="filters" role="tablist" aria-label="Categories">
        <button
          type="button"
          className={category === 'all' ? 'active' : ''}
          onClick={() => onCategory('all')}
        >
          All
        </button>
        {categories.map((item) => (
          <button
            key={item.id}
            type="button"
            className={category === item.id ? 'active' : ''}
            onClick={() => onCategory(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <p className="empty">Nothing in this edit yet.</p>
      ) : (
        <div className="product-grid shop">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} onOpen={onOpenProduct} />
          ))}
        </div>
      )}
    </section>
  )
}

function ProductPage({ id, onBack, onOpenProduct, onAdd }) {
  const product = getProduct(id)
  if (!product) {
    return (
      <section className="page">
        <p>This saree is no longer in the edit.</p>
        <button type="button" className="text-link" onClick={onBack}>
          Back to shop
        </button>
      </section>
    )
  }

  const related = [
    ...products.filter(
      (item) => item.id !== product.id && item.category === product.category,
    ),
    ...products.filter(
      (item) => item.id !== product.id && item.category !== product.category,
    ),
  ].slice(0, 2)

  return (
    <section className="page">
      <button type="button" className="text-link back" onClick={onBack}>
        Back to shop
      </button>
      <div className="detail">
        <div className="detail-photo" style={{ background: product.tone }}>
          <img src={product.image} alt={product.name} />
        </div>
        <div className="detail-copy">
          <p className="kicker">{categoryName(product.category)}</p>
          <h1>{product.name}</h1>
          <p className="price large">
            {product.compareAt && <s>{formatPrice(product.compareAt)}</s>}
            <span>{formatPrice(product.price)}</span>
          </p>
          <p className="lede">{product.note}</p>
          <dl className="specs">
            <div>
              <dt>Fabric</dt>
              <dd>{product.fabric}</dd>
            </div>
            <div>
              <dt>Length</dt>
              <dd>{product.length}</dd>
            </div>
          </dl>
          <button type="button" className="pill" onClick={() => onAdd(product.id)}>
            Add to cart
          </button>
          <p className="fine">Blouse fabric is included. Stitching is not.</p>
        </div>
      </div>
      <div className="section-label">
        <p>Also in the edit</p>
      </div>
      <div className="product-grid">
        {related.map((item) => (
          <ProductCard key={item.id} product={item} onOpen={onOpenProduct} />
        ))}
      </div>
    </section>
  )
}

function About({ onShop }) {
  return (
    <section className="page about">
      <p className="kicker">About</p>
      <h1>A loom’s warp is called tana. We started with that word.</h1>
      <p>
        TANA is a small saree edit: Banarasi and Jamdani beside everyday cotton,
        plus a short list for evenings. We keep the catalogue narrow so each
        cloth can be named — fabric, length, and what it is actually for.
      </p>
      <p>
        This is the first preview of the shop. You can browse, gather a cart,
        and send an enquiry. Nothing is charged here.
      </p>
      <button type="button" className="pill" onClick={onShop}>
        Shop the edit
      </button>
    </section>
  )
}

function ProductCard({ product, onOpen }) {
  return (
    <button type="button" className="product-card" onClick={() => onOpen(product.id)}>
      <span className="frame" style={{ background: product.tone }}>
        <img src={product.image} alt="" />
      </span>
      <span className="product-meta">
        <span>
          <span className="kicker">{categoryName(product.category)}</span>
          <span className="product-name">{product.name}</span>
          <span className="price">
            {product.compareAt && <s>{formatPrice(product.compareAt)}</s>}
            {formatPrice(product.price)}
          </span>
        </span>
        <Arrow />
      </span>
    </button>
  )
}

function Menu({ onClose, onNavigate }) {
  return (
    <div className="menu" role="dialog" aria-modal="true" aria-label="Menu">
      <button className="icon-btn close" type="button" aria-label="Close menu" onClick={onClose}>
        <CloseIcon />
      </button>
      <nav>
        <button type="button" onClick={() => onNavigate({ name: 'home' })}>
          Home
        </button>
        <button type="button" onClick={() => onNavigate({ name: 'shop', category: 'all' })}>
          Shop
        </button>
        <button type="button" onClick={() => onNavigate({ name: 'about' })}>
          About
        </button>
      </nav>
      <div className="menu-cats">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onNavigate({ name: 'shop', category: category.id })}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}

function CartDrawer({ lines, subtotal, onClose, onQty, onExplore, onClear }) {
  const [step, setStep] = useState('cart')
  const [form, setForm] = useState({ name: '', phone: '', city: '' })
  const [error, setError] = useState('')
  const [receipt, setReceipt] = useState(null)

  function submit(event) {
    event.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Name and phone are needed so we can confirm the sarees.')
      return
    }
    setError('')
    setReceipt({
      name: form.name.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      items: lines.map(
        (item) => `${item.product.name} × ${item.qty}`,
      ),
      total: subtotal,
    })
    setStep('done')
    onClear()
  }

  return (
    <>
      <button className="backdrop" type="button" aria-label="Close cart" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Cart">
        <div className="drawer-head">
          <h2>{step === 'done' ? 'Noted' : 'Cart'}</h2>
          <button className="icon-btn" type="button" aria-label="Close cart" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {step === 'done' && receipt ? (
          <div className="drawer-body">
            <p>
              Saved in this browser only. Nothing was sent or charged — this
              preview has no checkout yet.
            </p>
            <ul className="receipt">
              {receipt.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>
              {receipt.name} · {receipt.phone}
              {receipt.city ? ` · ${receipt.city}` : ''}
            </p>
            <p className="price">{formatPrice(receipt.total)}</p>
            <button type="button" className="pill" onClick={onExplore}>
              Keep browsing
            </button>
          </div>
        ) : lines.length === 0 ? (
          <div className="drawer-body">
            <p>Your cart is empty.</p>
            <button type="button" className="pill" onClick={onExplore}>
              Explore weaves
            </button>
          </div>
        ) : step === 'form' ? (
          <form className="drawer-body" onSubmit={submit}>
            <p className="fine">No payment in this preview. We only take a way to reach you.</p>
            <label>
              Name
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                autoComplete="name"
              />
            </label>
            <label>
              Phone
              <input
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                autoComplete="tel"
                inputMode="tel"
              />
            </label>
            <label>
              City
              <input
                value={form.city}
                onChange={(event) => setForm({ ...form, city: event.target.value })}
                autoComplete="address-level2"
              />
            </label>
            {error && <p className="form-error">{error}</p>}
            <button className="pill" type="submit">
              Send enquiry · {formatPrice(subtotal)}
            </button>
          </form>
        ) : (
          <>
            <ul className="lines">
              {lines.map((item) => (
                <li key={item.id}>
                  <img src={item.product.image} alt="" />
                  <div>
                    <p className="product-name">{item.product.name}</p>
                    <p className="price">{formatPrice(item.product.price)}</p>
                    <div className="qty">
                      <button type="button" aria-label="Decrease quantity" onClick={() => onQty(item.id, item.qty - 1)}>
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button type="button" aria-label="Increase quantity" onClick={() => onQty(item.id, item.qty + 1)}>
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="drawer-foot">
              <p>
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </p>
              <button type="button" className="pill" onClick={() => setStep('form')}>
                Send enquiry
              </button>
              <p className="fine">Shipping is confirmed with the enquiry. Nothing is charged yet.</p>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div>
        <p className="wordmark static">TANA</p>
        <p>A small edit of handloom sarees.</p>
      </div>
      <div>
        <p className="kicker">Shop</p>
        <button type="button" onClick={() => onNavigate({ name: 'shop', category: 'all' })}>
          The edit
        </button>
        <button type="button" onClick={() => onNavigate({ name: 'shop', category: 'banarasi' })}>
          Banarasi
        </button>
        <button type="button" onClick={() => onNavigate({ name: 'shop', category: 'jamdani' })}>
          Jamdani
        </button>
      </div>
      <div>
        <p className="kicker">Visit</p>
        <button type="button" onClick={() => onNavigate({ name: 'about' })}>
          About
        </button>
        <p>hello@tana.studio</p>
      </div>
    </footer>
  )
}

function Arrow() {
  return (
    <span className="arrow" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="16" height="16">
        <path
          d="M7 17L17 7M17 7H9M17 7V15"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </span>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 22 14" width="20" height="12" aria-hidden="true">
      <path d="M1 1h20M1 13h20" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M6 8h12l-1 12H7L6 8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9 8V7a3 3 0 0 1 6 0v1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}
