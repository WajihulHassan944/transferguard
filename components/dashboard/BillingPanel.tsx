import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CreditCard, 
  Users, 
  Fingerprint, 
  Plus, 
  Minus,
  ShoppingCart,
  Check,
  Building2,
  Receipt,
  Scale,
  Sparkles,
  AlertCircle,
  UserPlus,
  Loader2,
  Pencil,
  Trash2,
  Banknote,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { nl, enUS } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";

interface BillingPanelProps {
  userId: string;
}

interface Team {
  id: string;
  name: string;
  owner_id: string;
  credits_balance: number;
  credits_total: number;
  subscription_status: string;
  billing_cycle: string;
}

interface TeamMember {
  id: string;
  role: string;
  invited_email: string | null;
  joined_at: string | null;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  description: string;
}

interface PaymentMethod {
  id: string;
  type: "card" | "sepa" | "ideal";
  last4?: string;
  brand?: string;
  bankName?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

// Correct pricing: Legal = €79/month base
const BASE_PRICE_LEGAL = 79;
const SEAT_PRICE_LEGAL = 31;
const CREDIT_PRICE = 5; // €5 per ID verification credit

export function BillingPanel({ userId }: BillingPanelProps) {
  const { t, language } = useLanguage();
  const dateLocale = language === 'nl' ? nl : enUS;

  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [seatModalOpen, setSeatModalOpen] = useState(false);
  const [paymentMethodModalOpen, setPaymentMethodModalOpen] = useState(false);
  const [creditAmount, setCreditAmount] = useState(10);
  const [seatAmount, setSeatAmount] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isAddingSeats, setIsAddingSeats] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  // Simulated payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "pm_1", type: "card", last4: "4242", brand: "Visa", expiryMonth: 12, expiryYear: 2027, isDefault: true },
  ]);
  const [newPaymentType, setNewPaymentType] = useState<"card" | "sepa" | "ideal">("card");
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");
  const [newCardCvc, setNewCardCvc] = useState("");
  const [newIban, setNewIban] = useState("");
  const [selectedBank, setSelectedBank] = useState("");

  // Mock invoices
  const mockInvoices: Invoice[] = [
    { id: "INV-001", date: "2025-01-15", amount: 79, status: "paid", description: "Legal - January 2025" },
    { id: "INV-002", date: "2024-12-15", amount: 79, status: "paid", description: "Legal - December 2024" },
  ];


  const calculateMonthlyPrice = () => {
    const seatCount = members.length;
    return BASE_PRICE_LEGAL + Math.max(seatCount - 1, 0) * SEAT_PRICE_LEGAL;
  };

  const handlePurchaseCredits = async () => {
    if (!team) {
      toast.error(t('billing.noTeamFound'));
      return;
    }

    setIsPurchasing(true);
   setIsPurchasing(false);
  };

  const handleAddSeats = async () => {
    if (!team) {
      toast.error(t('billing.noTeamFound'));
      return;
    }

    setIsAddingSeats(true);

    try {
      // Simulate Stripe checkout for seats
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real implementation, this would update the subscription
      toast.success(
        language === 'nl'
          ? `${seatAmount} extra ${seatAmount === 1 ? 'seat' : 'seats'} toegevoegd!`
          : `${seatAmount} additional ${seatAmount === 1 ? 'seat' : 'seats'} added!`,
        {
          description: language === 'nl'
            ? `Extra maandkosten: €${(seatAmount * SEAT_PRICE_LEGAL).toFixed(2)}/maand`
            : `Additional monthly cost: €${(seatAmount * SEAT_PRICE_LEGAL).toFixed(2)}/month`,
        }
      );

      setSeatModalOpen(false);
      setSeatAmount(1);
    } catch (error) {
      console.error("Error adding seats:", error);
      toast.error(
        language === 'nl'
          ? "Er is een fout opgetreden bij het toevoegen van seats"
          : "An error occurred while adding seats"
      );
    } finally {
      setIsAddingSeats(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {language === 'nl' ? 'Billing gegevens laden...' : 'Loading billing data...'}
      </div>
    );
  }

  if (!team) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t('billing.title')}</h1>
        <Card className="p-12 text-center">
          <Building2 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {language === 'nl' ? 'Geen team gevonden' : 'No team found'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {language === 'nl' 
              ? 'Maak eerst een team aan om je abonnement en credits te beheren.'
              : 'Create a team first to manage your subscription and credits.'}
          </p>
          <Button onClick={() => window.location.href = "/dashboard?view=teams"}>
            <Plus className="h-4 w-4 mr-2" />
            {language === 'nl' ? 'Team Aanmaken' : 'Create Team'}
          </Button>
        </Card>
      </div>
    );
  }

  const monthlyPrice = calculateMonthlyPrice();
  const activeSeats = members.filter(m => m.joined_at).length;
  const pendingInvites = members.filter(m => !m.joined_at).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('billing.title')}</h1>
        <Badge variant="outline" className="text-sm bg-amber-50 text-amber-700 border-amber-200">
          <Scale className="h-3 w-3 mr-1" />
          Legal
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Monthly Cost Card */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <Badge variant="secondary">
              {language === 'nl' ? 'Maandelijks' : 'Monthly'}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {language === 'nl' ? 'Totale maandkosten' : 'Total monthly cost'}
            </p>
            <p className="text-3xl font-bold">€{monthlyPrice}</p>
            <p className="text-xs text-muted-foreground">
              €{BASE_PRICE_LEGAL} {language === 'nl' ? 'basis' : 'base'} + {Math.max(members.length - 1, 0)} {language === 'nl' ? 'extra seats' : 'extra seats'} × €{SEAT_PRICE_LEGAL}
            </p>
          </div>
        </Card>

        {/* Seats Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-muted">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <Button size="sm" variant="outline" onClick={() => setSeatModalOpen(true)}>
              <Plus className="h-3 w-3 mr-1" />
              {language === 'nl' ? 'Voeg Seats Toe' : 'Add Seats'}
            </Button>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {language === 'nl' ? 'Actieve Seats' : 'Active Seats'}
            </p>
            <p className="text-3xl font-bold">{activeSeats || 1}</p>
            <p className="text-xs text-muted-foreground">
              1 {language === 'nl' ? 'seat inbegrepen' : 'seat included'}, {Math.max(activeSeats - 1, 0)} extra
            </p>
          </div>
        </Card>

        {/* Credits Card */}
        <Card className="p-6 bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Fingerprint className="h-5 w-5 text-amber-600" />
            </div>
            <Button size="sm" variant="outline" onClick={() => setCreditModalOpen(true)}>
              <Plus className="h-3 w-3 mr-1" />
              {language === 'nl' ? 'Koop Credits' : 'Buy Credits'}
            </Button>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {language === 'nl' ? 'ID Verification Credits' : 'ID Verification Credits'}
            </p>
            <p className="text-3xl font-bold">{team.credits_balance}</p>
            <p className="text-xs text-muted-foreground">
              €{CREDIT_PRICE.toFixed(2)} {language === 'nl' ? 'per credit' : 'per credit'}
            </p>
          </div>
        </Card>
      </div>

      {/* Credit Balance Warning */}
      {team.credits_balance < 5 && (
        <Card className="p-4 border-amber-500/50 bg-amber-500/5">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-amber-800">
                {language === 'nl' ? 'Credits bijna op' : 'Credits running low'}
              </p>
              <p className="text-sm text-amber-700">
                {language === 'nl' 
                  ? `Je hebt nog ${team.credits_balance} ID verification credits. Koop extra credits om identity-verified transfers te blijven versturen.`
                  : `You have ${team.credits_balance} ID verification credits remaining. Purchase more credits to continue sending identity-verified transfers.`}
              </p>
            </div>
            <Button size="sm" onClick={() => setCreditModalOpen(true)}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              {language === 'nl' ? 'Koop Nu' : 'Buy Now'}
            </Button>
          </div>
        </Card>
      )}

      {/* Pricing Breakdown */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          {language === 'nl' ? 'Prijsoverzicht' : 'Price Overview'}
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{language === 'nl' ? 'Onderdeel' : 'Item'}</TableHead>
              <TableHead className="text-right">{language === 'nl' ? 'Prijs' : 'Price'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-amber-600" />
                  Legal {language === 'nl' ? 'Basis (1 seat inbegrepen)' : 'Base (1 seat included)'}
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">€{BASE_PRICE_LEGAL}/{language === 'nl' ? 'maand' : 'month'}</TableCell>
            </TableRow>
            {members.length > 1 && (
              <TableRow>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {language === 'nl' ? 'Extra Seats' : 'Extra Seats'} ({members.length - 1} × €{SEAT_PRICE_LEGAL})
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  €{(members.length - 1) * SEAT_PRICE_LEGAL}/{language === 'nl' ? 'maand' : 'month'}
                </TableCell>
              </TableRow>
            )}
            <TableRow className="border-t-2">
              <TableCell className="font-semibold">{language === 'nl' ? 'Totaal' : 'Total'}</TableCell>
              <TableCell className="text-right font-bold text-lg">€{monthlyPrice}/{language === 'nl' ? 'maand' : 'month'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      {/* Payment Methods */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {language === 'nl' ? 'Betaalmethoden' : 'Payment Methods'}
          </h2>
          <Button size="sm" variant="outline" onClick={() => setPaymentMethodModalOpen(true)}>
            <Plus className="h-3 w-3 mr-1" />
            {language === 'nl' ? 'Voeg Toe' : 'Add New'}
          </Button>
        </div>
        
        <div className="space-y-3">
          {paymentMethods.map((pm) => (
            <div 
              key={pm.id} 
              className={`flex items-center justify-between p-4 rounded-lg border ${pm.isDefault ? 'border-primary bg-primary/5' : 'border-border'}`}
            >
              <div className="flex items-center gap-3">
                {pm.type === "card" && (
                  <div className="p-2 rounded-lg bg-muted">
                    <CreditCard className="h-5 w-5" />
                  </div>
                )}
                {pm.type === "sepa" && (
                  <div className="p-2 rounded-lg bg-muted">
                    <Banknote className="h-5 w-5" />
                  </div>
                )}
                {pm.type === "ideal" && (
                  <div className="p-2 rounded-lg bg-muted">
                    <Building2 className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {pm.type === "card" && `${pm.brand} •••• ${pm.last4}`}
                      {pm.type === "sepa" && `SEPA •••• ${pm.last4}`}
                      {pm.type === "ideal" && `iDEAL - ${pm.bankName}`}
                    </span>
                    {pm.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        {language === 'nl' ? 'Standaard' : 'Default'}
                      </Badge>
                    )}
                  </div>
                  {pm.type === "card" && pm.expiryMonth && pm.expiryYear && (
                    <p className="text-sm text-muted-foreground">
                      {language === 'nl' ? 'Verloopt' : 'Expires'} {pm.expiryMonth}/{pm.expiryYear}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!pm.isDefault && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setPaymentMethods(prev => prev.map(p => ({ ...p, isDefault: p.id === pm.id })));
                      toast.success(language === 'nl' ? 'Standaard betaalmethode bijgewerkt' : 'Default payment method updated');
                    }}
                  >
                    {language === 'nl' ? 'Maak standaard' : 'Make default'}
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    if (paymentMethods.length === 1) {
                      toast.error(language === 'nl' ? 'Je moet minimaal één betaalmethode hebben' : 'You must have at least one payment method');
                      return;
                    }
                    setPaymentMethods(prev => {
                      const filtered = prev.filter(p => p.id !== pm.id);
                      if (pm.isDefault && filtered.length > 0) {
                        filtered[0].isDefault = true;
                      }
                      return filtered;
                    });
                    toast.success(language === 'nl' ? 'Betaalmethode verwijderd' : 'Payment method removed');
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Invoices */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          {language === 'nl' ? 'Factuurgeschiedenis' : 'Invoice History'}
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{language === 'nl' ? 'Factuurnummer' : 'Invoice Number'}</TableHead>
              <TableHead>{language === 'nl' ? 'Datum' : 'Date'}</TableHead>
              <TableHead>{language === 'nl' ? 'Omschrijving' : 'Description'}</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">{language === 'nl' ? 'Bedrag' : 'Amount'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-mono text-sm">{invoice.id}</TableCell>
                <TableCell>{format(new Date(invoice.date), "d MMM yyyy", { locale: dateLocale })}</TableCell>
                <TableCell>{invoice.description}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={
                      invoice.status === "paid" 
                        ? "bg-green-100 text-green-700 border-green-200" 
                        : invoice.status === "pending"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : "bg-red-100 text-red-700 border-red-200"
                    }
                  >
                    {invoice.status === "paid" && <Check className="h-3 w-3 mr-1" />}
                    {invoice.status === "paid" 
                      ? (language === 'nl' ? 'Betaald' : 'Paid')
                      : invoice.status === "pending" 
                        ? (language === 'nl' ? 'In behandeling' : 'Pending')
                        : (language === 'nl' ? 'Mislukt' : 'Failed')}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">€{invoice.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Credit Purchase Modal */}
      <Dialog open={creditModalOpen} onOpenChange={setCreditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-amber-600" />
              {language === 'nl' ? 'ID Verification Credits Kopen' : 'Buy ID Verification Credits'}
            </DialogTitle>
            <DialogDescription>
              {language === 'nl' 
                ? 'Elke identity-verified transfer kost 1 credit. Credits worden gedeeld met je hele team.'
                : 'Each identity-verified transfer costs 1 credit. Credits are shared with your entire team.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Credit Amount Selector */}
            <div className="space-y-3">
              <Label>{language === 'nl' ? 'Aantal Credits' : 'Number of Credits'}</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCreditAmount(Math.max(1, creditAmount - 5))}
                  disabled={creditAmount <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min={1}
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="text-center text-lg font-bold w-24"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCreditAmount(creditAmount + 5)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Select Buttons */}
            <div className="flex gap-2">
              {[10, 25, 50, 100].map((amount) => (
                <Button
                  key={amount}
                  variant={creditAmount === amount ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCreditAmount(amount)}
                  className="flex-1"
                >
                  {amount}
                </Button>
              ))}
            </div>

            {/* Price Summary */}
            <Card className="p-4 bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">{creditAmount} credits × €{CREDIT_PRICE.toFixed(2)}</span>
                <span className="font-medium">€{(creditAmount * CREDIT_PRICE).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-bold border-t pt-2">
                <span>{language === 'nl' ? 'Totaal (excl. BTW)' : 'Total (excl. VAT)'}</span>
                <span className="text-primary">€{(creditAmount * CREDIT_PRICE).toFixed(2)}</span>
              </div>
            </Card>

            {/* Current Balance */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>{language === 'nl' ? 'Huidig saldo' : 'Current balance'}: {team.credits_balance} credits</span>
              <span className="text-primary">→ {team.credits_balance + creditAmount} credits</span>
            </div>

            {/* Simulated Payment Info */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                {language === 'nl' 
                  ? '💳 Betaling wordt verwerkt via Stripe (gesimuleerd)'
                  : '💳 Payment will be processed via Stripe (simulated)'}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreditModalOpen(false)}>
              {language === 'nl' ? 'Annuleren' : 'Cancel'}
            </Button>
            <Button onClick={handlePurchaseCredits} disabled={isPurchasing}>
              {isPurchasing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {language === 'nl' ? 'Verwerken...' : 'Processing...'}
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {language === 'nl' ? `Betaal €${(creditAmount * CREDIT_PRICE).toFixed(2)}` : `Pay €${(creditAmount * CREDIT_PRICE).toFixed(2)}`}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Seats Modal */}
      <Dialog open={seatModalOpen} onOpenChange={setSeatModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              {language === 'nl' ? 'Extra Seats Toevoegen' : 'Add Extra Seats'}
            </DialogTitle>
            <DialogDescription>
              {language === 'nl' 
                ? 'Voeg extra seats toe aan je Legal abonnement. Elk seat krijgt 10 ID verification credits per maand.'
                : 'Add extra seats to your Legal subscription. Each seat receives 10 ID verification credits per month.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Seat Amount Selector */}
            <div className="space-y-3">
              <Label>{language === 'nl' ? 'Aantal Seats' : 'Number of Seats'}</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSeatAmount(Math.max(1, seatAmount - 1))}
                  disabled={seatAmount <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={seatAmount}
                  onChange={(e) => setSeatAmount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                  className="text-center text-lg font-bold w-24"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSeatAmount(Math.min(100, seatAmount + 1))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Select Buttons */}
            <div className="flex gap-2">
              {[1, 3, 5, 10].map((amount) => (
                <Button
                  key={amount}
                  variant={seatAmount === amount ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSeatAmount(amount)}
                  className="flex-1"
                >
                  {amount}
                </Button>
              ))}
            </div>

            {/* Price Summary */}
            <Card className="p-4 bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">{seatAmount} {seatAmount === 1 ? 'seat' : 'seats'} × €{SEAT_PRICE_LEGAL}/{language === 'nl' ? 'maand' : 'month'}</span>
                <span className="font-medium">€{(seatAmount * SEAT_PRICE_LEGAL).toFixed(2)}/{language === 'nl' ? 'maand' : 'month'}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">{language === 'nl' ? 'Inclusief per seat' : 'Included per seat'}</span>
                <span className="font-medium text-amber-600">10 {language === 'nl' ? 'credits/maand' : 'credits/month'}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-bold border-t pt-2">
                <span>{language === 'nl' ? 'Extra maandkosten' : 'Additional monthly cost'}</span>
                <span className="text-primary">€{(seatAmount * SEAT_PRICE_LEGAL).toFixed(2)}</span>
              </div>
            </Card>

            {/* Current seats info */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{language === 'nl' ? 'Huidige seats' : 'Current seats'}: {activeSeats || 1}</span>
              <span className="text-primary">→ {(activeSeats || 1) + seatAmount} seats</span>
            </div>

            {/* Simulated Payment Info */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                {language === 'nl' 
                  ? '💳 Abonnement wordt bijgewerkt via Stripe (gesimuleerd)'
                  : '💳 Subscription will be updated via Stripe (simulated)'}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSeatModalOpen(false)}>
              {language === 'nl' ? 'Annuleren' : 'Cancel'}
            </Button>
            <Button onClick={handleAddSeats} disabled={isAddingSeats}>
              {isAddingSeats ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {language === 'nl' ? 'Verwerken...' : 'Processing...'}
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  {language === 'nl' ? `+€${(seatAmount * SEAT_PRICE_LEGAL).toFixed(2)}/maand toevoegen` : `Add +€${(seatAmount * SEAT_PRICE_LEGAL).toFixed(2)}/month`}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Method Modal */}
      <Dialog open={paymentMethodModalOpen} onOpenChange={setPaymentMethodModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              {language === 'nl' ? 'Betaalmethode Toevoegen' : 'Add Payment Method'}
            </DialogTitle>
            <DialogDescription>
              {language === 'nl' 
                ? 'Voeg een nieuwe betaalmethode toe aan je account.'
                : 'Add a new payment method to your account.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Payment Type Selector */}
            <div className="space-y-3">
              <Label>{language === 'nl' ? 'Type betaalmethode' : 'Payment method type'}</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={newPaymentType === "card" ? "default" : "outline"}
                  className="flex flex-col h-auto py-3"
                  onClick={() => setNewPaymentType("card")}
                >
                  <CreditCard className="h-5 w-5 mb-1" />
                  <span className="text-xs">
                    {language === 'nl' ? 'Creditcard' : 'Credit Card'}
                  </span>
                </Button>
                <Button
                  variant={newPaymentType === "sepa" ? "default" : "outline"}
                  className="flex flex-col h-auto py-3"
                  onClick={() => setNewPaymentType("sepa")}
                >
                  <Banknote className="h-5 w-5 mb-1" />
                  <span className="text-xs">SEPA</span>
                </Button>
                <Button
                  variant={newPaymentType === "ideal" ? "default" : "outline"}
                  className="flex flex-col h-auto py-3"
                  onClick={() => setNewPaymentType("ideal")}
                >
                  <Building2 className="h-5 w-5 mb-1" />
                  <span className="text-xs">iDEAL</span>
                </Button>
              </div>
            </div>

            {/* Credit Card Form */}
            {newPaymentType === "card" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{language === 'nl' ? 'Kaartnummer' : 'Card number'}</Label>
                  <Input 
                    placeholder="4242 4242 4242 4242" 
                    value={newCardNumber}
                    onChange={(e) => setNewCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{language === 'nl' ? 'Vervaldatum' : 'Expiry'}</Label>
                    <Input 
                      placeholder="MM/YY" 
                      value={newCardExpiry}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2, 4);
                        }
                        setNewCardExpiry(value);
                      }}
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CVC</Label>
                    <Input 
                      placeholder="123" 
                      value={newCardCvc}
                      onChange={(e) => setNewCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SEPA Form */}
            {newPaymentType === "sepa" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>IBAN</Label>
                  <Input 
                    placeholder="NL00 BANK 0000 0000 00" 
                    value={newIban}
                    onChange={(e) => setNewIban(e.target.value.toUpperCase())}
                  />
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">
                    {language === 'nl' 
                      ? 'Door een SEPA machtiging toe te voegen, geef je toestemming voor automatische incasso.'
                      : 'By adding a SEPA mandate, you authorize automatic direct debit payments.'}
                  </p>
                </div>
              </div>
            )}

            {/* iDEAL Form */}
            {newPaymentType === "ideal" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{language === 'nl' ? 'Selecteer je bank' : 'Select your bank'}</Label>
                  <Select value={selectedBank} onValueChange={setSelectedBank}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'nl' ? 'Kies een bank' : 'Choose a bank'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abn">ABN AMRO</SelectItem>
                      <SelectItem value="ing">ING</SelectItem>
                      <SelectItem value="rabo">Rabobank</SelectItem>
                      <SelectItem value="sns">SNS Bank</SelectItem>
                      <SelectItem value="asn">ASN Bank</SelectItem>
                      <SelectItem value="bunq">bunq</SelectItem>
                      <SelectItem value="knab">Knab</SelectItem>
                      <SelectItem value="triodos">Triodos Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">
                    {language === 'nl' 
                      ? 'Je wordt doorgestuurd naar je bank om de betaling te autoriseren.'
                      : 'You will be redirected to your bank to authorize the payment.'}
                  </p>
                </div>
              </div>
            )}

            {/* Simulated Payment Info */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                {language === 'nl' 
                  ? '🔒 Veilige betaling via Stripe (gesimuleerd)'
                  : '🔒 Secure payment via Stripe (simulated)'}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setPaymentMethodModalOpen(false);
              setNewCardNumber("");
              setNewCardExpiry("");
              setNewCardCvc("");
              setNewIban("");
              setSelectedBank("");
            }}>
              {language === 'nl' ? 'Annuleren' : 'Cancel'}
            </Button>
            <Button 
              onClick={() => {
                setIsUpdatingPayment(true);
                
                // Simulate adding payment method
                setTimeout(() => {
                  const newId = `pm_${Date.now()}`;
                  let newMethod: PaymentMethod;
                  
                  if (newPaymentType === "card") {
                    const cardNumber = newCardNumber.replace(/\s/g, '');
                    newMethod = {
                      id: newId,
                      type: "card",
                      last4: cardNumber.slice(-4) || "4242",
                      brand: cardNumber.startsWith("4") ? "Visa" : cardNumber.startsWith("5") ? "Mastercard" : "Card",
                      expiryMonth: parseInt(newCardExpiry.split('/')[0]) || 12,
                      expiryYear: 2020 + parseInt(newCardExpiry.split('/')[1] || "27"),
                      isDefault: paymentMethods.length === 0,
                    };
                  } else if (newPaymentType === "sepa") {
                    newMethod = {
                      id: newId,
                      type: "sepa",
                      last4: newIban.slice(-4) || "0000",
                      isDefault: paymentMethods.length === 0,
                    };
                  } else {
                    const bankNames: Record<string, string> = {
                      abn: "ABN AMRO",
                      ing: "ING",
                      rabo: "Rabobank",
                      sns: "SNS Bank",
                      asn: "ASN Bank",
                      bunq: "bunq",
                      knab: "Knab",
                      triodos: "Triodos Bank",
                    };
                    newMethod = {
                      id: newId,
                      type: "ideal",
                      bankName: bankNames[selectedBank] || "iDEAL Bank",
                      isDefault: paymentMethods.length === 0,
                    };
                  }
                  
                  setPaymentMethods(prev => [...prev, newMethod]);
                  setPaymentMethodModalOpen(false);
                  setIsUpdatingPayment(false);
                  setNewCardNumber("");
                  setNewCardExpiry("");
                  setNewCardCvc("");
                  setNewIban("");
                  setSelectedBank("");
                  
                  toast.success(
                    language === 'nl' 
                      ? 'Betaalmethode toegevoegd!'
                      : 'Payment method added!',
                    {
                      description: language === 'nl'
                        ? 'Je nieuwe betaalmethode is succesvol toegevoegd.'
                        : 'Your new payment method has been added successfully.',
                    }
                  );
                }, 1500);
              }} 
              disabled={isUpdatingPayment || 
                (newPaymentType === "card" && (!newCardNumber || !newCardExpiry || !newCardCvc)) ||
                (newPaymentType === "sepa" && !newIban) ||
                (newPaymentType === "ideal" && !selectedBank)
              }
            >
              {isUpdatingPayment ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {language === 'nl' ? 'Toevoegen...' : 'Adding...'}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'nl' ? 'Toevoegen' : 'Add Method'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
