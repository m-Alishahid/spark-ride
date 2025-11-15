"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CalendarIcon, Check, Car, Package, User, Sparkles, ChevronRight, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  service,
  additionalServices,
  extraServices,
  timeSlots,
  allCities as cityStateMap,
  calculatePrice,
} from "@/utils/services";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import OrderSummaryAccordion from "@/components/OrderSummaryAccordion";
import Image from "next/image";

// ---------------- CONFIRMATION MODAL ----------------
const ConfirmationModal = ({ open, onClose, formData, total, subtotal, isPromoValid }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border border-border text-card-foreground shadow-soft rounded-xl">
        <DialogHeader className="text-center">
          {/* Spark Ride Logo with PNG */}
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-linear-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center p-4 border border-primary/20">
              <Image
                src="/sparkride.png" // Your PNG logo path
                alt="Spark Ride Logo"
                width={80}
                height={40}
                className="object-contain"
              />
            </div>
          </div>
          
          <DialogTitle className="text-2xl font-bold text-foreground text-center font-poppins">
            Booking Confirmed! 🎉
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-center mt-2">
            Thank you <span className="font-semibold text-foreground">{formData.firstName}</span>!
            Your booking has been successfully scheduled.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 border border-border rounded-lg bg-muted p-6">
          <h3 className="text-lg font-semibold mb-4 text-center text-foreground font-poppins">Appointment Details</h3>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <span className="font-medium text-muted-foreground">Vehicles:</span>
            <span className="text-right text-foreground">
              {formData.vehicles.map((v, i) => `${v.make} ${v.model}`).join(", ")}
            </span>
            <span className="font-medium text-muted-foreground">Date:</span>
            <span className="text-right text-foreground">
              {formData.date ? new Date(formData.date).toLocaleDateString() : "N/A"}
            </span>
            <span className="font-medium text-muted-foreground">Time Slot:</span>
            <span className="text-right text-foreground">{formData.timeSlot || "N/A"}</span>
            <span className="font-medium text-muted-foreground">Services:</span>
            <span className="text-right text-foreground">
              {formData.vehicles.some(v => v.selectedPackages.length > 0)
                ? formData.vehicles.flatMap(v => v.selectedPackages).join(", ")
                : "None"}
            </span>
            <span className="font-medium text-muted-foreground">Subtotal:</span>
            <span className="text-right text-foreground">${subtotal.toFixed(2)}</span>
            {isPromoValid && (
              <>
                <span className="font-medium text-green-600">Promo Discount:</span>
                <span className="text-right text-green-600">-${(subtotal - total).toFixed(2)}</span>
              </>
            )}
            <span className="font-medium text-foreground">Total:</span>
            <span className="font-bold text-primary text-right text-lg">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={onClose}
            className="w-full bg-primary text-white hover:bg-primary/90 transition-all duration-300 font-semibold shadow-soft hover:shadow-hover"
          >
            Return to Home
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
// ---------------- MAIN BOOKING COMPONENT ----------------
const Booking = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [date, setDate] = useState();
  const [promoCode, setPromoCode] = useState("");
  const [isPromoValid, setIsPromoValid] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/\D/g, "");
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };

  const [formData, setFormData] = useState({
    additionalServices: [],
    vehicles: [{ 
      make: "", 
      model: "", 
      year: "", 
      color: "", 
      size: "", 
      vehicleType: "", 
      selectedPackages: [] 
    }],
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    date: "",
    timeSlot: "",
    notes: "",
    serviceTypes: [],
    vehicleType: "",
  });

  // Helpers
  const updateForm = (updates) =>
    setFormData((prev) => ({ ...prev, ...updates }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateForm({ [name]: value });
  };

  const isStep1Valid = () => {
    if (formData.vehicles.length === 0) return false;
    for (const vehicle of formData.vehicles) {
      if (!vehicle.vehicleType) return false;
      if (!vehicle.make.trim() || !vehicle.model.trim() || !vehicle.year.trim() || !vehicle.color.trim()) return false;
      if ((vehicle.vehicleType === "boat" || vehicle.vehicleType === "rv") && !vehicle.size.trim()) return false;
    }
    return true;
  };

  const addVehicle = () => {
    setFormData(prev => ({
      ...prev,
      vehicles: [...prev.vehicles, { 
        make: "", 
        model: "", 
        year: "", 
        color: "", 
        size: "", 
        vehicleType: prev.vehicleType || "", 
        selectedPackages: [] 
      }]
    }));
  };

  const removeVehicle = (index) => {
    setFormData(prev => ({
      ...prev,
      vehicles: prev.vehicles.filter((_, i) => i !== index)
    }));
  };

  const updateVehicle = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      vehicles: prev.vehicles.map((v, i) => i === index ? { ...v, [field]: value } : v)
    }));
  };

  const toggleVehiclePackage = (vehicleIndex, packageId) => {
    setFormData(prev => ({
      ...prev,
      vehicles: prev.vehicles.map((v, i) => i === vehicleIndex ? {
        ...v,
        selectedPackages: v.selectedPackages.includes(packageId)
          ? v.selectedPackages.filter(p => p !== packageId)
          : [...v.selectedPackages, packageId]
      } : v)
    }));
  };

  const handleCheckboxChange = (id) => {
    setFormData((prev) => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(id)
        ? prev.additionalServices.filter((s) => s !== id)
        : [...prev.additionalServices, id],
    }));
  };

  const toggleServiceType = (type) => {
    setFormData((prev) => ({
      ...prev,
      serviceTypes: [type],
    }));
  };

  const handleDateChange = (date) => {
    setDate(date);
    updateForm({ date: date ? date.toISOString() : "" });
  };

  const calculateTotalPrice = () => {
    let total = 0;

    formData.vehicles.forEach((vehicle) => {
      vehicle.selectedPackages.forEach((packageId) => {
        if (Object.keys(extraServices.ceramiccoating).includes(packageId)) {
          const ceramicService = extraServices.ceramiccoating;
          total += ceramicService[packageId]?.price || 0;
        } else if (Object.keys(extraServices.windowtinting).includes(packageId)) {
          const tintingService = extraServices.windowtinting;
          total += tintingService[packageId]?.price || 0;
        } else {
          const serviceCategory = packageId.split("-")[0];
          total += calculatePrice(
            vehicle.vehicleType || formData.vehicleType,
            packageId,
            serviceCategory,
            Number(vehicle.size)
          );
        }
      });
    });

    formData.additionalServices.forEach((id) => {
      const add = additionalServices.find((a) => a.id === id);
      if (add) total += add.price;
    });

    return total;
  };

  const totalPrice = calculateTotalPrice();
  const discountedPrice = isPromoValid ? totalPrice * 0.85 : totalPrice;

  // Steps validation
  const validateStep = () => {
    if (step === 1) {
      if (formData.vehicles.length === 0) {
        toast({ 
          title: "Missing Vehicle Info", 
          description: "Please add at least one vehicle.",
          variant: "destructive" 
        });
        return false;
      }
      for (const vehicle of formData.vehicles) {
        if (!vehicle.vehicleType) {
          toast({ 
            title: "Missing Vehicle Info", 
            description: "Please select a vehicle type for each vehicle.",
            variant: "destructive" 
          });
          return false;
        }
        if (!vehicle.make.trim() || !vehicle.model.trim() || !vehicle.year.trim() || !vehicle.color.trim()) {
          toast({ 
            title: "Missing Vehicle Info", 
            description: "Please fill all required fields for each vehicle.",
            variant: "destructive" 
          });
          return false;
        }
        if ((vehicle.vehicleType === "boat" || vehicle.vehicleType === "rv") && !vehicle.size.trim()) {
          toast({ 
            title: "Missing Vehicle Info", 
            description: "Please enter size for each vehicle.",
            variant: "destructive" 
          });
          return false;
        }
      }
    }
    if (step === 2 && !formData.vehicles.some(v => v.selectedPackages.length > 0)) {
      toast({ 
        title: "Missing Service", 
        description: "Please select at least one package for at least one vehicle.",
        variant: "destructive" 
      });
      return false;
    }
    if (step === 3 && !formData.firstName) {
      toast({ 
        title: "Missing Info", 
        description: "Please enter your first name.",
        variant: "destructive" 
      });
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, totalPrice: discountedPrice }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Booking failed");
      }

      const result = await response.json();
      setShowConfirmation(true);
      toast({ 
        title: "Booking Successful", 
        description: "Your booking is confirmed." 
      });
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animations
  const fadeIn = { 
    hidden: { opacity: 0, y: 10 }, 
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } 
  };
  
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const firstVehicle = formData.vehicles[0];
  const firstVehicleComplete = firstVehicle && 
    firstVehicle.vehicleType && 
    firstVehicle.make.trim() && 
    firstVehicle.model.trim() && 
    firstVehicle.year.trim() && 
    firstVehicle.color.trim() && 
    ((firstVehicle.vehicleType === "boat" || firstVehicle.vehicleType === "rv") 
      ? firstVehicle.size.trim() 
      : true);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header Section */}
      <div className="bg-linear-to-br from-primary/5 via-background to-background-secondary pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-poppins">
              Book Your <span className="text-primary">Premium</span> Service
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the Spark Ride difference with our professional detailing services. 
              Get your vehicle looking showroom-ready.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Progress Bar - Desktop */}
          <div className="hidden lg:flex lg:w-1/4">
            <Card className="w-full bg-card border-border shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Booking Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { step: 1, label: "Vehicle Information", icon: <Car size={18} />, description: "Tell us about your vehicle" },
                  { step: 2, label: "Service Selection", icon: <Package size={18} />, description: "Choose your services" },
                  { step: 3, label: "Your Details", icon: <User size={18} />, description: "Finalize booking" },
                ].map(({ step: stepNum, label, icon, description }) => {
                  const isActive = step === stepNum;
                  const isCompleted = step > stepNum;

                  return (
                    <div key={stepNum} className="flex items-start space-x-3">
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        isActive 
                          ? "bg-primary border-primary text-white" 
                          : isCompleted 
                            ? "bg-green-500 border-green-500 text-white"
                            : "bg-muted border-border text-muted-foreground"
                      }`}>
                        {isCompleted ? <Check size={16} /> : icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm ${
                          isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                        }`}>
                          {label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{description}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Form Content */}
          <div className="lg:w-3/4">
            <Card className="border-border shadow-soft hover:shadow-hover transition-all duration-300">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit}>
                  <AnimatePresence initial={false} custom={direction} mode="wait">
                    {/* STEP 1 - Vehicle Information */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-8">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Car className="h-6 w-6 text-primary" />
                          </div>
                          <h2 className="text-2xl font-bold text-foreground font-poppins">Vehicle Information</h2>
                          <p className="text-muted-foreground mt-2">Tell us about the vehicle(s) you want serviced</p>
                        </div>

                        {/* Vehicle Type Selection */}
                        <div className="space-y-4">
                          <Label className="text-foreground font-medium">Vehicle Type *</Label>
                          <Select 
                            value={formData.vehicleType} 
                            onValueChange={(v) => setFormData(prev => ({ 
                              ...prev, 
                              vehicleType: v, 
                              vehicles: prev.vehicles.map((veh, i) => i === 0 ? { ...veh, vehicleType: v } : veh) 
                            }))}
                          >
                            <SelectTrigger className="h-12 bg-background border-border text-foreground">
                              <SelectValue placeholder="Select your vehicle type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sedan">🚗 Sedan</SelectItem>
                              <SelectItem value="suv">🚙 SUV</SelectItem>
                              <SelectItem value="truck">🚛 Truck</SelectItem>
                              <SelectItem value="van">🚐 Van</SelectItem>
                              <SelectItem value="boat">⛵ Boat</SelectItem>
                              <SelectItem value="rv">🏠 RV</SelectItem>
                              <SelectItem value="jetski">🏄 Jet Ski</SelectItem>
                              <SelectItem value="bike">🏍️ Bike</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Vehicle Details */}
                        {formData.vehicleType && (
                          <div className="space-y-6">
                            {formData.vehicles.map((vehicle, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="border border-border rounded-xl bg-card p-6 shadow-soft"
                              >
                                <div className="flex justify-between items-center mb-4">
                                  <div>
                                    <h3 className="text-lg font-semibold text-foreground">Vehicle {index + 1}</h3>
                                    {vehicle.vehicleType && (
                                      <p className="text-sm text-muted-foreground capitalize">
                                        {vehicle.vehicleType} Details
                                      </p>
                                    )}
                                  </div>
                                  {formData.vehicles.length > 1 && (
                                    <Button 
                                      type="button"
                                      onClick={() => removeVehicle(index)} 
                                      variant="outline"
                                      size="sm"
                                      className="text-destructive border-destructive/20 hover:bg-destructive/10"
                                    >
                                      <Trash2 size={16} className="mr-2" />
                                      Remove
                                    </Button>
                                  )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`make-${index}`}>Make *</Label>
                                    <Input
                                      id={`make-${index}`}
                                      placeholder="e.g., Toyota"
                                      value={vehicle.make}
                                      onChange={(e) => updateVehicle(index, 'make', e.target.value)}
                                      className="h-11 bg-background border-border"
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`model-${index}`}>Model *</Label>
                                    <Input
                                      id={`model-${index}`}
                                      placeholder="e.g., Camry"
                                      value={vehicle.model}
                                      onChange={(e) => updateVehicle(index, 'model', e.target.value)}
                                      className="h-11 bg-background border-border"
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`year-${index}`}>Year *</Label>
                                    <Input
                                      id={`year-${index}`}
                                      placeholder="e.g., 2023"
                                      value={vehicle.year}
                                      onChange={(e) => updateVehicle(index, 'year', e.target.value)}
                                      className="h-11 bg-background border-border"
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`color-${index}`}>Color *</Label>
                                    <Input
                                      id={`color-${index}`}
                                      placeholder="e.g., Blue"
                                      value={vehicle.color}
                                      onChange={(e) => updateVehicle(index, 'color', e.target.value)}
                                      className="h-11 bg-background border-border"
                                      required
                                    />
                                  </div>
                                  {(vehicle.vehicleType === "boat" || vehicle.vehicleType === "rv") && (
                                    <div className="space-y-2 md:col-span-2">
                                      <Label htmlFor={`size-${index}`}>Size (feet) *</Label>
                                      <Input
                                        id={`size-${index}`}
                                        placeholder="e.g., 24"
                                        value={vehicle.size}
                                        onChange={(e) => updateVehicle(index, 'size', e.target.value)}
                                        className="h-11 bg-background border-border"
                                        required
                                      />
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}

                        {/* Add Vehicle Button */}
                        {firstVehicleComplete && (
                          <Button 
                            type="button"
                            onClick={addVehicle} 
                            variant="outline"
                            className="w-full border-dashed border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5"
                          >
                            <Plus size={18} className="mr-2" />
                            Add Another Vehicle
                          </Button>
                        )}

                        {/* Navigation */}
                        <div className="flex justify-end pt-6 border-t border-border">
                          <Button 
                            type="button"
                            onClick={nextStep} 
                            disabled={!isStep1Valid()} 
                            className="bg-primary text-white hover:bg-primary/90 px-8 py-2.5"
                          >
                            Continue to Services
                            <ChevronRight size={18} className="ml-2" />
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2 - Service Selection */}
                    {step === 2 && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="space-y-6"
                      >
                        <div className="text-center mb-8">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="h-6 w-6 text-primary" />
                          </div>
                          <h2 className="text-2xl font-bold text-foreground font-poppins">Service Selection</h2>
                          <p className="text-muted-foreground mt-2">Choose the perfect services for your vehicle</p>
                        </div>

                        {/* Service Type Selection */}
                        <div className="space-y-4">
                          <Label className="text-foreground font-medium">Service Type</Label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {(formData.vehicleType === "bike" ? ["detailing"] : ["detailing", "ceramiccoating", "window_tinting"]).map((type) => {
                              const isSelected = formData.serviceTypes.includes(type);
                              const label = type === "detailing" ? "Detailing" : type === "ceramiccoating" ? "Ceramic Coating" : "Window Tinting";
                              const icon = type === "detailing" ? "✨" : type === "ceramiccoating" ? "🔮" : "🌅";
                              
                              return (
                                <div
                                  key={type}
                                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                    isSelected 
                                      ? "border-primary bg-primary/5 shadow-soft" 
                                      : "border-border bg-card hover:border-primary/50 hover:shadow-soft"
                                  }`}
                                  onClick={() => toggleServiceType(type)}
                                >
                                  <div className="text-2xl mb-2">{icon}</div>
                                  <div className="font-medium text-foreground text-sm">{label}</div>
                                  {isSelected && (
                                    <div className="flex items-center mt-2 text-primary text-xs">
                                      <Check size={14} className="mr-1" /> Selected
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Service Packages */}
                        {formData.vehicleType && formData.serviceTypes.length > 0 && (
                          <div className="space-y-6">
                            {formData.vehicles.map((vehicle, vehicleIndex) => (
                              <Card key={vehicleIndex} className="border-border bg-card">
                                <CardHeader className="pb-4">
                                  <CardTitle className="text-lg text-foreground">
                                    {vehicle.make} {vehicle.model} {vehicle.year}
                                    <span className="text-sm text-muted-foreground font-normal ml-2 capitalize">
                                      ({vehicle.vehicleType})
                                    </span>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  {formData.serviceTypes.includes("detailing") && (
                                    <div className="grid md:grid-cols-2 gap-4">
                                      {Object.entries(service[vehicle.vehicleType] || {}).map(
                                        ([serviceCategory, packagesOrService]) => {
                                          return Object.entries(packagesOrService).map(
                                            ([packageKey, pkg]) => {
                                              const packageId = `${serviceCategory}-${packageKey}`;
                                              const isSelected = vehicle.selectedPackages.includes(packageId);
                                              const price = calculatePrice(
                                                vehicle.vehicleType,
                                                packageId,
                                                serviceCategory,
                                                Number(vehicle.size)
                                              );

                                              return (
                                                <div
                                                  key={packageId}
                                                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                                    isSelected 
                                                      ? "border-primary bg-primary/5" 
                                                      : "border-border hover:border-primary/50"
                                                  }`}
                                                  onClick={() => toggleVehiclePackage(vehicleIndex, packageId)}
                                                >
                                                  <div className="flex justify-between items-start mb-3">
                                                    <span className="font-medium text-foreground">{pkg.name}</span>
                                                    <span className="text-lg font-bold text-primary">${price}</span>
                                                  </div>
                                                  <ul className="text-sm text-muted-foreground space-y-1">
                                                    {Array.isArray(pkg.includes)
                                                      ? pkg.includes.slice(0, 3).map((i, idx) => (
                                                          <li key={idx} className="flex items-start">
                                                            <Check size={14} className="mr-2 mt-0.5 text-primary shrink-0" />
                                                            {i}
                                                          </li>
                                                        ))
                                                      : null}
                                                  </ul>
                                                  {isSelected && (
                                                    <div className="flex items-center mt-3 text-primary text-sm">
                                                      <Check size={16} className="mr-2" /> Selected
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            }
                                          );
                                        }
                                      )}
                                    </div>
                                  )}

                                  {/* Additional Services */}
                                  {formData.vehicles.some(v => v.selectedPackages.length > 0) && (
                                    <div className="border-t border-border pt-6">
                                      <h4 className="font-semibold text-foreground mb-4">Additional Services</h4>
                                      <div className="grid md:grid-cols-2 gap-4">
                                        {additionalServices.map((svc) => (
                                          <div key={svc.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                                            <Checkbox
                                              id={`${svc.id}-${vehicleIndex}`}
                                              checked={formData.additionalServices.includes(svc.id)}
                                              onCheckedChange={() => handleCheckboxChange(svc.id)}
                                            />
                                            <Label htmlFor={`${svc.id}-${vehicleIndex}`} className="flex-1 cursor-pointer">
                                              <div className="font-medium text-foreground">{svc.name}</div>
                                              <div className="text-sm text-muted-foreground">+${svc.price}</div>
                                            </Label>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}

                        {/* Navigation */}
                        <div className="flex justify-between pt-6 border-t border-border">
                          <Button 
                            type="button"
                            onClick={prevStep} 
                            variant="outline"
                            className="border-border text-foreground hover:bg-muted"
                          >
                            Back
                          </Button>
                          <Button
                            type="button"
                            onClick={nextStep}
                            disabled={!formData.vehicles.some(v => v.selectedPackages.length > 0)}
                            className="bg-primary text-white hover:bg-primary/90 px-8 py-2.5"
                          >
                            Continue to Details
                            <ChevronRight size={18} className="ml-2" />
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3 - Customer Information */}
                    {step === 3 && (
                      <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
                        <div className="text-center mb-8">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                          <h2 className="text-2xl font-bold text-foreground font-poppins">Your Information</h2>
                          <p className="text-muted-foreground mt-2">Finalize your booking details</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Personal Information */}
                          <div className="space-y-4">
                            <h3 className="font-semibold text-foreground">Personal Information</h3>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="firstName">First Name *</Label>
                                <Input 
                                  id="firstName"
                                  name="firstName" 
                                  placeholder="John" 
                                  value={formData.firstName} 
                                  onChange={handleInputChange} 
                                  required 
                                  className="bg-background border-border"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input 
                                  id="lastName"
                                  name="lastName" 
                                  placeholder="Doe" 
                                  value={formData.lastName} 
                                  onChange={handleInputChange} 
                                  className="bg-background border-border"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email">Email Address *</Label>
                                <Input 
                                  id="email"
                                  name="email" 
                                  type="email" 
                                  placeholder="john@example.com" 
                                  value={formData.email} 
                                  onChange={handleInputChange} 
                                  required 
                                  className="bg-background border-border"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input
                                  id="phone"
                                  name="phone"
                                  placeholder="(555) 123-4567"
                                  value={formData.phone}
                                  onChange={(e) => {
                                    const formatted = formatPhoneNumber(e.target.value);
                                    setFormData((prev) => ({ ...prev, phone: formatted }));
                                  }}
                                  required
                                  className="bg-background border-border"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Location & Scheduling */}
                          <div className="space-y-4">
                            <h3 className="font-semibold text-foreground">Location & Scheduling</h3>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="address">Address *</Label>
                                <Input 
                                  id="address"
                                  name="address" 
                                  placeholder="123 Main Street" 
                                  value={formData.address} 
                                  onChange={handleInputChange} 
                                  required 
                                  className="bg-background border-border"
                                />
                              </div>
                              
                              <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-2">
                                  <Label htmlFor="city">City *</Label>
                                  <Input
                                    id="city"
                                    required
                                    name="city"
                                    value={formData.city}
                                    onChange={(e) => {
                                      const city = e.target.value;
                                      setFormData((prev) => ({
                                        ...prev,
                                        city,
                                        state: cityStateMap[city] || ""
                                      }));
                                    }}
                                    placeholder="City"
                                    className="bg-background border-border"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="state">State *</Label>
                                  <Input
                                    id="state"
                                    required
                                    name="state"
                                    value={formData.state}
                                    onChange={(e) =>
                                      setFormData((prev) => ({ ...prev, state: e.target.value }))
                                    }
                                    placeholder="State"
                                    className="bg-background border-border"
                                    readOnly={!!formData.city && !!cityStateMap[formData.city]}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="zip">ZIP Code *</Label>
                                  <Input
                                    id="zip"
                                    required
                                    name="zip"
                                    value={formData.zip}
                                    onChange={(e) =>
                                      setFormData((prev) => ({ ...prev, zip: e.target.value }))
                                    }
                                    placeholder="12345"
                                    className="bg-background border-border"
                                    maxLength={5}
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>Preferred Date *</Label>
                                <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                                  <PopoverTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      className={cn("w-full justify-start bg-background border-border text-foreground", !date && "text-muted-foreground")}
                                      onClick={() => setOpenCalendar(true)}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {date ? format(date, "PPP") : "Select a date"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent align="start" className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={date}
                                      onSelect={(day) => {
                                        handleDateChange(day);
                                        setOpenCalendar(false);
                                      }}
                                      disabled={(day) => day < new Date()}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>

                              <div className="space-y-2">
                                <Label>Preferred Time *</Label>
                                <Select
                                  value={formData.timeSlot}
                                  onValueChange={(val) => setFormData((prev) => ({ ...prev, timeSlot: val }))}
                                >
                                  <SelectTrigger className="bg-background border-border text-foreground">
                                    <SelectValue placeholder="Select time slot" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeSlots.map((slot) => (
                                      <SelectItem key={slot} value={slot}>
                                        {slot}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Additional Notes */}
                        <div className="space-y-2">
                          <Label htmlFor="notes">Special Instructions (Optional)</Label>
                          <Textarea
                            id="notes"
                            name="notes"
                            placeholder="Any special requests or instructions for our team..."
                            value={formData.notes}
                            onChange={handleInputChange}
                            className="bg-background border-border min-h-[100px]"
                          />
                        </div>

                        {/* Promo Code */}
                        <div className="border-t border-border pt-6">
                          <Label htmlFor="promoCode" className="text-foreground font-medium">Promo Code</Label>
                          <div className="flex gap-3 mt-2">
                            <Input
                              id="promoCode"
                              type="text"
                              placeholder="Enter promo code"
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value)}
                              className="flex-1 bg-background border-border"
                            />
                            <Button
                              type="button"
                              onClick={() => {
                                if (promoCode.toLowerCase() === "discount15") {
                                  setIsPromoValid(true);
                                  toast({ title: "Promo Applied", description: "15% discount applied successfully!" });
                                } else {
                                  setIsPromoValid(false);
                                  toast({ 
                                    title: "Invalid Code", 
                                    description: "Please check your promo code and try again.", 
                                    variant: "destructive" 
                                  });
                                }
                              }}
                              className="bg-primary text-white hover:bg-primary/90 whitespace-nowrap"
                            >
                              Apply Code
                            </Button>
                          </div>
                        </div>

                        {/* Order Summary */}
                        <OrderSummaryAccordion
                          formData={formData}
                          totalPrice={totalPrice}
                          discountedPrice={discountedPrice}
                          isPromoValid={isPromoValid}
                        />

                        {/* Navigation */}
                        <div className="flex justify-between pt-6 border-t border-border">
                          <Button 
                            type="button" 
                            onClick={prevStep} 
                            variant="outline"
                            className="border-border text-foreground hover:bg-muted"
                          >
                            Back
                          </Button>
                          <Button
                            type="submit"
                            disabled={isSubmitting || !formData.email}
                            className="bg-primary text-white hover:bg-primary/90 px-8 py-2.5"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Processing...
                              </>
                            ) : (
                              "Confirm Booking"
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          router.push("/");
        }}
        formData={formData}
        total={discountedPrice}
        subtotal={totalPrice}
        isPromoValid={isPromoValid}
      />
    </div>
  );
};

export default Booking;