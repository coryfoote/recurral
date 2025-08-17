import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { ArrowRight, Check, Percent, Zap, Shield, BarChart3, CreditCard, Link2, Settings, Users, PlayCircle, Sparkles } from "lucide-react";

// If shadcn/ui is available in your environment, these imports will use it.
// Otherwise, the fallback components below will render with Tailwind classes.
let Button: any, Card: any, CardContent: any, Input: any, Badge: any, Slider: any, Dialog: any, DialogContent: any, DialogHeader: any, DialogTitle: any;
try {
  // @ts-ignore
  ({ Button } = require("@/components/ui/button"));
  // @ts-ignore
  ({ Card, CardContent } = require("@/components/ui/card"));
  // @ts-ignore
  ({ Input } = require("@/components/ui/input"));
  // @ts-ignore
  ({ Badge } = require("@/components/ui/badge"));
  // @ts-ignore
  ({ Slider } = require("@/components/ui/slider"));
  // @ts-ignore
  ({ Dialog, DialogContent, DialogHeader, DialogTitle } = require("@/components/ui/dialog"));
} catch {
  Button = ({ className = "", children, ...props }: any) => (
    <button className={`rounded-2xl px-4 py-2 font-medium shadow-sm hover:shadow md:px-5 md:py-2.5 transition ${className}`} {...props}>{children}</button>
  );
  Card = ({ className = "", children, ...props }: any) => (
    <div className={`rounded-3xl bg-white/70 dark:bg-white/5 backdrop-blur border border-white/30 shadow-sm ${className}`} {...props}>{children}</div>
  );
  CardContent = ({ className = "", children, ...props }: any) => (
    <div className={`p-6 md:p-8 ${className}`} {...props}>{children}</div>
  );
  Input = ({ className = "", ...props }: any) => (
    <input className={`w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-white/5 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${className}`} {...props} />
  );
  Badge = ({ className = "", children, ...props }: any) => (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ring-black/10 dark:ring-white/10 ${className}`} {...props}>{children}</span>
  );
  Slider = ({ value, onValueChange, min = 0, max = 100, step = 1 }: any) => (
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e)=>onValueChange?.([Number(e.target.value)])} className="w-full" />
  );
  Dialog = ({ open, children }: any) => open ? <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">{children}</div> : null;
  DialogContent = ({ className = "", children }: any) => (
    <div className={`w-full max-w-2xl rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-xl ${className}`}>{children}</div>
  );
  DialogHeader = ({ children }: any) => <div className="mb-4">{children}</div>;
  DialogTitle = ({ children }: any) => <h3 className="text-xl font-semibold">{children}</h3>;
}

// --- Utility: palette ---
const brand = {
  bg: "bg-gradient-to-br from-indigo-50 via-sky-50 to-fuchsia-50 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900",
  ink: "text-neutral-800 dark:text-neutral-100",
  primary: "from-indigo-600 via-fuchsia-600 to-sky-600",
  ring: "focus:ring-2 focus:ring-indigo-400 focus:outline-none",
  glass: "bg-white/60 dark:bg-white/5 backdrop-blur-lg border border-white/30 dark:border-white/10",
};

// --- Logo ---
const RecurralLogo = ({ className = "h-8" }: { className?: string }) => (
  <div className="flex items-center gap-2">
    <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#6366F1"/>
          <stop offset="50%" stopColor="#A855F7"/>
          <stop offset="100%" stopColor="#0EA5E9"/>
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="14" fill="url(#g)"/>
      <path d="M20 38c0-6 5-10 12-10h3l-3-3 3-3 9 9-9 9-3-3h-3c-4 0-6 2-6 4 0 2 2 4 6 4h14v6H32c-9 0-12-6-12-10z" fill="white"/>
    </svg>
    <span className="font-black tracking-tight text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-sky-600">Recurral</span>
  </div>
);

// --- Mock data helpers ---
function buildChart(price: number, discount: number) {
  const points = Array.from({ length: 11 }).map((_, i) => {
    const referrals = i;
    const totalDiscount = Math.min(price, referrals * discount);
    return {
      referrals,
      "Effective Price": Math.max(0, price - totalDiscount),
    };
  });
  return points;
}

// --- Sections ---
function Nav() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
        <RecurralLogo />
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#how" className="opacity-80 hover:opacity-100">How it works</a>
          <a href="#demo" className="opacity-80 hover:opacity-100">Live demo</a>
          <a href="#pricing" className="opacity-80 hover:opacity-100">Pricing</a>
          <a href="#faq" className="opacity-80 hover:opacity-100">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          <Button className="hidden sm:inline-block bg-transparent border border-black/10 dark:border-white/20 text-neutral-800 dark:text-neutral-100">Sign in</Button>
          <Button className="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-sky-600 text-white">Start free <ArrowRight className="ml-1 inline h-4 w-4"/></Button>
        </div>
      </div>
    </nav>
  );
}

function Hero({ onOpenAdmin }: { onOpenAdmin: () => void }) {
  return (
    <section className={`relative overflow-hidden ${brand.bg} pt-16`}>
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full blur-3xl opacity-40 bg-gradient-to-br from-indigo-400 via-fuchsia-400 to-sky-400"/>
      <div className="absolute -bottom-24 -left-24 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-30 bg-gradient-to-tr from-sky-300 via-indigo-400 to-fuchsia-400"/>

      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center py-16">
        <div>
          <motion.h1 initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.6}} className="text-4xl md:text-6xl font-black tracking-tight text-neutral-900 dark:text-white">
            Referral-powered discounts for recurring revenue — on autopilot.
          </motion.h1>
          <p className="mt-5 text-neutral-700 dark:text-neutral-300 text-lg max-w-xl">
            Recurral plugs into Stripe so your customers earn a fixed discount for every friend they refer — up to <span className="font-semibold">100% off</span>. Discounts activate and reverse <span className="font-semibold">in real time</span> as referred customers start or stop paying.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button className="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-sky-600 text-white">Connect with Stripe <Link2 className="ml-2 h-4 w-4"/></Button>
            <Button onClick={onOpenAdmin} className="bg-white text-neutral-900 border border-black/10 dark:bg-neutral-900 dark:text-white dark:border-white/10">Open Admin Demo <PlayCircle className="ml-2 h-4 w-4"/></Button>
            <Badge className="bg-white/80 dark:bg-white/10">No code required</Badge>
            <Badge className="bg-white/80 dark:bg-white/10">Works with Stripe Billing</Badge>
          </div>

          <div className="mt-8 flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-2"><Shield className="h-4 w-4"/> Secure by design</div>
            <div className="flex items-center gap-2"><Zap className="h-4 w-4"/> Instant proration</div>
            <div className="flex items-center gap-2"><Percent className="h-4 w-4"/> Up to 100% off</div>
          </div>
        </div>

        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className={`rounded-3xl p-6 ${brand.glass}`}>
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: <Settings className="h-5 w-5"/>,
      title: "Set your referral discount",
      text: "Admins choose a fixed $ or % off per successful referral, capped at 100%."
    },
    {
      icon: <Link2 className="h-5 w-5"/>,
      title: "Connect Stripe in minutes",
      text: "OAuth into your Stripe account. Recurral maps to your products, prices, and customers."
    },
    {
      icon: <CreditCard className="h-5 w-5"/>,
      title: "Automated discounts",
      text: "We apply discounts to the referrer’s next invoice and reverse them if referrals churn."
    },
    {
      icon: <BarChart3 className="h-5 w-5"/>,
      title: "Track performance",
      text: "See LTV lift, CAC payback from referrals, and who’s earning free plans."
    },
  ];

  return (
    <section id="how" className="py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-center">How it works</h2>
        <p className="mt-4 text-center text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">Zero manual spreadsheets. Real-time sync with Stripe Subscriptions & Invoices.</p>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl grid place-items-center bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-sky-600 text-white shadow">
                  {s.icon}
                </div>
                <h3 className="font-semibold">{s.title}</h3>
              </div>
              <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">{s.text}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {i===2 && (
                  <>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600"/> Initiate when referred pays first invoice</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600"/> Reverse on cancellation, non-payment, or refund</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600"/> Respect proration & invoice finalization</li>
                  </>
                )}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Calculator() {
  const [price, setPrice] = useState(30);
  const [discount, setDiscount] = useState(10);
  const [refs, setRefs] = useState(1);
  const capped = Math.min(price, refs * discount);
  const effective = Math.max(0, price - capped);
  const data = useMemo(()=>buildChart(price, discount), [price, discount]);

  return (
    <section id="demo" className="py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h3 className="text-2xl md:text-4xl font-black tracking-tight">Referral impact calculator</h3>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400">Try Ryan’s gym example: $30/mo price, $10 per referral. At three referrals, Ryan pays $0 while they stay active.</p>

          <div className={`mt-6 p-5 rounded-3xl ${brand.glass}`}>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs uppercase tracking-wide opacity-70">Price / month</label>
                <Input type="number" min={0} value={price} onChange={(e:any)=>setPrice(Number(e.target.value)||0)} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide opacity-70">Discount / referral</label>
                <Input type="number" min={0} value={discount} onChange={(e:any)=>setDiscount(Number(e.target.value)||0)} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide opacity-70">Referrals</label>
                <Input type="number" min={0} value={refs} onChange={(e:any)=>setRefs(Number(e.target.value)||0)} />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-end gap-4">
                <div className="text-5xl font-black">${effective.toFixed(2)}</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">per month after discounts</div>
              </div>
              <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Total discount: ${capped.toFixed(2)} (capped at 100% of price)</div>
            </div>
          </div>
        </div>
        <div className={`rounded-3xl p-6 ${brand.glass}`}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="c" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.5}/>
                  <stop offset="50%" stopColor="#A855F7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
              <XAxis dataKey="referrals"/>
              <YAxis/>
              <Tooltip/>
              <Area type="monotone" dataKey="Effective Price" stroke="#6366F1" fill="url(#c)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">Graph shows how monthly price falls as referrals increase, capped at zero.</div>
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  const stats = [
    { label: "Active referrers", value: "482", delta: "+18%" },
    { label: "Avg $/referral", value: "$12.40", delta: "+6%" },
    { label: "Invoices discounted", value: "3,241", delta: "+24%" },
  ];
  const sample = [
    { name: "Ryan", price: 30, refs: 3, discount: 10 },
    { name: "Jessica", price: 30, refs: 0, discount: 10 },
    { name: "Maya", price: 30, refs: 1, discount: 10 },
  ];
  return (
    <div>
      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="rounded-2xl p-4 bg-white/70 dark:bg-white/5 border border-white/30 dark:border-white/10">
            <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{s.label}</div>
            <div className="mt-1 text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-emerald-600">{s.delta}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/30 dark:border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/60 dark:bg-white/5">
            <tr>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Plan</th>
              <th className="p-3 text-left">Refs</th>
              <th className="p-3 text-left">Discount</th>
              <th className="p-3 text-left">Effective</th>
            </tr>
          </thead>
          <tbody>
            {sample.map((x,i)=>{
              const capped = Math.min(x.price, x.refs * x.discount);
              const effective = Math.max(0, x.price - capped);
              return (
                <tr key={i} className="border-t border-white/30 dark:border-white/10">
                  <td className="p-3 font-medium">{x.name}</td>
                  <td className="p-3">${x.price}/mo</td>
                  <td className="p-3">{x.refs}</td>
                  <td className="p-3">${capped}</td>
                  <td className="p-3 font-semibold">${effective}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function IntegrationSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <h3 className="text-2xl md:text-4xl font-black tracking-tight">Stripe-native by design</h3>
          <ul className="mt-4 space-y-3 text-neutral-700 dark:text-neutral-300">
            <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600"/> OAuth connect — no API keys to paste.</li>
            <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600"/> Listens to <code>checkout.session.completed</code>, <code>customer.subscription.updated</code>, <code>invoice.finalized</code>, and <code>customer.subscription.deleted</code>.</li>
            <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600"/> Applies credits or coupon adjustments on the referrer’s next invoice; reverses instantly on churn.</li>
            <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 text-green-600"/> Works with metered & tiered pricing; respects proration.</li>
          </ul>
        </div>
        <Card>
          <CardContent>
            <div className="flex items-center gap-2 text-sm font-medium mb-3"><Sparkles className="h-4 w-4"/> Example webhook logic (Node/TypeScript)</div>
            <pre className="text-xs bg-neutral-950 text-neutral-50 rounded-2xl p-4 overflow-auto">
{`// 1) When a referred customer pays their first invoice
//    - look up the referrer -> increment active referral count
//    - compute discount = min(referrals * perReferral, 100% of price)
//    - attach/update Stripe Coupon or Customer Balance for referrer

// 2) On subscription cancellation / payment failure / refund
//    - decrement active referral count
//    - recompute discount; if zero, remove coupon / zero out credit

// Pseudocode outline
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET!, { apiVersion: '2024-06-20' });

export async function handleWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'invoice.finalized': {
      const invoice = event.data.object as Stripe.Invoice;
      if (!invoice.customer) break;
      // If this is the REFERRER's invoice, recompute and apply discount
      await applyOrReverseDiscountForReferrer(invoice.customer as string);
      break;
    }
    case 'customer.subscription.deleted':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      // Track churn/re-activation of referred customers and update referrers
      await reconcileReferredStatus(sub.customer as string);
      break;
    }
    case 'checkout.session.completed': {
      const cs = event.data.object as Stripe.Checkout.Session;
      // If this checkout came from a referral link, store the referral relationship
      await persistReferral(cs.customer as string, cs.metadata?.referrer_customer_id);
      break;
    }
  }
}

