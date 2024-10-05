export const creditlifeConfig = [
  {
    description: 'Death Only',
    product_type:'credit_life',
    death: true,
    perm_disability: false,
    critical_illness: false,
    temp_disability: false,
    retrenchment: false,
    funeral: false,
    cash_back: false,
    run: false
  },
  {
    description: 'Death & PD',
    product_type:'credit_life',
    death: true,
    perm_disability: true,
    critical_illness: false,
    temp_disability: false,
    retrenchment: false,
    funeral: false,
    cash_back: false,
    run: false
  },  {
    description: 'Death & CI',
    product_type:'credit_life',
    death: true,
    perm_disability: false,
    critical_illness: true,
    temp_disability: false,
    retrenchment: false,
    funeral: false,
    cash_back: false,
    run: false
  },  {
    description: 'Death, PD & CI',
    product_type:'credit_life',
    death: true,
    perm_disability: true,
    critical_illness: true,
    temp_disability: false,
    retrenchment: false,
    funeral: false,
    cash_back: false,
    run: false
  },  {
    description: 'Death & TD',
    product_type:'credit_life',
    death: true,
    perm_disability: false,
    critical_illness: false,
    temp_disability: true,
    retrenchment: false,
    funeral: false,
    cash_back: false,
    run: false
  },  {
    description: 'Death & Retrenchment',
    product_type:'credit_life',
    death: true,
    perm_disability: false,
    critical_illness: false,
    temp_disability: false,
    retrenchment: true,
    funeral: false,
    cash_back: false,
    run: false
  },  {
    description: 'Death & Cashback',
    product_type:'credit_life',
    death: true,
    perm_disability: false,
    critical_illness: false,
    temp_disability: false,
    retrenchment: false,
    funeral: false,
    cash_back: true,
    run: false
  },
]
