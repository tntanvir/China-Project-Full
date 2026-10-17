import { MapPin, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

const addresses = [
  {
    label: "Primary Shipping",
    recipient: "PCB Procurement Team",
    address: "Add your production shipping address from profile settings.",
  },
];

export default function AddressBookPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="premium-eyebrow">
            <MapPin className="h-4 w-4" />
            Customer Address Book
          </p>
          <h1 className="mt-3 text-3xl font-black text-foreground">Address Book</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Manage shipping destinations for PCB manufacturing orders, invoices, and delivery coordination.
          </p>
        </div>
        <Button className="rounded-full">
          <Plus className="h-4 w-4" />
          Add Address
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((item) => (
          <article key={item.label} className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">{item.label}</p>
            <h2 className="mt-3 text-xl font-black text-foreground">{item.recipient}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.address}</p>
            <Button variant="outline" className="mt-5 rounded-full">
              Edit Address
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
