export const PLANS = [
  {
    name: 'Free',
    slug: 'free',
    quota: 10,
    pagesPerPdf: 10,
    price: {
      amount: 0,
      priceIds: {
        test: '',
        production: '',
      }
    }
  },
  {
    name: 'Pro',
    slug: 'pro',
    quota: 100,
    pagesPerPdf: 100,
    price: {
      amount: 5,
      priceIds: {
        test: 'price_1PmZYsLw9EkY8Qa8qbXSAqXN',
        production: '',
      }
    }
  }
]