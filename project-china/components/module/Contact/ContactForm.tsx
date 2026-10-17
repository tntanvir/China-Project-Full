"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FormData = {
  fullName: string;
  email: string;
  companyName: string;
  phone: string;
  description: string;
};

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    companyName: "",
    phone: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof FormData]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.fullName || formData.fullName.length < 3) newErrors.fullName = "Full name must be at least 3 characters";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email address";
    if (!formData.description || formData.description.length < 10) newErrors.description = "Please provide more details in your message";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 500));
      toast.info("Contact API removed. Message was not sent to a server.");

      setFormData({
        fullName: "",
        email: "",
        companyName: "",
        phone: "",
        description: "",
      });
    } catch {
      toast.error("Failed to process the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium">Full Name <span className="text-red-500">*</span></label>
          <Input 
            id="fullName" name="fullName" placeholder="John Doe" 
            value={formData.fullName} onChange={handleChange} 
            className={errors.fullName ? "border-red-500" : ""}
          />
          {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email Address <span className="text-red-500">*</span></label>
          <Input 
            id="email" name="email" type="email" placeholder="john@example.com" 
            value={formData.email} onChange={handleChange} 
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="companyName" className="text-sm font-medium">Company Name</label>
          <Input 
            id="companyName" name="companyName" placeholder="Acme Inc." 
            value={formData.companyName} onChange={handleChange} 
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
          <Input 
            id="phone" name="phone" placeholder="+1234567890" 
            value={formData.phone} onChange={handleChange} 
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Message <span className="text-red-500">*</span></label>
        <textarea 
          id="description" name="description" placeholder="How can we help you?" 
          rows={5} 
          value={formData.description} onChange={handleChange} 
          className={`flex w-full rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.description ? "border-red-500 focus-visible:ring-red-500" : "border-input"}`}
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
        Send Message
      </Button>
    </form>
  );
}
