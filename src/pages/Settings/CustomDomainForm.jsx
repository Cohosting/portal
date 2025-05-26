import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

// Dialog grouped
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";

// Button, Input, Label imported separately
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Select related grouped
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Icons grouped
import { AlertCircle, ExternalLink } from "lucide-react";

export const CustomDomainForm = ({
  mode = 'create',  // 'create' | 'edit'
  initialValues = { domain: '', provider: '', subdomain: '' },
  portalId,
  portalSettings = {},
  onSuccess = () => {},
  open,
  onOpenChange
}) => {
  const [domain, setDomain] = useState(initialValues.domain);
  const [provider, setProvider] = useState(initialValues.provider);
  const [subdomain, setSubdomain] = useState(initialValues.subdomain);
  const [error, setError] = useState({ domain: '', subdomain: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setDomain(initialValues.domain);
      setProvider(initialValues.provider);
      setSubdomain(initialValues.subdomain);
    }
  }, [initialValues, open]);

  const providers = [
    'GoDaddy', 'Google Domains', 'Namecheap', 'Bluehost', 'HostGator', 'Network Solutions',
  ];

  const isValidDomain = d => /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/.test(d);
  const isValidSubdomain = s => /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i.test(s);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let errorObj = {};

    if (!isValidDomain(domain)) errorObj.domain = 'Invalid domain.';
    if (!isValidSubdomain(subdomain)) errorObj.subdomain = 'Invalid subdomain.';

    if (Object.keys(errorObj).length) {
      setError(errorObj);
      return;
    }

    setIsLoading(true);
    const cleanDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '');
    const cleanSubdomain = subdomain.toLowerCase().trim();

    try {
      const { error: portalError } = await supabase.from('portals').update({
        settings: {
          ...portalSettings,
          domain: cleanDomain,
          provider,
          subdomain: cleanSubdomain,
          customDomain: `${cleanSubdomain}.${cleanDomain}`,
        },
      }).eq('id', portalId);

      if (portalError) throw portalError;

      await fetch(
        'https://api.vercel.com/v10/projects/portal/domains?teamId=team_X4iVsHVRDNhpdBRTph9ykl2S',
        {
          body: JSON.stringify({ name: `${cleanSubdomain}.${cleanDomain}` }),
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer gFbWyYR3oyt71Qx4f0VNkHon` },
          method: 'POST',
        }
      );

      setIsLoading(false);
      setIsConfirmationOpen(true);
      onSuccess();

    } catch (err) {
      console.error('Error updating domain', err);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>{mode === 'edit' ? 'Edit Custom Domain' : 'Connect a Custom Domain'}</DialogTitle>
            <DialogDescription>
              {mode === 'edit' ? 'Update domain information.' : 'Enter domain details to connect.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-3">
            <div className="space-y-2">
              <Label htmlFor="domain">Domain name</Label>
              <Input
                id="domain"
                placeholder="yourdomain.com"
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value);
                  if (error.domain) setError(prev => ({ ...prev, domain: '' }));
                }}
                className={error.domain ? "border-red-500" : ""}
              />
              {error.domain && <div className="flex items-center text-red-500 text-sm mt-1"><AlertCircle className="h-4 w-4 mr-1" />{error.domain}</div>}
            </div>

            <div className="space-y-2">
              <Label>Domain Provider</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {providers.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdomain</Label>
              <Input
                id="subdomain"
                placeholder="app"
                value={subdomain}
                onChange={(e) => {
                  setSubdomain(e.target.value);
                  if (error.subdomain) setError(prev => ({ ...prev, subdomain: '' }));
                }}
                className={error.subdomain ? "border-red-500" : ""}
              />
              {error.subdomain && <div className="flex items-center text-red-500 text-sm mt-1"><AlertCircle className="h-4 w-4 mr-1" />{error.subdomain}</div>}
            </div>

            <p className="text-sm text-gray-500 mt-2">
              {subdomain && domain
                ? `Preview URL: ${subdomain}.${domain}`
                : 'Enter domain & subdomain to preview URL.'}
            </p>
          </form>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-black text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Domain Instructions</DialogTitle>
            <DialogDescription>Please update DNS records accordingly.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
              <li>Login to your {provider} account.</li>
              <li>Navigate to DNS settings for {domain}.</li>
              <li>Create a CNAME record pointing {subdomain} to your-service-address.com</li>
              <li>Propagation can take up to 48 hours.</li>
            </ol>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsConfirmationOpen(false)} className="bg-black text-white">
              Close <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