async function applyOrReverseDiscountForReferrer(referrerCustomerId: string) {
  // 1) Load active referral count and per-referral amount configured by admin
  const { perReferral, currency } = await getMerchantSettings();
  const activeCount = await getActiveReferralCount(referrerCustomerId);

  // 2) Compute discount vs. price caps per product/price
  const upcoming = await stripe.invoices.retrieveUpcoming({ customer: referrerCustomerId });
  const priceTotal = upcoming.total ?? 0; // in cents
  const perReferralCents = toMinor(perReferral, currency);
  const discountCents = Math.min(priceTotal, activeCount * perReferralCents);

  // 3) Apply using Customer Balance (simple, proration-friendly)
  await stripe.customers.update(referrerCustomerId, {
    balance: -(discountCents), // negative balance = credit
  });
}
`}
            </pre>
            <div className="mt-3 text-xs text-neutral-600 dark:text-neutral-400">Full auth, retries, idempotency keys, and signature verification recommended for production.</div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function Pricing() {
  const items = [
    {
      name: "Starter",
      price: "$0",
      blurb: "2% of discounted invoice value",
      features: ["Up to 3 products", "Referral links & widgets", "Basic analytics"]
    },
    {
      name: "Growth",
      price: "$99",
      blurb: "+1% usage fee",
      featured: true,
      features: ["Unlimited products", "Advanced rules & tiers", "Webhook export", "Priority support"]
    },
    {
      name: "Scale",
      price: "Custom",
      blurb: "Volume pricing",
      features: ["SLA & SSO", "Dedicated support", "Custom data pipelines"]
    }
  ];
  return (
    <section id="pricing" className="py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <h3 className="text-3xl md:text-5xl font-black tracking-tight text-center">Simple, aligned pricing</h3>
        <p className="mt-3 text-center text-neutral-600 dark:text-neutral-400">Only pay when your customers save — and you grow.</p>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {items.map((p, i)=> (
            <div key={i} className={`rounded-3xl p-6 border ${p.featured ? 'border-transparent bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-sky-600 text-white' : 'border-black/10 dark:border-white/10'} shadow`}> 
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-bold">{p.name}</h4>
                {p.featured && <Badge className="bg-white/20 text-white">Most popular</Badge>}
              </div>
              <div className="mt-2 text-4xl font-black">{p.price}<span className="text-base font-medium opacity-80">/mo</span></div>
              <div className={`mt-1 ${p.featured ? 'opacity-90' : 'text-neutral-600 dark:text-neutral-400'}`}>{p.blurb}</div>
              <ul className="mt-5 space-y-2 text-sm">
                {p.features.map((f,j)=>(
                  <li key={j} className="flex items-center gap-2"><Check className="h-4 w-4"/> {f}</li>
                ))}
              </ul>
              <Button className={`mt-6 w-full ${p.featured ? 'bg-white text-neutral-900' : 'bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-sky-600 text-white'}`}>Get started</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {q:"Can a customer get totally free billing?", a:"Yes. If their total per-referral discounts meet or exceed their monthly price, their effective price becomes $0 for that cycle, capped at 100%."},
    {q:"What happens if a referred customer cancels?", a:"Their referrer’s discount is reduced in real time and will reflect on the next invoice, reversing any unused credit."},
    {q:"Do you support percentage-based discounts?", a:"Yes — set $ or % per referral. Dollar-amount discounts are shown in this demo."},
    {q:"Is coding required?", a:"No. Connect Stripe and drop our referral widget. Optional Webhooks and API are available for custom flows."},
  ]
  return (
    <section id="faq" className="py-16">
      <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
        <h3 className="text-3xl md:text-5xl font-black tracking-tight text-center">FAQ</h3>
        <div className="mt-8 divide-y divide-black/10 dark:divide-white/10">
          {faqs.map((f,i)=>(
            <details key={i} className="py-4 group">
              <summary className="cursor-pointer list-none font-medium flex items-center justify-between">{f.q}<ArrowRight className="h-4 w-4 transition-transform group-open:rotate-90"/></summary>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 border-t border-black/5 dark:border-white/10">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <RecurralLogo />
        <div className="text-sm text-neutral-600 dark:text-neutral-400">© {new Date().getFullYear()} Recurral, Inc. All rights reserved.</div>
      </div>
    </footer>
  );
}

export default function RecurralLanding() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-950">
      <Nav />
      <Hero onOpenAdmin={()=>setOpen(true)} />
      <HowItWorks />
      <Calculator />
      <IntegrationSection />
      <Pricing />
      <FAQ />
      <Footer />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin preview</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Set parameters for per-referral discounts and rules. These settings apply instantly to all referrers.</p>
          <AdminConfigurator onClose={()=>setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AdminConfigurator({ onClose }: { onClose?: ()=>void }) {
  const [unit, setUnit] = useState<'$' | '%'>('$');
  const [amount, setAmount] = useState(10);
  const [capPct, setCapPct] = useState(100);
  const [requireFirstPayment, setRequireFirstPayment] = useState(true);

  return (
    <div className={`p-5 rounded-2xl ${brand.glass}`}>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-wide opacity-70">Discount unit</label>
          <div className="mt-2 flex gap-2">
            <Button className={`${unit === '$' ? 'bg-neutral-900 text-white' : 'bg-white'} border border-black/10`} onClick={()=>setUnit('$')}>$</Button>
            <Button className={`${unit === '%' ? 'bg-neutral-900 text-white' : 'bg-white'} border border-black/10`} onClick={()=>setUnit('%')}>%</Button>
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide opacity-70">Amount per referral</label>
          <Input type="number" min={0} value={amount} onChange={(e:any)=>setAmount(Number(e.target.value)||0)} />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide opacity-70">Max discount cap</label>
          <div className="flex items-center gap-3">
            <Input type="number" min={0} max={100} value={capPct} onChange={(e:any)=>setCapPct(Math.max(0, Math.min(100, Number(e.target.value)||0)))} />
            <span className="text-sm opacity-70">%</span>
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide opacity-70">Start after first successful payment</label>
          <div className="mt-2">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={requireFirstPayment} onChange={(e)=>setRequireFirstPayment(e.target.checked)} /> Enable safeguard
            </label>
          </div>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <div className="text-sm text-neutral-600 dark:text-neutral-400">Example: If amount is ${amount} {unit === '%' ? 'percent' : 'per referral'}, discounts will cap at {capPct}% of price.</div>
        <Button className="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-sky-600 text-white" onClick={onClose}>Save</Button>
      </div>
    </div>
  );
}