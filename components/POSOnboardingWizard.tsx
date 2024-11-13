'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Upload } from 'lucide-react';
import { Loader } from '@/components/ui/loader';
import IndustrySelector from './IndustrySelector';
import { useTranslation } from 'react-i18next';

interface FormData {
  companyName: string;
  domainName: string;
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  companySize: string;
  position: string;
  companyLogo: File | null;
  industry: string;
}

interface POSOnboardingWizardProps {
  selectedPlan: string | null;
  currentStep: number;
  setStep: (step: number) => void;
}

export default function POSOnboardingWizard({
  selectedPlan,
  currentStep,
  setStep,
}: POSOnboardingWizardProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    domainName: '',
    phoneNumber: '',
    email: '',
    firstName: '',
    lastName: '',
    companySize: '',
    position: '',
    companyLogo: null,
    industry: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0] || null;
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else if (name === 'phoneNumber') {
      const phoneValue = value.startsWith('+968') ? value : '+968' + value.replace('+968', '');
      setFormData((prev) => ({ ...prev, [name]: phoneValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};

    switch (step) {
      case 1:
        if (!formData.companyName) newErrors.companyName = t('validation.required.companyName');
        if (!formData.domainName) newErrors.domainName = t('validation.required.domainName');
        if (!formData.phoneNumber) {
          newErrors.phoneNumber = t('validation.required.phoneNumber');
        } else if (!formData.phoneNumber.startsWith('+968')) {
          newErrors.phoneNumber = t('validation.format.phoneNumber');
        }
        if (!formData.email) {
          newErrors.email = t('validation.required.email');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = t('validation.format.email');
        }
        break;
      case 2:
        if (!formData.firstName) newErrors.firstName = t('validation.required.firstName');
        if (!formData.lastName) newErrors.lastName = t('validation.required.lastName');
        if (!formData.companySize) newErrors.companySize = t('validation.required.companySize');
        if (!formData.position) newErrors.position = t('validation.required.position');
        break;
      case 3:
        if (!formData.industry) newErrors.industry = t('validation.required.industry');
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const simulateProcessing = () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });
  };

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      setIsProcessing(true);
      await simulateProcessing();
      setIsProcessing(false);

      if (currentStep < 4) {
        setStep(currentStep + 1);
      } else {
        router.push('/dashboard');
      }
    }
  };

  const handleBack = async () => {
    if (currentStep > 1) {
      setIsProcessing(true);
      await simulateProcessing();
      setIsProcessing(false);
      setStep(currentStep - 1);
    }
  };

  const steps = [
    {
      title: t('onboarding.steps.business.title'),
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">{t('onboarding.fields.companyName')}</Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder={t('onboarding.placeholders.companyName')}
              className={errors.companyName ? 'border-red-500' : ''}
              disabled={isProcessing}
            />
            {errors.companyName && (
              <p className="text-sm text-red-500">{errors.companyName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="domainName">{t('onboarding.fields.domainName')}</Label>
            <Input
              id="domainName"
              name="domainName"
              value={formData.domainName}
              onChange={handleInputChange}
              placeholder={t('onboarding.placeholders.domainName')}
              className={errors.domainName ? 'border-red-500' : ''}
              disabled={isProcessing}
            />
            {errors.domainName && (
              <p className="text-sm text-red-500">{errors.domainName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">{t('onboarding.fields.phoneNumber')}</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="+968"
              className={errors.phoneNumber ? 'border-red-500' : ''}
              disabled={isProcessing}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('onboarding.fields.email')}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('onboarding.placeholders.email')}
              className={errors.email ? 'border-red-500' : ''}
              disabled={isProcessing}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      title: t('onboarding.steps.personal.title'),
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t('onboarding.fields.firstName')}</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder={t('onboarding.placeholders.firstName')}
                className={errors.firstName ? 'border-red-500' : ''}
                disabled={isProcessing}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">{t('onboarding.fields.lastName')}</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder={t('onboarding.placeholders.lastName')}
                className={errors.lastName ? 'border-red-500' : ''}
                disabled={isProcessing}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companySize">{t('onboarding.fields.companySize')}</Label>
            <Select 
              onValueChange={(value) => setFormData((prev) => ({ ...prev, companySize: value }))}
              value={formData.companySize}
              disabled={isProcessing}
            >
              <SelectTrigger className={errors.companySize ? 'border-red-500' : ''}>
                <SelectValue placeholder={t('onboarding.placeholders.companySize')} />
              </SelectTrigger>
              <SelectContent>
                {['1-10', '11-50', '51-200', '201+'].map((size) => (
                  <SelectItem key={size} value={size}>
                    {t(`onboarding.companySizes.${size}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.companySize && (
              <p className="text-sm text-red-500">{errors.companySize}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">{t('onboarding.fields.position')}</Label>
            <Input
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              placeholder={t('onboarding.placeholders.position')}
              className={errors.position ? 'border-red-500' : ''}
              disabled={isProcessing}
            />
            {errors.position && (
              <p className="text-sm text-red-500">{errors.position}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyLogo">{t('onboarding.fields.companyLogo')}</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="companyLogo"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-[#0449a9] hover:text-[#0449a9]/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#0449a9]"
                  >
                    <span>{t('onboarding.actions.uploadFile')}</span>
                    <input
                      id="companyLogo"
                      name="companyLogo"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleInputChange}
                      disabled={isProcessing}
                    />
                  </label>
                  <p className="pl-1">{t('onboarding.actions.dragAndDrop')}</p>
                </div>
                <p className="text-xs text-gray-500">{t('onboarding.fileTypes')}</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('onboarding.steps.industry.title'),
      content: (
        <div className="space-y-4">
          <IndustrySelector
            value={formData.industry}
            onChange={(value) => setFormData((prev) => ({ ...prev, industry: value }))}
            disabled={isProcessing}
          />
          {errors.industry && (
            <p className="text-sm text-red-500">{errors.industry}</p>
          )}
        </div>
      ),
    },
    {
      title: t('onboarding.steps.confirmation.title'),
      content: (
        <div className="space-y-6 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
          <div>
            <h3 className="text-lg font-medium">{t('onboarding.steps.confirmation.heading')}</h3>
            <p className="mt-2 text-sm text-gray-500">
              {t('onboarding.steps.confirmation.description')}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900">{t('onboarding.steps.confirmation.summary')}</h4>
            <dl className="mt-2 divide-y divide-gray-200">
              <div className="py-2 flex justify-between">
                <dt className="text-sm text-gray-500">{t('onboarding.fields.company')}</dt>
                <dd className="text-sm text-gray-900">{formData.companyName}</dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="text-sm text-gray-500">{t('onboarding.fields.contact')}</dt>
                <dd className="text-sm text-gray-900">{formData.email}</dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="text-sm text-gray-500">{t('onboarding.fields.industry')}</dt>
                <dd className="text-sm text-gray-900">{formData.industry}</dd>
              </div>
            </dl>
          </div>
        </div>
      ),
    },
  ];

  if (isProcessing) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <Card className="p-6">
          <div className="min-h-[400px] flex items-center justify-center">
            <Loader text={t('common.processing')} />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center ${
                index < steps.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  index + 1 <= currentStep
                    ? 'border-[#0449a9] bg-[#0449a9] text-white'
                    : 'border-gray-300 bg-white text-gray-500'
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 ${
                    index + 1 < currentStep ? 'bg-[#0449a9]' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="p-6">
        <h2 className="mb-6 text-2xl font-bold">{steps[currentStep - 1].title}</h2>
        {steps[currentStep - 1].content}
        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || isProcessing}
          >
            {t('common.back')}
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-[#0449a9] hover:bg-[#0449a9]/90 text-white"
            disabled={isProcessing}
          >
            {currentStep === steps.length ? t('onboarding.actions.complete') : t('common.next')}
          </Button>
        </div>
      </Card>
    </div>
  );
}